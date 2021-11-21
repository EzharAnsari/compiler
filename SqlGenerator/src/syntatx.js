
class QueryObject {
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

class ConditionNode {
  constructor(object, operator, value, logOpToNextCondition = null) {
    this.object = object;
    this.operator = operator;
    this.value = value;
    this.logOpToNextCondition = logOpToNextCondition;
  }
}

module.exports = { QueryObject, ConditionNode }