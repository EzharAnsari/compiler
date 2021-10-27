// ***************** Grammar Rule ****************** //
/**
 * query -> FROM fromList WHERE condition SELECT selList
 *           | CREATE TABLE tableName tableElementList SEMICOLON
 * 
 * selList -> attribute
 *           | attribute COMMA selList
 * 
 * fromList -> relation
 *           | relation COMMA fromList
 * 
 * condition -> condition AND condition
 *           | attribute IN LEFTPAREN query RIGHTPAREN
 *           | attribute = attribute
 *           | attribute LIKE pattern
 */