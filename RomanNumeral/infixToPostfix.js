/*
* expr -> term + expr
    | term - expr
	term -> factor * term
    | factor / term
	fector -> ( expr )
    | INT
    | FLOAT
*/

// ********************* Digit ************************ //

let DIGITS = '0123456789';

// ********************* Tokens ************************ //
TT_INT			= 'INT'
TT_FLOAT    = 'FLOAT'
TT_PLUS     = 'PLUS'
TT_MINUS    = 'MINUS'
TT_MUL      = 'MUL'
TT_DIV      = 'DIV'
TT_LPAREN   = 'LPAREN'
TT_RPAREN   = 'RPAREN'
TT_EOF			= 'EOF'

// ********************* ERROR ************************ //

class Error {
  constructor(errorName, posStart, posEnd, details) {
    this.errorName = errorName;
    this.details = details;
    this.posStart = posStart;
    this.posEnd = posEnd;
  }
}
class IllegalCharError extends Error {
  constructor(posStart, posEnd, details) {
    super('Illegal Character', posStart, posEnd, details);
  }
}
class InvalidSyntaxError extends Error {
  constructor(posStart, posEnd, details) {
    super('Invalid Syntax', posStart, posEnd, details);
  }
}

// ********************* Position ************************ //

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
  constructor(type, value=null){
    this.type = type;
    this.value = value;
  }
}

// ********************* Lexer ************************ //

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

  makeNumber() {
    let numStr = '';
    let dotCount = 0;
    while (this.currentChar != null && DIGITS.includes(this.currentChar) || this.currentChar === '.') {
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
      let result = {
        token: new Token(TT_INT, parseInt(numStr)),
        pos: this.pos,
        error: null
      }
      return result;
    }
    else {
      let result = {
        token: new Token(TT_FLOAT, parseFloat(numStr)),
        pos: this.pos,
        error: null
      }
      return result;
    }
  }

  getToken() {

    if (this.currentChar === null) {
      let result = {
        token: new Token(TT_EOF),
        pos: this.pos,
        error: null
      }
      return result;
    }

    else if(this.currentChar != null) {
      if (this.currentChar === ' ' || this.currentChar === '\t' || this.currentChar === '\n') {
        this.setCurrentChar();
        return this.getToken();
      }
      else if (DIGITS.includes(this.currentChar)) {
        return this.makeNumber();
      }
      else if (this.currentChar === '+') {
        this.setCurrentChar();
        let result = {
          token: new Token(TT_PLUS),
          pos: this.pos,
          error: null
        }
        return result;
      }
      else if (this.currentChar === '-') {
        this.setCurrentChar();
        let result = {
          token: new Token(TT_MINUS),
          pos: this.pos,
          error: null
        }
        return result;
      }
      else if (this.currentChar === '/') {
        this.setCurrentChar();
        let result = {
          token: new Token(TT_DIV),
          pos: this.pos,
          error: null
        }
        return result;
      }
      else if (this.currentChar === '*') {
        this.setCurrentChar();
        let result = {
          token: new Token(TT_MUL),
          pos: this.pos,
          error: null
        }
        return result;
      }
      else if (this.currentChar === '(') {
        this.setCurrentChar();
        let result = {
          token: new Token(TT_LPAREN),
          pos: this.pos,
          error: null
        }
        return result;
      }
      else if (this.currentChar === ')') {
        this.setCurrentChar();
        let result = {
          token: new Token(TT_RPAREN),
          pos: this.pos,
          error: null
        }
        return result;
      }
      else {
        let posStart = this.pos.copy();
        let char = this.currentChar;
        this.setCurrentChar();
        let result = {
          token: null,
          pos: this.pos,
          error: new IllegalCharError(posStart, this.pos, `' ${char} '`)
        }
        return result;
      }
    }
  }
}

// ********************* Number Node ************************ //

class NumberNode {
  constructor(tok) {
    this.tok = tok;
  }
}

// ********************* Binary Operation Node ************************ //

class BinOpNode {
  constructor(leftNode, opTok, rightNode) {
    this.leftNode = leftNode;
    this.opTok = opTok;
    this.rightNode = rightNode;
  }
}

class UnaryOpNode {
  constructor(opTok, node) {
    this.opTok = opTok;
    this.node = node;
  }
}

// ********************* Parser Result ************************ //

class ParserResult {
  constructor() {
    this.error = null;
    this.node = null;
  }

  register(res) {
    if (res instanceof ParserResult) {
      if (res.error) {
        this.error = res.error;
      }
      return res.node;
    }
    return res;
  }

  success(node) {
    this.node = node;
    return this;
  }

  failure(error) {
    this.error = error;
    return this;
  }
}

// ********************* Parser ************************ //

class Parser{
  constructor(str) {
    this.lexer = new Lexer('<stdio>', str);
  }

  getToken() {
    let lexerResult = this.lexer.getToken();
    if (lexerResult.error) {
      console.log(lexerResult.error);
      return null;
    }
    return lexerResult.token;
  }

  match(type){
    if (this.lookahead.type === type) {
      this.lookahead = this.getToken();
    }
    else {
      console.log("Syntax Error");
    }
  }
  parse() {
    this.lookahead = this.getToken();
    let res = this.expr();
    if (!res.error && this.lookahead.type != TT_EOF) {
      return res.failure(InvalidSyntaxError())
    }
    return res;
  }

  factor() {
    let tok = this.lookahead;
    // let res = new ParserResult();
    // console.log(tok);
    switch(tok.type) {
      case TT_LPAREN:
        this.match(TT_LPAREN); let result = this.expr(); this.match(TT_RPAREN); return result;
      case TT_INT:
        this.match(TT_INT); return new NumberNode(tok);
      case TT_FLOAT:
        this.match(TT_FLOAT); return new NumberNode(tok);
      case TT_MINUS:
        this.match(TT_MINUS); let factor = this.factor(); return new UnaryOpNode(tok, factor);
      case TT_PLUS:
        this.match(TT_PLUS); let r = this.factor(); return new UnaryOpNode(tok, r);
      default:
        console.log("Syntax Error"); 
    }
  }
  term() {
    let left = this.factor();
    if (this.lookahead.type === TT_MUL || this.lookahead.type === TT_DIV) {
      let opTok = this.lookahead;
      this.match(this.lookahead.type);
      let right = this.term();

      // infix notation to prefix
      // console.log(opTok, left, right);

      // infix notation to postfix
      // console.log(left, right, opTok);

      left = new BinOpNode(left, opTok, right);
    }
    return left;
  }
  expr() {
    let left = this.term();
    if (this.lookahead.type === TT_PLUS || this.lookahead.type === TT_MINUS) {
      let opTok = this.lookahead;
      this.match(this.lookahead.type);
      let right = this.expr();

      // infix notation to prefix
      // console.log(opTok, left, right);

      // infix notation to postfix
      // console.log(left, right, opTok);

      left = new BinOpNode(left, opTok, right);
    }
    return left;
  }
}

let string = '+1+2'

let p = new Parser(string);
let ast = p.parse();
console.log(ast);
