import { Parser } from './parser'

let str = "from Customers where Country='Germany' or Country='Mexico' and Country='Germany' select ContactName"
// let str = "from Table1 left join Table2 on Table1.column11 = Table2.column21 select Table1.column12, Table1.column13, Table2.column22, Table2.column23"
let p = new Parser(str)
let result = p.parse()
console.log(result)