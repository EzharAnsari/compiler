import { Lexer, Token, FROM, WHERE, SELECT, ID, JOIN, LEFT, RIGHT, FULL, ON, INNER, LEFTPAREN } from './lexer'
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
    this.lookahead = this.getToken();
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
      
    }
    
    return true
  }

  columnList(): boolean {
    // Not defiend
    return true
  }

}
