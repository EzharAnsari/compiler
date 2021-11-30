import { Token, INT, FLOAT, STRING } from "./lexer";

// ------------------------------------------------
// Operators
// ------------------------------------------------
export type UpdateOpertor = '++' | '--'

export type UnaryOperator = 
    '!' | '+' | '-' | '~' | 'typeof' | 'void' | 'delete'

export type BinaryOperator = 
    '**' | '*' | '/' | '%' | '+' | '-' |
    '<' | '<=' | '>' | '>=' | 'in' | 'instanceof' | '==' |
    '!=' | '&' | '^' | '|' | '??' | '&&' | '||'

// ------------------------------------------------
// Identifier
// ------------------------------------------------
export type Identifier = { type: 'Identifier', name: string }

// ------------------------------------------------
// Literal
// ------------------------------------------------
export interface LiteralBase { type: 'Literal', raw: string }
export type StringLiteral = { kind: 'string', value: string } & LiteralBase
export type NullLiteral = { kind: 'null', value: string } & LiteralBase
export type NumberLiteral = { kind: 'number', value: string } & LiteralBase
export type BooleanLiteral = { kind: 'boolean', value: string } & LiteralBase
export type Literal =
    | StringLiteral
    | NullLiteral
    | BooleanLiteral
    | NumberLiteral


export type UnaryExpression = {
  type: 'UnaryExpression'
  operator: UnaryOperator
  argument: Expression
  prefix: boolean
}

export type BinaryExpression = {
  type: 'BinaryExpression'
  operator: BinaryOperator
  left: Expression
  right: Expression
}

export type Property = {
  type: 'Property'
  key: string
  value: Expression
}

export type ObjectExpression = {
  type: 'ObjectExpression'
  properties: (Property)[]
}

export type Expression = 
    | UnaryExpression
    | BinaryExpression
    | ObjectExpression
    | Identifier 
    | QueryExpression
    | Literal



export type Then =
    | FromClause
    // | JoinClause
    // | WhereClause
    // | SelectClause

export type FromClause = {
  type: 'FromClause'
  expression: Expression
  then: Then
}

export type QueryExpression = {
  type: 'QueryExpression'
  from: FromClause
}

export class IntermediateQuery {
  // field
  selectList: Token[]
  fromList: Token[]
  conditionList: ConditionNode[]

  constructor() {
    this.selectList = [];
    this.fromList = [];
    this.conditionList = [];
  }

  queryGenerate() {
    let i = 0;
    let result = "SELECT ";

    for(i=0; i<this.selectList.length; i++) {
      result += this.selectList[i].value
      if (this.selectList.length != (i+1))
        result += ", ";
      else
        result += " " 
    } 
    
    result += "FROM ";

    for(i=0; i<this.fromList.length; i++) {
      result += this.fromList[i].value
      if (this.fromList.length != (i+1))
        result += ", ";
      else
        result += " " 
    }

    result += "WHERE ";

    for(i=0; i<this.conditionList.length; i++) {
      let temConditionNode = this.conditionList[i];
      result += temConditionNode.object.value;
      result += temConditionNode.operator.type;
      switch(temConditionNode.value.type) {
        case INT:
        case FLOAT:
          result += temConditionNode.value.value;
          break;
        case STRING:
          result += "'" + temConditionNode.value.value + "'";
          break;
        default:
          console.log("Invalid constant type");
      }
      if (temConditionNode.logOpToNextCondition){
        result += " " + temConditionNode.logOpToNextCondition.type;
      }

      if (this.conditionList.length != i+1) {
        result += " ";
      }
    }
    result += ";"
    return result;

  }
}

export class ConditionNode {
  object: Token
  operator: Token
  value: Token
  logOpToNextCondition: Token | null

  constructor(object: Token, operator: Token, value: Token, logOpToNextCondition: Token | null = null) {
    this.object = object;
    this.operator = operator;
    this.value = value;
    this.logOpToNextCondition = logOpToNextCondition;
  }
}
