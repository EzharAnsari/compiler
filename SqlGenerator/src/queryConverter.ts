import { IntermediateQuery, WhereClause, JoinClause, ObjectNode, ArrayNode, MemberNode, BinaryOpNode, ConstantNode } from './intermediateQuery'
import { Token } from './lexer'

function arrayToString(value: Token[]): string {
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

export function binaryOpNodeToString(value: BinaryOpNode): string {
  let result = ''

  // for left operand
  if (value.left instanceof BinaryOpNode) {
    result += '( '
    result += binaryOpNodeToString(value.left)
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
    result += arrayToString(value.left.array)
  }

  // for operator
  result += ` ${value.op.type} `

  // for right operand
  if (value.right instanceof BinaryOpNode) {
    result += '( '
    result += binaryOpNodeToString(value.right)
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
    result += arrayToString(value.right.array)
  }

  return result
}

 export function sqlConverter(IQ: IntermediateQuery): string {
  let i = 0;
  let result = "SELECT "

  for(i=0; i<IQ.selectList.length; i++) {
    let select = IQ.selectList[i]

    if (select instanceof ObjectNode) {
      result += select.tok.value
    }
    else if(select instanceof MemberNode) {
      result += select.value.value
      result += '.'
      result += select.property.value
    }
    
    if (IQ.selectList.length != (i+1))
      result += ", ";
    else
      result += " " 
  }

  result += "FROM ";

  for(i=0; i<IQ.fromList.length; i++) {
    result += IQ.fromList[i].value
    if (IQ.fromList.length != (i+1))
      result += ", ";
    else
      result += " " 
  }

  if(IQ.joinClause.isUsed) {
    let joinClause = IQ.joinClause
    result += joinClause.joinType
    result += " JOIN "
    result += joinClause.joinTable
    result += " on "
    result += binaryOpNodeToString(joinClause.joinCondition)
  }

  if(IQ.whereClause.isUsed) {
    result += " where "
    result += binaryOpNodeToString(IQ.whereClause.condition)
  }

  return result
}
