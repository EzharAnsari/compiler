import { Lexer, Position, Token, FROM, INT, AS, STAR, IS, NOT, WHERE, SELECT, ID, JOIN, LEFT, RIGHT, FULL, ON, INNER, LEFTPAREN, RIGHTPAREN, AND, OR, IN, LESSTHAN, EQUAL, GREATTHAN, LESSTHANOREQUAL, GREATTHANOREQUAL, LIKE, STRING, FLOAT, COMMA, DOT } from './lexer'
import { IntermediateQuery, ArrayNode, ObjectNode, MemberNode, ConstantNode, BinaryOpNode } from './intermediateQuery'

type positionAndToken = {
  pos: Position,
  token: Token,
  char: string,
  IQ: IntermediateQuery
}

 // parser 
export class Parser {
  lexer: Lexer
  lookahead: Token
  queryResult: IntermediateQuery
  queryResults: IntermediateQuery[]

  constructor(str: string) {
    this.lexer = new Lexer('<stdio>', str)
    this.lookahead = this.getToken()
    this.queryResult = new IntermediateQuery()
    this.queryResults = []
  }

  getToken(): Token {
    let tem = this.lexer.getToken();
    return tem;
  }

  getPosition(): Position {
    return this.lexer.pos.copy()
  }

  setPosition(value: Position): void {
    this.lexer.pos = new Position(value.idx, value.ln, value.col, value.fileName, value.ftxt)
  }

  getPosAndToken(): positionAndToken {
    let tem: positionAndToken = {
      pos: this.getPosition(),
      token: this.lookahead,
      char: this.lexer.getCurrentChar(),
      IQ: this.queryResult.copy()
    }
    return tem
  }

  setPosAndToken(value: positionAndToken): void {
    this.lookahead = value.token
    this.setPosition(value.pos)
    this.lexer.currentChar = value.char
    this.queryResult.reset(value.IQ)
  }

  match(type:string): boolean{
    if (this.lookahead.type === type) {
      this.lookahead = this.getToken();
      return true;
    }
    return false;
  }

  parse(): boolean {
    if (this.lines()) {
      return true;
    }
    return false;
    // return this.queryResult;
  }

  // Grammer rule
  // LINE newLine LINES
  // LINE
  lines(): boolean {
    if (this.line()) {
      this.queryResults.push(this.queryResult)
      this.queryResult = new IntermediateQuery()
      // console.log(this.lookahead)
      if (this.lookahead.type === FROM) {
        console.log(this.lookahead)
        console.log(this.queryResults)
        return this.lines()
      }
      return true
    }
    return false
  }

  // grammar rule
  // from RELATIONS where COND select COLUMNLIST
  // from RELATIONS select COLUMNLIST
  line(): boolean {
    if (this.match(FROM) && this.relations()) {
      let tem: positionAndToken =  this.getPosAndToken()
      if (this.match(WHERE)) {
        let result = this.condition()
        if (result) {
          this.queryResult.setCondition(result)
          
          if (this.match(SELECT) && this.columnList()) {
            return true;
          }
        }
      }
      this.setPosAndToken(tem)
      if (this.match(SELECT) && this.columnList()) {
        return true
      }
    }
    return false;
  }


  // grammar rule
  // TABLE
  // TABLE JOINCONDITION
  relations(): boolean {
    let temToken = this.lookahead
    if (this.table()) {
      this.queryResult.fromList.push(temToken)
      let tem: positionAndToken =  this.getPosAndToken()
      if (this.joinCondition()) {
        return true;
      }
      this.setPosAndToken(tem)
      return true;
    }
    return false;
  }

  // grammar rule
  // TABLE -> id
  table(): boolean {
    if (this.match(ID)) {
      return true;
    }
    return false;
  }

  // grammar rule
  // JOINTYPE join TABLE on CONDITION
  // JOINTYPE join TABLE on CONDITION JOINCONDITION
  joinCondition(): boolean {
    let tem: positionAndToken =  this.getPosAndToken()
    if (this.joinType() && this.match(JOIN) ) {
      let joinTable = this.lookahead.value
      if(this.table() && this.match(ON)) {
        this.queryResult.joinClause.setJoinTable(joinTable)
        let result = this.condition()
        if (result) {
          this.queryResult.joinClause.setJoinCondition(result)
          this.queryResult.joinClause.setIsUsed(true)
          return true
        }
      }
    }
    this.setPosAndToken(tem)
    return true;
  }

