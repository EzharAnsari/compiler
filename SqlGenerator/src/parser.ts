import { Lexer, Token, FROM, INT, AS, STAR, IS, NOT, WHERE, SELECT, ID, JOIN, LEFT, RIGHT, FULL, ON, INNER, LEFTPAREN, RIGHTPAREN, AND, OR, IN, LESSTHAN, EQUAL, GREATTHAN, LESSTHANOREQUAL, GREATTHANOREQUAL, LIKE, STRING, FLOAT, COMMA, DOT } from './lexer'
import { IntermediateQuery, ConditionNode } from './intermediateQuery'


 // parser 
export class Parser {
  lexer: Lexer
  lookahead: Token
  queryResult: IntermediateQuery

  constructor(str: string) {
    this.lexer = new Lexer('<stdio>', str)
    this.lookahead = this.getToken()
    this.queryResult = new IntermediateQuery()
  }

  getToken(): Token {
    let tem = this.lexer.getToken();
    // console.log(tem);
    return tem;
  }

  match(type:string): boolean{
    if (this.lookahead.type === type) {
      this.lookahead = this.getToken();
      return true;
    }
    return false;
  }

  parse(): boolean {
    if (this.line()) {
      return true;
    }
    return false;
    // return this.queryResult;
  }


  // grammar rule
  // from RELATIONS where COND select COLUMNLIST
  // from RELATIONS select COLUMNLIST
  line(): boolean {
    if (this.match(FROM) && this.relations()) {
      console.log(this.lookahead)
      let temPostion =  this.lexer.pos.copy();
      if (this.match(WHERE) && this.condition() && this.match(SELECT) && this.columnList()) {
        return true;
      }
      this.lexer.pos = temPostion;
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
    if (this.table()) {
      let temPostion =  this.lexer.pos.copy();
      if (this.joinCondition()) {
        return true;
      }
      this.lexer.pos = temPostion;
      return true;
    }
    return false;
  }

  // grammar rule
  // id
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
    let temPostion = this.lexer.pos.copy();
    if (this.joinType() && this.match(JOIN) && this.table() && this.match(ON) && this.condition()) {
      this.joinCondition();
      return true;
    }
    this.lexer.pos = temPostion;
    return true;
  }

  joinType(): boolean {
    if (this.match(INNER) || this.match(LEFT) || this.match(RIGHT) || this.match(FULL)) {
      return true;
    }
    return false;
  }


  // grammar rule
  // CONDITION -> OBJECT OPRATOR CONSTANT
  // | OBJECT OPRATOR CONSTANT LOGICALOPERATOR CONDITION
  // | ( CONDITION LOGICALOPERATOR CONDITION )
  // | OBJECT in ARRAYOFCONSTANT
  condition(): boolean {
    if (this.match(LEFTPAREN)) {
      if (this.condition() && this.logicalOperator() && this.condition() && this.match(RIGHTPAREN)) {
        return true;
      }
    }
    else if(this.match(ID)) {
      if (this.match(IN) && this.arrayOfConstant()) {
        return true
      }
      else if(this.operator() && this.constant()) {
        if(this.logicalOperator()) {
          if (this.condition()) {
            return true
          }
          return false
        }
        return true
      }
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
    let temPostion =  this.lexer.pos.copy();
    if(this.objectTypeColumn()) {
      return true
    }
    this.lexer.pos = temPostion;
    if(this.simpleList()) {
      return true
    }
    this.lexer.pos = temPostion;
    return false
  }

  //Grammar rule
  //OBJECTTYPECOLUMN -> TABLE '.' id
  //  | TABLE '.' id ',' OBJECTTYPECOLUMN
  //  | TABLE '.' id ',' as id
  objectTypeColumn(): boolean {
    if(this.table() && this.match(DOT) && this.match(ID)) {
      if(this.match(COMMA)) {
        if (this.match(AS) && this.match(ID)) {
          return true
        }
        else if(this.objectTypeColumn()) {
          return true
        }
        return false
      }
      return true
    }
    return false
  }

  //Grammar rule
  //SIMPLELIST -> TABLE
  //  | TABLE ',' SIMPLELIST
  simpleList(): boolean {
    if(this.table()) {
      if(this.match(COMMA)) {
        if(this.simpleList()) {
          return true
        }
        return false
      }
      return true
    }
    return false

  }
}
