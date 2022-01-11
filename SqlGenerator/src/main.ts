import { Parser } from './parser'
import { SqlConverter } from './queryConverter'

let str = `from Customers where Country='Germany' or Country='Mexico' and Country='Germany' select ContactName
  from Table1 inner join Table2 on Table1.column11 = Table2.column21 select Table1.column12, Table1.column13, Table2.column22, Table2.column23
  from Customers where Country in ('Germany', 'Mexico', 'Germany') select ContactName`
let p = new Parser(str)

let result = p.parse()

if(result) {
  let r = new SqlConverter(p.queryResults)
  console.log(r.result())
}
