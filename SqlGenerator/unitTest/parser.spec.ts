import { Parser } from '../src/parser'
import { BinaryOpNode } from '../src/intermediateQuery'

function test() {
  let str = "Country in ('Germany', 'A', 'y', 't', 'r', 'e', 'w', 'q', 'b')"
  let p = new Parser(str)
  let result = p.condition()
  console.log(result.right)
  if(result instanceof BinaryOpNode) { return true}
  return false
}

describe('condition function', () => {
  it('return a binary operation node', () => {
    expect(test()).toEqual(true);
  });
});