import { Token } from "./lexer";

export class JoinClause {
  joinType: string
  joinTable: string
  joinCondition: any

  constructor() {
    this.joinType = ''
    this.joinTable = ''
  }

  setJoinType(value: string) : void {
    this.joinType = value
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
  condition: any
  joinClause: JoinClause

  constructor() {
    this.selectList = [];
    this.fromList = [];
    this.joinClause = new JoinClause()
  }

  setCondition(value: any): void {
    this.condition = value
  }

  copy(): IntermediateQuery {
    return this
  }

  reset(value: IntermediateQuery): void {
    this.selectList = value.selectList
    this.condition = value.condition
    this.fromList = value.fromList
    this.joinClause = value.joinClause
  }

}

export class ConditionNode {
  object: string
  operator: string
  value: string
  logOpToNextCondition: string

  constructor() {
    this.object = ''
    this.operator = ''
    this.value = ''
    this.logOpToNextCondition = ''
  }

  setObject(value: string): void {
    this.object = value
  }

  setOperator(value: string): void {
    this.operator = value
  }

  setValue(value: string): void {
    this.value = value
  }

  setLogOpToNextCondition(value: string): void {
    this.logOpToNextCondition = value
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
