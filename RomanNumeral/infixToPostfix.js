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

  advance(currnet_char) {
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
    this.advance();
  }

  advance() {
    this.pos.advance(this.currnet_char);
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
      this.advance();
    }
    if (dot_count === 0) {
      return new Token(TT_INT, parseInt(num_str));
    }
    else {
      return new Token(TT_FLOAT, parseFloat(num_str));
    }
  }

  make_tokens() {
    let tokens = [];

    while(this.currnet_char != null) {
      if (this.currnet_char === ' ' || this.currnet_char === '\t' || this.currnet_char === '\n')
        this.advance();
      else if (DIGITS.includes(this.currnet_char)) {
        tokens.push(this.make_number());
      }
      else if (this.currnet_char === '+') {
        tokens.push(new Token(TT_PLUS));
        this.advance();
      }
      else if (this.currnet_char === '-') {
        tokens.push(new Token(TT_MINUS));
        this.advance();
      }
      else if (this.currnet_char === '/') {
        tokens.push(new Token(TT_DIV));
        this.advance();
      }
      else if (this.currnet_char === '*') {
        tokens.push(new Token(TT_MUL));
        this.advance();
      }
      else if (this.currnet_char === '(') {
        tokens.push(new Token(TT_LPAREN));
        this.advance();
      }
      else if (this.currnet_char === ')') {
        tokens.push(new Token(TT_RPAREN));
        this.advance();
      }
      else {
        let pos_start = this.pos.copy();
        let char = this.currnet_char;
        this.advance();
        let result = {
          tokens: [],
          error: new IllegalCharError(pos_start, this.pos, `' ${char} '`)
        }
        return result;
      }
    }

    let result = {tokens, error: null};
    return result;
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
  constructor(tokens) {
    this.tokens = tokens;
    this.tok_idx = -1;
    this.advance();
  }
  advance(){
    this.tok_idx += 1;
    if (this.tok_idx < this.tokens.length) {
      this.currnet_tok = this.tokens[this.tok_idx];
    }
    return this.currnet_tok;
  }
  parse() {
    let res = this.expr();
    return res;
  }
  factor() {
    let tok = this.currnet_tok;
    if (tok.type === TT_INT || tok.type === TT_FLOAT) {
      this.advance();
      return new NumberNode(tok);
    }
  }
  term() {
    let left = this.factor();
    while(this.currnet_tok.type === TT_MUL || this.currnet_tok.type === TT_DIV) {
      let op_tok = this.currnet_tok;
      this.advance();
      let right = this.factor();

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
    while(this.currnet_tok.type === TT_PLUS || this.currnet_tok.type === TT_MINUS) {
      let op_tok = this.currnet_tok;
      this.advance();
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

let string = '123 *d 524'
let lexer = new Lexer('<stdin>', string);
let lexerResult = lexer.make_tokens();

if (lexerResult.error) {
  console.log(lexerResult.error);
  return;
}
let parser = new Parser(lexerResult.tokens);
let ast = parser.parse();
console.log(ast);
