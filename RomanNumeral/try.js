/**
 * S -> xTU | lX | X  { d[0] = 10 + d[2] + d[3] }
 * T -> c | l { d[0] = 100}
 * X -> x | xx | xxx | U
 * U -> iY | vI | I
 * Y -> x | v
 * I -> iI | epsilon
 */

// iiii

initPtr = 0;

let romanNo = 'xlxl';
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

function parseS() {
  let temPtr = initPtr;
  if (match('x') && parseT() && parseU()) {
    value -= 10;
    return true;
  }
  initPtr = temPtr;
  value = 0;
  if (match('l') && parseX()) {
    value += 50;
    return true;
  }
  initPtr = temPtr;
  value = 0;
  if (parseX()) {
    return true;
  }
  return false;
}

function parseT() {
  let temPtr = initPtr;
  let temValue = value;
  if (match('l')) {
    value += 50;
    return true;
  }
  initPtr = temPtr;
  value = temValue; 
  if (match('c')) {
    value += 100;
    return true;
  }
  return false;
}

function parseX() {
  let temValue = value;
  let temPtr = initPtr;
  if (match('x') && parseX()) {
    value += 10;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (parseU()) {
    return true;
  }
  return false;
}

function parseU() {
  let temPtr = initPtr;
  let temValue = value;
  if (match('i') && parseY()) {
    value -= 1;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (match('v') && parseI()) {
    value += 5;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (parseI()) {
    return true;
  }
  return false;
}

function parseY() {
  let temPtr = initPtr;
  let temValue = value;
  if (match('x')) {
    value += 10;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  if (match('v')) {
    value += 5;
    return true;
  }
  return false;
}

function parseI() {
  let temPtr = initPtr;
  let temValue = value;
  if (match('i') && parseI()) {
    value += 1;
    return true;
  }
  initPtr = temPtr;
  value = temValue;
  return true;
}

let result = parseS();
if (initPtr === n) {
  result = true;
}
else { value = 0; result = false; }
console.log(result);
console.log(value);
