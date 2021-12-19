import { IntermediateQuery, WhereClause, JoinClause, ObjectNode, ArrayNode, MemberNode, BinaryOpNode } from './intermediateQuery'

export function binaryOpNodeToString(value: BinaryOpNode): string {
  let result = ''

  if (value.left instanceof BinaryOpNode) {
    result += '( '
    result += binaryOpNodeToString(value.left)
    result += ' )'
  }
  else if(value.left instanceof ObjectNode) {
    result += value.left.tok.value
  }

  else if (value.left instanceof MemberNode) {
    result += value.left.value.value
      result += '.'
      result += value.left.property.value
  }

  else if

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

  }

  return result
}
