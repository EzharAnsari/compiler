// import { Parser } from "./parser";
const {Parser} = require('./parser')

let str = "from Customers where Country='Germany' or Country='Mexico' and Country='Germany' select ContactName";
let p = new Parser(str);
let tem = p.parse();
if (!tem)
  console.log("parsing failed")
console.log("Given string => "+str);
console.log()
console.log("Generated SQL => "+p.queryResult.queryGenerate());