// ***************** Grammar Rule ****************** //
 /**
  * LINE -> from FROMENTITY where COND select SELECTENTITY
  * 
  * FROMENTITY -> IDENTIFIERS
  * 
  * SELECTENTITY -> IDENTIFIERS
  * 
  * IDENTIFIERS -> id
  *   | id ',' IDENTIFIERS
  * 
  * COND -> OBJECT OPRATOR CONSTANT
  *   | OBJECT OPRATOR CONSTANT CONN COND
  *   | ( COND CONN COND )
  * 
  * CONSTANT -> string
  *   | int
  *   | float
  * 
  * OPRATOR -> '<'
  *   | '='
  *   | '>'
  * 
  * OBJECT -> id
  * 
  * CONN -> and
  *   | or
  * 
  */


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


const keywordList = ["where", "from", "select", "and", "or"];

class Position {
  constructor(idx, ln, col, fileName, ftxt) {
    this.idx = idx;
    this.ln = ln;
    this.col = col;
    this.fileName = fileName;
    this.ftxt = ftxt;
  }


  copy() {
    return new Position(this.idx, this.ln, this.col, this.fileName, this.ftxt);
  }
}

// ********************* Token ************************ //

class Token {
  constructor(type, value = null) {
    this.type = type;
    this.value = value;
  }
}

//  Lexer 
class Lexer {
  constructor(fileName, text) {
    this.text = text;
    this.fileName = fileName;
    this.pos = new Position(-1, 0, -1, fileName, text);
    this.currentChar = null;
    this.setCurrentChar();
  }

  nextPos() {
    this.pos.idx += 1;
    this.pos.col += 1;

    if (this.currentChar === '\n') {
      this.pos.ln += 1;
      this.pos.col = 0;
    }
  }

  setCurrentChar() {
    this.nextPos();
    if (this.pos.idx < this.text.length) {
      this.currentChar = this.text[this.pos.idx];
    }
    else this.currentChar = null;
  }

  isCharacterALetter(char) {
    return (/[a-zA-Z]/).test(char)
  }

  isCharacterADigit(char) {
    return (/[0-9]/).test(char)
  }

  makeNumber() {
    let numStr = '';
    let dotCount = 0;
    while (this.currentChar != null && this.isCharacterADigit(this.currentChar) || this.currentChar === '.') {
      if (this.currentChar === '.') {
        if (dotCount === 1) {
          break;
        }
        dotCount += 1;
        numStr += '.';
      }
      else {
        numStr += this.currentChar;
      }
      this.setCurrentChar();
    }
    if (dotCount === 0) {
      return new Token(INT, parseInt(numStr));
    }
    else {
      return  new Token(FLOAT, parseFloat(numStr));
    }
  }

  makeID() {
    let str = '';
    while(this.currentChar != null) {
      if (this.isCharacterADigit(this.currentChar) || this.isCharacterALetter(this.currentChar)) {
        str += this.currentChar;
        this.setCurrentChar();
      }
      else {
        break;
      }
    }
    if (keywordList.includes(str)) {
      return new Token(str.toLowerCase());
    }
    return new Token(ID, str);
  }

  makeString() {
    let str = '';
    let singleQuote = 39;
    let doubleQuote = 34;
    let currentQuote;
    if (this.currentChar.charCodeAt(0) === singleQuote) {
      currentQuote = singleQuote;
    }
    else if (this.currentChar.charCodeAt(0) === doubleQuote) {
      currentQuote = doubleQuote;
    }
    this.setCurrentChar();
    while(this.currentChar != null) {
      if (this.isCharacterADigit(this.currentChar) || this.isCharacterALetter(this.currentChar)) {
        str += this.currentChar;
        this.setCurrentChar();
      }
      else if (this.currentChar.charCodeAt(0) == currentQuote) {
        this.setCurrentChar();
        break;
      }
      else {
        console.log("expecting ' ");
        break;
      }
    }
    return new Token(STRING, str);
  }

