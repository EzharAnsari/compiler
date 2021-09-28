let romanNo = "MCXI";

let indx = 0;
let result = 0;

function parsar() {
  thousand();
  hundred();
  ten();
  digit();
}

function thousand() {
  if (romanNo[indx] === 'M') {
    indx += 1;
    result += 1000;
    if (romanNo[indx] === 'M') {
      indx += 1;
      result += 1000;
      if (romanNo[indx] === 'M') {
        indx += 1;
        result += 1000;
      }
    }
  }
}

function hundred() {
 
  if(romanNo[indx] === 'C') {
    if (romanNo[indx + 1] === 'D') {
      indx += 2;
      result += 400;
    }

    else if (romanNo[indx + 1] === 'M') {
      indx += 2;
      result += 900;
    }

    else {
      smallHundred();
    }
  }

  else if (romanNo[indx] === 'D') {
    indx += 1;
    result += 500;
    smallHundred();
  }
}

function smallHundred() {
  if (romanNo[indx] === 'C') {
    indx += 1;
    result += 100;
    if (romanNo[indx] === 'C') {
      indx += 1;
      result += 100;
      if (romanNo[indx] === 'C') {
        indx += 1;
        result += 100;
      }
    }
  }  
}

function ten() {
 
  if(romanNo[indx] === 'X') {
    if (romanNo[indx + 1] === 'L') {
      indx += 2;
      result += 40;
    }
    
    else if (romanNo[indx + 1] === 'C') {
      indx += 2;
      result += 90;
    }

    else smallTen();
  }

  else if (romanNo[indx] === 'L') {
    indx += 1;
    result += 50;
    smallTen();
  }
  
}

function smallTen() {
  if (romanNo[indx] === 'X') {
    indx += 1;
    result += 10;
    if (romanNo[indx] === 'X') {
      indx += 1;
      result += 10;
      if (romanNo[indx] === 'X') {
        indx += 1;
        result += 10;
      }
    }
  } 
}

function digit() {
 
  if(romanNo[indx] === 'I') {
    if (romanNo[indx + 1] === 'V') {
      indx += 2;
      result += 4;
    }
    
    else if (romanNo[indx + 1] === 'X') {
      indx += 2;
      result += 9;
    }

    else {
      smallDigit();
    }
  }

  else if (romanNo[indx] === 'V') {
    indx += 1;
    result += 5;
    smallDigit();
  }
  
}

function smallDigit() {
  if (romanNo[indx] === 'I') {
    indx += 1;
    result += 1;
    if (romanNo[indx] === 'I') {
      indx += 1;
      result += 1;
      if (romanNo[indx] === 'I') {
        indx += 1;
        result += 1;
      }
    }
  }  
}

parsar();
console.log(result);