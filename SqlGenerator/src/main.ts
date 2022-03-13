// import LexicalToken from './LexicalToken'
// import { Logger } from './logger'
// import { Parser } from './parser'
// import { SqlConverter } from './queryConverter'
// import { SyntaxKind } from './Syntax/SyntaxKind'

// let str = `from Customers inner where Country = 'Germany' or Country='Mexico' and Country='Germany' select ContactName;`
//   fromd Table1 inner join Table2 on Table1.column11 = Table2.column21 select Table1.column12, Table1.column13, Table2.column22, Table2.column23;
//   from Customers whsdere Country in ('Germany', 'Mexico', 'Germany') select ContactName;`
// let p = new Parser(str)

// let result = p.parse()

// if(result) {
//   let r = new SqlConverter(p.queryResults)
//   console.log(r.result())
// }
// else {
//   let l = new Logger()
//   l.showErrorInConsole(p.error, str)
// }

// let aaa = new LexicalToken(SyntaxKind.AndKeyword, "alksd", "hello")
// console.log(aaa);

import { TokenParser } from "./Parser/TokenParser";
// let str = 'T | project a = a + b | where a > 10.0'
let str = "154"
let p = new TokenParser();
let token = p.ParseTokens(str, true);
console.log(token[0]);
console.log(token.length);

