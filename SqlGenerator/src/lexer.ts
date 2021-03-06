 
export const LEFTPAREN = '(';
export const RIGHTPAREN = ')';
export const COMMA = ',';
export const SEMICOLON = ';';
export const DOT = '.';
export const INT = 'int';
export const FLOAT = 'float';
export const ID = 'id';
export const AND = 'and';
export const OR = 'or';
export const EQUAL = '=';
export const LIKE = 'like';
export const IN = 'in';
export const EOF = 'EOF';
export const STRING = 'string';
export const LESSTHAN = '<';
export const GREATTHAN = '>';
export const GREATTHANOREQUAL = '>=';
export const LESSTHANOREQUAL = '<=';
export const STAR = '*'

// keyword
export const FROM = 'from';
export const WHERE = 'where';
export const SELECT = 'select';
export const INNER = 'inner';
export const LEFT = 'left';
export const RIGHT = 'right';
export const FULL = 'full';
export const JOIN = 'join';
export const ON = 'on';
export const ERROR = 'error'
export const IS = 'is'
export const NOT = 'not'
export const AS = 'as'

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$'.split('')
const digits = '1234567890'.split('')
export const keywords = [
  "where", "from", "select", "and", "or", "inner", "left", "right", "full", "join", "on", "as", "not", "*", "like", "in"
]

export class Position {
  // field
  idx: number
  ln: number
  col: number
  fileName: string
  ftxt: string

  constructor(idx: number, ln: number, col: number, fileName: string, ftxt: string) {
    this.idx = idx;
    this.ln = ln;
    this.col = col;
    this.fileName = fileName;
    this.ftxt = ftxt;
  }


  copy(): Position {
    return new Position(this.idx, this.ln, this.col, this.fileName, this.ftxt);
  }
}

export class startPosition {
  ln: number
  cn: number

  constructor(ln: number, cl:number) {
    this.cn = cl
    this.ln = ln
  }
}
// ********************* Token ************************ //

export class Token {
  // field
  type: string
  value: string
  startPos: startPosition

  constructor(type: string, pos: startPosition, value: string = '') {
    this.type = type;
    this.value = value;
    this.startPos = pos
  }
}

//  Lexer 
export class Lexer {
  fileName: string
  text: string
  pos: Position
  currentChar: string = ''

  constructor(fileName: string, text: string) {
    this.text = text;
    this.fileName = fileName;
    this.pos = new Position(-1, 0, -1, fileName, text);
    this.setCurrentChar();
  }

  nextPos(): void {
    this.pos.idx += 1;
    this.pos.col += 1;

    if (this.currentChar === '\n') {
      this.pos.ln += 1;
      this.pos.col = 0;
    }
  }

  getCurrentChar(): string {
    return this.currentChar
  }

  setCurrentChar(): void {
    this.nextPos();
    if (this.pos.idx < this.text.length) {
      this.currentChar = this.text[this.pos.idx];
    }
    else this.currentChar = '';
  }

  isCharacterALetter(char: string): boolean {
    return letters.includes(char)
  }

  isCharacterADigit(char: string): boolean {
    return digits.includes(char)
  }

  makeNumber(pos: startPosition): Token {
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
      return new Token(INT, pos, numStr);
    }
    else {
      return  new Token(FLOAT, pos, numStr);
    }
  }

  makeID(pos: startPosition): Token {
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
    if (keywords.includes(str)) {
      return new Token(str.toLowerCase(), pos);
    }
    return new Token(ID, pos, str);
  }

  makeString(pos: startPosition): Token {
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
    return new Token(STRING, pos, str);
  }

  getToken(): Token {

    if (this.currentChar === '') {
      return new Token(EOF, new startPosition(this.pos.ln, this.pos.col));
    }

    else {
      if (this.currentChar === ' ' || this.currentChar === '\t' || this.currentChar === '\n') {
        this.setCurrentChar();
        return this.getToken();
      }
      else if (this.isCharacterADigit(this.currentChar)) {
        return this.makeNumber(new startPosition(this.pos.ln, this.pos.col));
      }
      else if (this.isCharacterALetter(this.currentChar)) {
        return this.makeID(new startPosition(this.pos.ln, this.pos.col));
      }
      else if(this.currentChar.charCodeAt(0) === 39 || this.currentChar.charCodeAt(0) === 34) {
        return this.makeString(new startPosition(this.pos.ln, this.pos.col));
      }
      else if (this.currentChar === '=') {
        this.setCurrentChar();
        return new Token(EQUAL, new startPosition(this.pos.ln, this.pos.col));
      }
      else if (this.currentChar === '(') {
        this.setCurrentChar();
        return new Token(LEFTPAREN, new startPosition(this.pos.ln, this.pos.col));
      }
      else if (this.currentChar === ')') {
        this.setCurrentChar();
        return new Token(RIGHTPAREN, new startPosition(this.pos.ln, this.pos.col));
      }
      else if (this.currentChar === ',') {
        this.setCurrentChar();
        return new Token(COMMA, new startPosition(this.pos.ln, this.pos.col));
      }
      else if (this.currentChar === '<') {
        this.setCurrentChar();
        return new Token(LESSTHAN, new startPosition(this.pos.ln, this.pos.col));
      }
      else if (this.currentChar === '>') {
        this.setCurrentChar();
        return new Token(GREATTHAN, new startPosition(this.pos.ln, this.pos.col));
      }
      else if (this.currentChar === '.') {
        this.setCurrentChar();
        return new Token(DOT, new startPosition(this.pos.ln, this.pos.col));
      }
      else if (this.currentChar === ';') {
        this.setCurrentChar();
        return new Token(SEMICOLON, new startPosition(this.pos.ln, this.pos.col));
      }
      else {
        console.log("Illegal token " + this.currentChar);
        return new Token(ERROR, new startPosition(this.pos.ln, this.pos.col));
      }
    }
  }

  test(): void {
    let tem = this.getToken();
    // console.log(tem);
    while(tem != null && tem.type != EOF && this.currentChar != null) {
      console.log(tem);
      tem = this.getToken();
      
    }
  }
}

