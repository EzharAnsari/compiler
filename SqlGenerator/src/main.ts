import { Parser } from './parser'

let str = "from Customers where Country='Germany' or Country='Mexico' and Country='Germany' select ContactName"
let p = new Parser(str)
p.lexer.test()