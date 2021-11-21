/**
 * S -> thousand hundered ten digit
 * thousand -> m | mm | mmm | epsilon
 * hundred -> smallHundred | cd | d smallHundred | cm
 * smallHundred -> c | cc | ccc | epsilon
 * ten -> smallTen | xl | l smallTen | xc
 * smallTen -> x | xx | xxx | epsilon
 * digit -> smallDigit | iv | v smallDigit | ix
 * smallDigit -> i | ii | iii | epsilon
 */

initPtr = 0;

let romanNo = 'xlii';
let n = romanNo.length;

let value = 0;

function match(b) {
  if (romanNo[initPtr] === b) {
    initPtr++;
    // console.log(b, (initPtr -1))
    return true;
  }
  else { return false };
}

function parse() {
  if (thousand() && hundered() && ten() && digit()) {
    return true;
  }
  return false;
}

function charChecker(char, times) {
  let i = 0;
  for (i = 0; i < times; i++) {
    if (match(char)) {
      continue;
    }
    else { return false; }
  }
  return true;
}

function thousand() {
  let temPtr = initPtr;
  let temValue = value;
  if (charChecker('m', 3)) {
    value += 3000;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (charChecker('m', 2)) {
    value += 2000;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (charChecker('m', 1)) {
    value += 1000;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  return true;
}

function hundered() {
  let temPtr = initPtr;
  let temValue = value;
  if (match('c') && match('d')) {
    value += 400;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (match('c') && match('m')) {
    value += 900;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (match('d') && smallHundred()) {
    value += 500;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (smallHundred()) {
    return true;
  }
  initPtr = temPtr;
  return true;
}

function smallHundred() {
  let temPtr = initPtr;
  let temValue = value;
  if (charChecker('c', 3)) {
    value += 300;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (charChecker('c', 2)) {
    value += 200;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (charChecker('c', 1)) {
    value += 100;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  return true;
}

function ten() {
  let temPtr = initPtr;
  let temValue = value;
  if (match('x') && match('l')) {
    value += 40;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (match('x') && match('c')) {
    value += 90;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (match('l') && smallTen()) {
    value += 50;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (smallTen()) {
    return true;
  }
  initPtr = temPtr;
  return true;
}

function smallTen() {
  let temPtr = initPtr;
  let temValue = value;
  if (charChecker('x', 3)) {
    value += 30;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (charChecker('x', 2)) {
    value += 20;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (charChecker('x', 1)) {
    value += 10;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  return true;
}

function digit() {
  let temPtr = initPtr;
  let temValue = value;
  if (match('i') && match('v')) {
    value += 4;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (match('i') && match('x')) {
    value += 9;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (match('v') && smallDigit()) {
    value += 5;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (smallDigit()) {
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  return true;
}

function smallDigit() {
  let temValue = value;
  let temPtr = initPtr;
  if (charChecker('i', 3)) {
    value += 3;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (charChecker('i', 2)) {
    value += 2;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (charChecker('i', 1)) {
    value += 1;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  return true;
}


let result = parse();
if (initPtr === n) {
  result = true;
}
else { value = 0; result = false; }
console.log(result);
console.log(value);
