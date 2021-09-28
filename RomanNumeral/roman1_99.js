let romanNo = "xlii";

let indx = 0;
let lookahead;
// let result = 0;

function s() {
  lookahead = lexer();
  switch(lookahead) {
    case "x":
      match("x"); T(); U();
      break;
    case "l":
      match("l"); X();
      break;
    default:
      X();
  }
}

function T() {
  switch(lookahead) {
    case "c":
      match("c");
      break;
    case "l":
      match("l");
      break;
    default:
      console.log("Syntax Error");
  }
}

function X() {
  switch(lookahead) {
    case "x":
      match("x"); X();
      break;
    default:
      U();
  }
}

function U() {
  switch(lookahead) {
    case "i":
      match("i"); Y();
      break;
    case "v":
      match("v"); I();
    default:
      I();
  }
}

function Y() {
  switch(lookahead) {
    case "x":
      match("x");
      break;
    case "v":
      match("v");
      break;
    default:
      console.log("Syntax Error");
  }
}

function I() {
  switch(lookahead) {
    case "i":
      match("i"); I();
      break;
    default:
      console.log("Epsilon is used");
  }
}

function lexer() {
  let char = romanNo[indx];
  indx += 1;
  return char;
}

function match(c) {
  if (lookahead === c) {
    console.log(lookahead);
    console.log(indx);
    lookahead = lexer();
  }
  else {
    console.log("Syntax error");
  }
}

s();
console.log(indx);