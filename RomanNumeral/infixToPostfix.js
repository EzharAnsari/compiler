/*
* expr -> term + expr
				| term - expr
				| term
	term -> factor * term
				| factor / term
	fector -> ( expr )
					| INT
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
  constructor(error_name, pos_start, pos_end, details) {
    this.error_name = error_name;
    this.details = details;
    this.pos_start = pos_start;
    this.pos_end = pos_end;
  }

  as_string() {
    let result = `${this.error_name} : ${this.details}`
    return result;
  }
}
class IllegalCharError extends Error {
  constructor(pos_start, pos_end, details) {
    super('Illegal Character', pos_start, pos_end, details);
  }
}
class InvalidSyntaxError extends Error {
  constructor(pos_start, pos_end, details) {
    super('Invalid Syntax', pos_start, pos_end, details);
  }
}

// ********************* Position ************************ //
class Position {
  constructor(idx, ln, col, fn, ftxt) {
    this.idx = idx;
    this.ln = ln;
    this.col = col;
    this.fn = fn;
    this.ftxt = ftxt;
  }

  next_pos(currnet_char) {
    this.idx += 1;
    this.col += 1;

    if (currnet_char === '\n') {
      this.ln += 1;
      this.col = 0;
    }
    return this;
  }

  copy() {
    return new Position(this.idx, this.ln, this.col, this.fn, this.ftxt);
  }
}

// ********************* Token ************************ //
class Token {
  constructor(type, value=null){
    this.type = type;
    this.value = value;
  }
  as_string() {
    let result;
    if (this.value == null) {
      result = this.type;
    }
    else {
      result = this.type + ' : ' + this.value
    }
    return result;
  }
}

// ********************* Lexer ************************ //
class Lexer {
  constructor(fn, text) {
    this.text = text;
    this.fn = fn;
    this.pos = new Position(-1, 0, -1, fn, text);
    this.currnet_char = null;
    this.next_char();
  }

  next_char() {
    this.pos.next_pos(this.currnet_char);
    if (this.pos.idx < this.text.length) {
      this.currnet_char = this.text[this.pos.idx];
    }
    else this.currnet_char = null;
  }

  make_number() {
    let num_str = '';
    let dot_count = 0;
    while (this.currnet_char != null && DIGITS.includes(this.currnet_char) || this.currnet_char === '.') {
      if (this.currnet_char === '.') {
        if (dot_count === 1) {
          break;
        }
        dot_count += 1;
        num_str += '.';
      }
      else {
        num_str += this.currnet_char;
      }
      this.next_char();
    }
    if (dot_count === 0) {
      let result = {
        token: new Token(TT_INT, parseInt(num_str)),
        error: null
      }
      return result;
    }
    else {
      let result = {
        token: new Token(TT_FLOAT, parseFloat(num_str)),
        error: null
      }
      return result;
    }
  }

  get_token() {

    if (this.currnet_char === null) {
      let result = {
        token: new Token(TT_EOF),
        error: null
      }
      return result;
    }

    else if(this.currnet_char != null) {
      if (this.currnet_char === ' ' || this.currnet_char === '\t' || this.currnet_char === '\n') {
        this.next_char();
        return this.get_token();
      }
      else if (DIGITS.includes(this.currnet_char)) {
        return this.make_number();
      }
      else if (this.currnet_char === '+') {
        this.next_char();
        let result = {
          token: new Token(TT_PLUS),
          error: null
        }
        return result;
      }
      else if (this.currnet_char === '-') {
        this.next_char();
        let result = {
          token: new Token(TT_MINUS),
          error: null
        }
        return result;
      }
      else if (this.currnet_char === '/') {
        this.next_char();
        let result = {
          token: new Token(TT_DIV),
          error: null
        }
        return result;
      }
      else if (this.currnet_char === '*') {
        this.next_char();
        let result = {
          token: new Token(TT_MUL),
          error: null
        }
        return result;
      }
      else if (this.currnet_char === '(') {
        this.next_char();
        let result = {
          token: new Token(TT_LPAREN),
          error: null
        }
        return result;
      }
      else if (this.currnet_char === ')') {
        this.next_char();
        let result = {
          token: new Token(TT_RPAREN),
          error: null
        }
        return result;
      }
      else {
        let pos_start = this.pos.copy();
        let char = this.currnet_char;
        this.next_char();
        let result = {
          token: null,
          error: new IllegalCharError(pos_start, this.pos, `' ${char} '`)
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
  constructor(left_node, op_tok, right_node) {
    this.left_node = left_node;
    this.op_tok = op_tok;
    this.right_node = right_node;
  }
}

// ********************* Parser Result ************************ //
class ParserResult {
  
}

// ********************* Parser ************************ //
class Parser{
  constructor(str) {
    this.lexer = new Lexer('<stdio>', str);
  }

  next_token() {
    let lexerResult = this.lexer.get_token();
    if (lexerResult.error) {
      console.log(lexerResult.error);
      return null;
    }
    return lexerResult.token;
  }

  match(type){
    if (this.lookahead.type === type) {
      this.lookahead = this.next_token();
    }
    else {
      console.log("Syntax Error");
    }
  }
  parse() {
    this.lookahead = this.next_token();
    let res = this.expr();
    return res;
  }

  factor() {
    let tok = this.lookahead;
    console.log(tok);
    switch(tok.type) {
      case TT_LPAREN:
        this.match(TT_LPAREN); let result = this.expr(); this.match(TT_RPAREN); return result;
      case TT_INT:
        this.match(TT_INT); return new NumberNode(tok);
      case TT_FLOAT:
        this.match(TT_FLOAT); return new NumberNode(tok);
      default:
        console.log("Syntax Error"); 
    }
  }
  term() {
    let left = this.factor();
    if (this.lookahead.type === TT_MUL || this.lookahead.type === TT_DIV) {
      let op_tok = this.lookahead;
      this.match(this.lookahead.type);
      let right = this.term();

      // infix notation to prefix
      // console.log(op_tok, left, right);

      // infix notation to postfix
      // console.log(left, right, op_tok);

      left = new BinOpNode(left, op_tok, right);
    }
    return left;
  }
  expr() {
    let left = this.term();
    if (this.lookahead.type === TT_PLUS || this.lookahead.type === TT_MINUS) {
      let op_tok = this.lookahead;
      this.match(this.lookahead.type);
      let right = this.expr();

      // infix notation to prefix
      // console.log(op_tok, left, right);

      // infix notation to postfix
      // console.log(left, right, op_tok);

      left = new BinOpNode(left, op_tok, right);
    }
    return left;
  }
}

let string = '(1+2)*3'

let p = new Parser(string);
let ast = p.parse();
console.log(ast);
