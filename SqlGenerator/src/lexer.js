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

module.exports = { keywordList, Position, Token, Lexer }