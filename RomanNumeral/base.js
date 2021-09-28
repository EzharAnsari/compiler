let romanNo = "xlii";

let indx = 0;
let result = 0;

function parsar() {
  thousand();
  hundred();
  ten();
  digit();
}

function thousand() {
  if (romanNo[indx] === 'm') {
    indx += 1;
    result += 1000;
    if (romanNo[indx] === 'm') {
      indx += 1;
      result += 1000;
      if (romanNo[indx] === 'm') {
        indx += 1;
        result += 1000;
      }
    }
  }
}

function hundred() {
 
  if(romanNo[indx] === 'c') {
    if (romanNo[indx + 1] === 'd') {
      indx += 2;
      result += 400;
    }

    else if (romanNo[indx + 1] === 'm') {
      indx += 2;
      result += 900;
    }

    else {
      smallHundred();
    }
  }

  else if (romanNo[indx] === 'd') {
    indx += 1;
    result += 500;
    smallHundred();
  }
}

function smallHundred() {
  if (romanNo[indx] === 'c') {
    indx += 1;
    result += 100;
    if (romanNo[indx] === 'c') {
      indx += 1;
      result += 100;
      if (romanNo[indx] === 'c') {
        indx += 1;
        result += 100;
      }
    }
  }  
}

function ten() {
 
  if(romanNo[indx] === 'x') {
    if (romanNo[indx + 1] === 'l') {
      indx += 2;
      result += 40;
    }
    
    else if (romanNo[indx + 1] === 'c') {
      indx += 2;
      result += 90;
    }

    else smallTen();
  }

  else if (romanNo[indx] === 'l') {
    indx += 1;
    result += 50;
    smallTen();
  }
  
}

function smallTen() {
  if (romanNo[indx] === 'x') {
    indx += 1;
    result += 10;
    if (romanNo[indx] === 'x') {
      indx += 1;
      result += 10;
      if (romanNo[indx] === 'x') {
        indx += 1;
        result += 10;
      }
    }
  } 
}

function digit() {
 
  if(romanNo[indx] === 'i') {
    if (romanNo[indx + 1] === 'v') {
      indx += 2;
      result += 4;
    }
    
    else if (romanNo[indx + 1] === 'x') {
      indx += 2;
      result += 9;
    }

    else {
      smallDigit();
    }
  }

  else if (romanNo[indx] === 'v') {
    indx += 1;
    result += 5;
    smallDigit();
  }
  
}

function smallDigit() {
  if (romanNo[indx] === 'i') {
    indx += 1;
    result += 1;
    if (romanNo[indx] === 'i') {
      indx += 1;
      result += 1;
      if (romanNo[indx] === 'i') {
        indx += 1;
        result += 1;
      }
    }
  }  
}

parsar();
console.log(result);