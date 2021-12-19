import { Token } from "./lexer";

export class JoinClause {
  joinType: string
  joinTable: string
  joinCondition: any
  isUsed: boolean

  constructor() {
    this.joinType = ''
    this.joinTable = ''
    this.isUsed = false
  }

  setJoinType(value: string) : void {
    this.joinType = value
  }

  setIsUsed(value: boolean): void {
    this.isUsed = value
  }

  setJoinTable(value: string) : void {
    this.joinTable = value
  }

  setJoinCondition(value: any) : void {
    this.joinCondition = value
  }
}

export class IntermediateQuery {
  // field
  selectList: any[]
  fromList: Token[]
  whereClause: WhereClause
  joinClause: JoinClause

  constructor() {
    this.selectList = [];
    this.fromList = [];
    this.joinClause = new JoinClause()
    this.whereClause = new WhereClause()
  }

  setCondition(value: any): void {
    this.whereClause.setCondition(value)
    this.whereClause.setIsUsed(true)
    console.log("Done")
  }

  copy(): IntermediateQuery {
    return this
  }

  reset(value: IntermediateQuery): void {
    this.selectList = value.selectList
    this.whereClause = value.whereClause
    this.fromList = value.fromList
    this.joinClause = value.joinClause
  }

}

export class WhereClause {
  isUsed: boolean
  condition: any

  constructor() {
    this.isUsed = false
  }

  setIsUsed(value: boolean): void {
    this.isUsed = value
  }

  setCondition(value: any): void {
    this.condition = value
  }
}

export class ObjectNode {
  tok: Token

  constructor(value: Token) {
    this.tok = value
  }
}

export class ConstantNode {
  tok: Token

  constructor(value: Token) {
    this.tok = value
  }
}

export class MemberNode {
  value: Token
  property: Token

  constructor(value1: Token, Value2: Token) {
    this.value = value1
    this.property = Value2
  }
}

export class ArrayNode {
  array: Token[]

  constructor(value1: Token[]) {
    this.array = value1
  }
}

export class BinaryOpNode {
  left: any
  right: any
  op: any

  constructor(left:any, op:any, right:any) {
    this.left = left
    this.op = op
    this.right = right
  }
}
