import { Parser } from '../src/parser'
import { SqlConverter } from '../src/queryConverter'

function test() {
  let str = "from Customers where Country='Germany' or Country='Mexico' and Country='Germany' select ContactName"
  // let str = "from Table1 inner join Table2 on Table1.column11 = Table2.column21 select Table1.column12, Table1.column13, Table2.column22, Table2.column23"
  let p = new Parser(str)
  let result = p.parse()
  if(result) {
    let r = new SqlConverter(p.queryResult)
    return r.convert()
  }
}

describe('test function', () => {
  it('test a whole project', () => {
    expect(test()).toEqual("SELECT ContactName FROM Customers where ( ( Country = Germany ) or ( Country = Mexico ) ) and ( Country = Germany )");
  });
});