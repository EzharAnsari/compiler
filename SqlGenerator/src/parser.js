const { Lexer } = require("./lexer");
const { QueryObject, ConditionNode } =require("./syntatx");


LEFTPAREN = '(';
RIGHTPAREN = ')';
COMMA = ',';
SEMICOLON = ';';
DOT = '.';
INT = 'int';
FLOAT = 'float';
ID = 'id';
AND = 'and';
OR = 'or';
EQUAL = '=';
LIKE = 'like';
IN = 'IN';
EOF = 'EOF';
STRING = 'string';
LESSTHAN = '<';
GREATTHAN = '>';

// keyword
FROM = 'from';
WHERE = 'where';
SELECT = 'select';
INNER = 'inner';
LEFT = 'left';
RIGHT = 'right';
FULL = 'full';
JOIN = 'join';
ON = 'on';

// parser 
class Parser {
  constructor(str) {
    this.lexer = new Lexer('<stdio>', str);
    // this.tokens = this.lexer.getListOfTokens();
    this.lookahead = null;
    // this.tokenIdx = -1;
    this.queryResult = new QueryObject();
    this.currentCondition = null;
  }

  setNextToken() {
    this.tokenIdx += 1;
    if (this.tokenIdx < this.tokens.length) {
      this.lookahead = this.tokens[this.tokenIdx];
    }
  }

  getToken() {
    let tem = this.lexer.getToken();
    // console.log(tem);
    return tem;
  }

  match(type){
    if (this.lookahead.type === type) {
      this.lookahead = this.getToken();
      return true;
    }
    return false;
  }

  parse() {
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
  line() {
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
  relations() {
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
  table() {
    if (this.match(ID)) {
      return true;
    }
    return false;
  }

  // grammar rule
  // JOINTYPE join TABLE on CONDITION
  // JOINTYPE join TABLE on CONDITION JOINCONDITION
  joinCondition() {
    let temPostion = this.lexer.pos.copy();
    if (this.joinType() && this.match(JOIN) && this.table() && this.match(ON) && this.condition()) {
      this.joinCondition();
      return true;
    }
    this.lexer.pos = temPostion;
    return true;
  }

  joinType() {
    if (this.match(INNER) || this.match(LEFT) || this.match(RIGHT) || this.match(FULL)) {
      return true;
    }
    return false;
  }

}

module.exports = {Parser}