  joinType(): boolean {
    let type = this.lookahead.type
    if (this.match(INNER) || this.match(LEFT) || this.match(RIGHT) || this.match(FULL)) {
      this.queryResult.joinClause.setJoinType(type)
      return true;
    }
    return false;
  }


  // grammar rule
  // CONDITION -> OBJECT OPRATOR CONSTANT
  // | OBJECT OPRATOR CONSTANT LOGICALOPERATOR CONDITION
  // | ( CONDITION LOGICALOPERATOR CONDITION )
  // | OBJECT in ARRAYOFCONSTANT

  constant1(): any {
    let tok = this.lookahead

    switch(tok.type) {
      case LEFTPAREN:
        this.match(LEFTPAREN); let result = this.condition(); this.match(RIGHTPAREN); return result;
      case ID:
      {
        this.match(ID)
        if (this.match(DOT)) {
          let tok2 = this.lookahead
          this.match(ID)
          return new MemberNode(tok, tok2)
        }
        return new ObjectNode(tok)
      }
      case INT:
        this.match(INT); return new ConstantNode(tok)
      case FLOAT:
        this.match(FLOAT); return new ConstantNode(tok)
      case STRING:
        this.match(STRING); return new ConstantNode(tok)
      default:
        console.log("Syntax Error"); return false;
    }
  }

  condition(): any {
    let left = this.orOperation()
    let opTok = this.lookahead
    if(this.match(AND)) {
      let right = this.condition()

      left = new BinaryOpNode(left, opTok, right)
    }
    return left
  }

  orOperation(): any {
    let left = this.simpleOperation()
    let opTok = this.lookahead
    if(this.match(OR)) {
      let right = this.orOperation()

      left = new BinaryOpNode(left, opTok, right)
    }
    return left
  }

  simpleOperation(): any {
    let left = this.constant1()
    let opTok = this.lookahead
    if(this.operator()) {
      let right = this.simpleOperation()

      left = new BinaryOpNode(left, opTok, right)
    }

    else if (this.match(IN) && this.match(LEFTPAREN)) {
      let temRight: Array<Token> = [this.lookahead]
      this.match(this.lookahead.type)
      while(this.match(COMMA)) {
        temRight.push(this.lookahead)
        this.match(this.lookahead.type)
      }
      if(this.match(RIGHTPAREN)) {
        let right = new ArrayNode(temRight)

        left = new BinaryOpNode(left, opTok, right)
      }
    }
    return left
  }

  // Grammar rule
  //OBJECT -> TABLE
  //  | TABLE '.' id
  //  | CONSTANT
  object():boolean {
    let tem: positionAndToken =  this.getPosAndToken()
    if(this.table() && this.match(DOT) && this.match(ID)) {
      return true
    }
    this.setPosAndToken(tem)
    if(this.table()) {
      return true
    }
    this.setPosAndToken(tem)
    if(this.constant()) {
      return true
    }
    return false

  }

  // Grammar rule
  //OPRATOR -> '<', '=', '>', '>=', '<=', like, is, not
  operator(): boolean {
    if(this.match(LESSTHAN) || this.match(EQUAL) || this.match(GREATTHAN) || this.match(LESSTHANOREQUAL) || this.match(GREATTHANOREQUAL) || this.match(LIKE) || this.match(IS) || this.match(NOT)) {
      return true
    }
    return false
  }

  //Grammar rule
  // CONSTANT -> string, int, float
  constant(): boolean {
    if (this.match(STRING) || this.match(INT) || this.match(FLOAT)) {
      return true
    }
    return false
  }

  // Grammar rule
  //LOGICALOPERATOR -> and, or
  logicalOperator(): boolean {
    if (this.match(AND) || this.match(OR)) {
      return true
    }
    return false
  }

  //Grammar rule
  // ARRAYOFCONSTANT -> CONSTANT
  //  | CONSTANT ',' ARRAYOFCONSTANT
  arrayOfConstant(): boolean {
    if(this.constant()) {
      if (this.match(COMMA)) {
        if(this.arrayOfConstant()) {
          return true
        }
        return false
      }
      return true
    }
    return false
  }

  //Grammar rule
  //COLUMNLIST -> SIMPLELIST,  *, OBJECTTYPECOLUMN
  columnList(): boolean {
    if(this.match(STAR)) {
      return true
    }
    let result = this.constant1()
    if (result) {
      this.queryResult.selectList.push(result)
      while(this.match(COMMA)) {
        this.columnList()
      }
      return true
    }
    return false
  }
}