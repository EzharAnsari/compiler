// ***************** Grammar Rule ****************** //
/**
 * QUERY -> from FROMLIST where CONDITION select SELLIST
 * 
 * SELLIST -> ATTRIBUTE
 *           | ATTRIBUTE comma SELLIST
 * 
 * FROMLIST -> RELATION
 *           | RELATION comma FROMLIST
 * 
 * CONDITION -> ATTRIBUTE = ATTRIBUTE
 * 
 * ATTRIBUTE -> ID  { return TokenID }
 * 
 * RELATION -> ID  { return TokenID }
 * 
 * FROMLIST -> ID  { return TokenID }
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
EQUAL = '=';
LIKE = 'like';
IN = 'IN';
EOF = 'EOF'

const keywordList = ["where", "from", "select"];

class Position {
  constructor(idx, ln, col, fileName, ftxt) {
    this.idx = idx;
    this.ln = ln;
    this.col = col;
    this.fileName = fileName;
    this.ftxt = ftxt;
  }

  nextPos(currentChar) {
    this.idx += 1;
    this.col += 1;

    if (currentChar === '\n') {
      this.ln += 1;
      this.col = 0;
    }
    return this;
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


class Lexer {
  constructor(fileName, text) {
    this.text = text;
    this.fileName = fileName;
    this.pos = new Position(-1, 0, -1, fileName, text);
    this.currentChar = null;
    this.setCurrentChar();
  }

  setCurrentChar() {
    this.pos.nextPos(this.currentChar);
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
      else if (this.currentChar === '=') {
        this.setCurrentChar();
        return new Token(EQUAL);
      }
      else if (this.currentChar === ',') {
        this.setCurrentChar();
        return new Token(COMMA);
      }
      else {
        console.log("Illegal token");
        return null;
      }
    }
  }

  test() {
    let tem = this.getToken();
    console.log(tem);
    while(tem != null && tem.type != EOF && this.currentChar != null) {
      tem = this.getToken();
      console.log(tem);
    }
  }
}

class QueryObject {
  constructor() {
    this.selectList = [];
    this.fromList = [];
    this.conditionList = [];
  }
}

class ConditionNode {
  constructor(lhs, equalToken, rhs) {
    this.lhs = lhs;
    this.equalToken = equalToken;
    this.rhs = rhs;
  }
}

class Parser {
  constructor(str) {
    this.lexer = new Lexer('<stdio>', str);
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
    let query = new QueryObject();
    if (this.match(SELECT)) {
      query.selectList.push(this.lookahead);
      this.match(this.lookahead.type);
      while (this.match(COMMA)) {
        query.selectList.push(this.lookahead);
        this.match(this.lookahead.type);
      }
    }

    if (this.match(FROM)) {
      query.fromList.push(this.lookahead);
      this.match(this.lookahead.type);
      while (this.match(COMMA)) {
        query.fromList.push(this.lookahead);
        this.match(this.lookahead.type);
      }
    }

    if (this.match(WHERE)) {
      // i am assuming there is only equal condition 
      let lhs = this.lookahead;
      this.match(this.lookahead.type);
      let equalToken = this.lookahead;
      this.match(this.lookahead.type);
      let rhs = this.lookahead;
      this.match(this.lookahead.type);

      query.conditionList.push(new ConditionNode(lhs, equalToken, rhs));
    }
    return query;
  }
}


let str = "select movieTitle from StarsIn, MovieStar where startName = name";
let p = new Parser(str);
let tem = p.parse();
console.log(tem.conditionList);
