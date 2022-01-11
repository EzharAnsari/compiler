import { IntermediateQuery, WhereClause, JoinClause, ObjectNode, ArrayNode, MemberNode, BinaryOpNode, ConstantNode } from './intermediateQuery'
import { Token } from './lexer'

export class SqlConverter {
  IQs: IntermediateQuery[]
  IQ: IntermediateQuery

  constructor(value: IntermediateQuery[]) {
    this.IQs = value
    this.IQ = new IntermediateQuery()
  }

  arrayToString(value: Token[]): string {
    let result = '( ', i
  
    for(i=0; i<value.length; i++) {
      result += value[i].value
      if (value.length != (i+1))
        result += ", ";
      else
        result += " " 
    }
  
    result += ')'
    return result
  }

  binaryOpNodeToString(value: BinaryOpNode): string {
    let result = ''
  
    // for left operand
    if (value.left instanceof BinaryOpNode) {
      result += '( '
      result += this.binaryOpNodeToString(value.left)
      result += ' )'
    }
    else if(value.left instanceof ObjectNode) {
      result += value.left.tok.value
    }
    else if(value.left instanceof ConstantNode) {
      result += value.left.tok.value
    }
    else if (value.left instanceof MemberNode) {
      result += value.left.value.value
        result += '.'
        result += value.left.property.value
    }
  
    else if (value.left instanceof ArrayNode) {
      result += this.arrayToString(value.left.array)
    }
  
    // for operator
    result += ` ${value.op.type} `
  
    // for right operand
    if (value.right instanceof BinaryOpNode) {
      result += '( '
      result += this.binaryOpNodeToString(value.right)
      result += ' )'
    }
    else if(value.right instanceof ObjectNode) {
      result += value.right.tok.value
    }
    else if(value.right instanceof ConstantNode) {
      result += value.right.tok.value
    }
    else if (value.right instanceof MemberNode) {
      result += value.right.value.value
        result += '.'
        result += value.right.property.value
    }
  
    else if (value.right instanceof ArrayNode) {
      result += this.arrayToString(value.right.array)
    }
  
    return result
  }

  result(): string {
    let result = ''
    let i = 0;
    let len = this.IQs.length
    for (i=0; i<len; i++) {
      this.IQ = this.IQs[i]
      let tem: string = this.convert()
      result += tem
      if (i != (len - 1))
        result += '\n'
    }

    return result
  }

  convert(): string {
    let i = 0;
    let result = "SELECT "
  
    for(i=0; i<this.IQ.selectList.length; i++) {
      let select = this.IQ.selectList[i]
  
      if (select instanceof ObjectNode) {
        result += select.tok.value
      }
      else if(select instanceof MemberNode) {
        result += select.value.value
        result += '.'
        result += select.property.value
      }
      
      if (this.IQ.selectList.length != (i+1))
        result += ", ";
      else
        result += " " 
    }
  
    result += "FROM ";
  
    for(i=0; i<this.IQ.fromList.length; i++) {
      result += this.IQ.fromList[i].value
      if (this.IQ.fromList.length != (i+1))
        result += ", ";
      else
        result += " " 
    }
  
    if(this.IQ.joinClause.isUsed) {
      let joinClause = this.IQ.joinClause
      result += joinClause.joinType
      result += " JOIN "
      result += joinClause.joinTable
      result += " on "
      result += this.binaryOpNodeToString(joinClause.joinCondition)
    }
  
    if(this.IQ.whereClause.isUsed) {
      result += "where "
      result += this.binaryOpNodeToString(this.IQ.whereClause.condition)
    }
  
    return result
  }  
}

