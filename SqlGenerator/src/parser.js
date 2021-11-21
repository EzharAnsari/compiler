const { Lexer, Position, Token } = require("./lexer");
const { QueryObject, ConditionNode } =require("./syntatx");


LEFTPAREN = '(';
RIGHTPAREN = ')';
COMMA = ',';
SEMICOLON = ';';
DOT = '.';
INT = 'int';
FLOAT = 'float';
ID = 'id';
FROM = 'from';
WHERE = 'where';
SELECT = 'select';
AND = 'and';
OR = 'or';
EQUAL = '=';
LIKE = 'like';
IN = 'IN';
EOF = 'EOF';
STRING = 'string';
LESSTHAN = '<';
GREATTHAN = '>';

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

  line() {
    if (this.match(FROM) && this.fromEntity() && this.match(WHERE) && this.condition2() && this.match(SELECT) && this.selEntity()) {
      return true;
    }
    else {
      return false;
    }
  }

  // condition Method 
  condition2() {

    if (this.lookahead.type === ID) {
      let object = this.lookahead;
      this.match(this.lookahead.type);
      let operator = this.lookahead;
      if ( !this.operator()) {
        return false;
      }
      let value = this.lookahead;
      if ( !this.constant()) {
        return false;
      }

      let logOpToNextCondition = this.lookahead;
      
      if ( !this.conditionNext() ) {
        logOpToNextCondition = null;
      }
      this.queryResult.conditionList.push(new ConditionNode(object, operator, value, logOpToNextCondition));

      if (logOpToNextCondition != null) {
        return this.condition2();
      }
      return true;
    }
    else {
      console.log("expected ID")
      return false;
    }
  }

  conditionNext() {
    if (this.match(AND) || this.match(OR)) {
      return true;
    }
    return false;
  }

  fromEntity() {
    let tem = this.lookahead;
    if (this.match(ID)) {
      this.queryResult.fromList.push(tem);
      if (this.match(COMMA)) {
        return this.fromEntity();
      }
      return true;
    }
    return false;
  }

  selEntity() {
    let tem = this.lookahead;
    if (this.match(ID)) {
      this.queryResult.selectList.push(tem);
      if (this.match(COMMA)) {
        return this.selEntity();
      }
      return true;
    }
    return false;
  }

  constant() {
    if (this.match(STRING) || this.match(INT) || this.match(FLOAT)) {
      return true;
    }
    return false;
  }

  operator() {
    if (this.match(GREATTHAN) || this.match(LESSTHAN) || this.match(EQUAL)) {
      return true;
    }
    return false;
  }


}

module.exports = {Parser}