  getToken() {

    if (this.currentChar === null) {
      return new Token(EOF);
    }

    else if (this.currentChar != null) {
      if (this.currentChar === ' ' || this.currentChar === '\t' || this.currentChar === '\n') {
        this.setCurrentChar();
        return this.getToken();
      }
      else if (this.isCharacterADigit(this.currentChar)) {
        return this.makeNumber();
      }
      else if (this.isCharacterALetter(this.currentChar)) {
        return this.makeID();
      }
      else if(this.currentChar.charCodeAt(0) === 39 || this.currentChar.charCodeAt(0) === 34) {
        return this.makeString();
      }
      else if (this.currentChar === '=') {
        this.setCurrentChar();
        return new Token(EQUAL);
      }
      else if (this.currentChar === ',') {
        this.setCurrentChar();
        return new Token(COMMA);
      }
      else if (this.currentChar === '<') {
        this.setCurrentChar();
        return new Token(LESSTHAN);
      }
      else if (this.currentChar === '>') {
        this.setCurrentChar();
        return new Token(GREATTHAN);
      }
      else {
        console.log("Illegal token");
        return null;
      }
    }
  }

  getListOfTokens() {
    let tokens = [];

    while (this.currentChar != null) {
      if (this.currentChar === ' ' || this.currentChar === '\t' || this.currentChar === '\n') {
        this.setCurrentChar();
      }
      else if (this.isCharacterADigit(this.currentChar)) {
        tokens.push(this.makeNumber());
      }
      else if (this.isCharacterALetter(this.currentChar)) {
        tokens.push(this.makeID());
      }
      else if(this.currentChar.charCodeAt(0) === 39 || this.currentChar.charCodeAt(0) === 34) {
        tokens.push(this.makeString());
      }
      else if (this.currentChar === '=') {
        this.setCurrentChar();
        tokens.push(new Token(EQUAL));
      }
      else if (this.currentChar === ',') {
        this.setCurrentChar();
        tokens.push(new Token(COMMA));
      }
      else {
        console.log("Illegal token");
        return [];
      }
    }
    tokens.push(new Token(EOF));
    return tokens;
  }

  test() {
    let tem = this.getToken();
    // console.log(tem);
    while(tem != null && tem.type != EOF && this.currentChar != null) {
      tem = this.getToken();
      // console.log(tem);
    }
  }
}

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

// intermediate Representation
class QueryObject {
  constructor() {
    this.selectList = [];
    this.fromList = [];
    this.conditionList = [];
  }

  queryGenerate() {
    let i = 0;
    let result = "SELECT ";

    for(i=0; i<this.selectList.length; i++) {
      result += this.selectList[i].value
      if (this.selectList.length != (i+1))
        result += ", ";
      else
        result += " " 
    } 
    
    result += "FROM ";

    for(i=0; i<this.fromList.length; i++) {
      result += this.fromList[i].value
      if (this.fromList.length != (i+1))
        result += ", ";
      else
        result += " " 
    }

    result += "WHERE ";

    for(i=0; i<this.conditionList.length; i++) {
      let temConditionNode = this.conditionList[i];
      result += temConditionNode.object.value;
      result += temConditionNode.operator.type;
      switch(temConditionNode.value.type) {
        case INT:
        case FLOAT:
          result += temConditionNode.value.value;
          break;
        case STRING:
          result += "'" + temConditionNode.value.value + "'";
          break;
        default:
          console.log("Invalid constant type");
      }
      if (temConditionNode.logOpToNextCondition){
        result += " " + temConditionNode.logOpToNextCondition.type;
      }

      if (this.conditionList.length != i+1) {
        result += " ";
      }
    }
    result += ";"
    return result;

  }
}

class ConditionNode {
  constructor(object, operator, value, logOpToNextCondition = null) {
    this.object = object;
    this.operator = operator;
    this.value = value;
    this.logOpToNextCondition = logOpToNextCondition;
  }
}

// Customers.

let str = "from Customers where Country='Germany' or Country='Mexico' and Country='Germany' select ContactName";
let p = new Parser(str);
let tem = p.parse();
if (!tem)
  console.log("parsing failed")
console.log("Given string => "+str);
console.log()
console.log("Generated SQL => "+p.queryResult.queryGenerate());
