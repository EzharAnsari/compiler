/**
 * S -> xTU | lX | X
 * T -> c | l
 * X -> xX | U
 * U -> iY | vI | I
 * Y -> x | v
 * I -> iI | epsilon
 */

 let rule = {
  "S" : ["xTU", "lX", "X"],
  "T" : ["c", "l"],
  "X" : ["xX", "U"],
  "U" : ["iY", "vI", "I"],
  "Y" : ["x", "v"],
  "I" : ["iI", "null"]
}

// let rule = {
//   "A" : ["abC", "aBd", "aAD"],
//   "B" : ["bB", "null"],
//   "C" : ["d", "null"],
//   "D" : ["b", "a", "null"]
// }

initPtr = 0;
let stack = [];

let romanNo = 'xlii';

function isMatched(a, b) {
  if (romanNo[a] === b) {
    return true;
  }
  else return false;
}

function parse(root, initPtr) {
  let lhs = root
  let rhs = rule[lhs];
  stack.push(root);
  
  for (let i = 0; i< rhs.length; i++) {
    let pro = rhs[i];
    let ptr = 0;
    console.log(pro);
    console.log(initPtr);
    for(let j=0; j<pro.length; j++) {
      if (pro[j] === 'null') {
        continue;
      }

      else if (!rule[pro[j]]) {   // for terminal 
        if (isMatched(initPtr, pro[j])) {
          ptr += 1;
          initPtr += 1;
          console.log(pro[j]);
          continue;
        }
        else {
          initPtr -= ptr;
          // for removing production rule from stack
          for( let k = 0; k < stack.length; i++){ 
            if ( stack[i] === pro) { 
                stack.splice(i, 1); 
            }
          }
          break;
        }
      }
      else {
        console.log(pro[j]); 
        stack.push(pro);
        parse(pro[j], initPtr); 
      }
    }
    
  }
}

// console.log(initPtr);

parse("S", initPtr);
console.log(stack);
