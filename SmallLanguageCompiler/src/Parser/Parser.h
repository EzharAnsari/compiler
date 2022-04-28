#ifndef PARSER_H
#define PARSER_H

#include <stack>
#include "../Lexer/Scan.h"
#include "Node.h"

class	Parser : Scanner	{
public:
	Parser(int argcount, char *args[]);
	Parser(void);
	bool	Parse(Node *n);
	Scanner sc;
	int set(void);
	void reset(int value);
private:
	tokenType thisToken;
	int TabIndex;
	stack<Node *> stack;
	tokenType Tokens[150];
	int Tabs[150];
	int TokenPtr;

	bool Match(tokenType typ);
	// void GetTokens(void);

	bool Program(Node *root);
	bool DeclList(Node *root);
	bool Decl(Node *root);

	bool VarDecl(Node *root);
	bool VarDeclId(Node *root);
	bool TypeSpec(Node *root);

	bool FunDeclId(Node *n);
	bool FunDecl(Node *root);
	bool Params(Node *root);
	bool Param(Node *root);
	bool Stmt(Node *root);

	bool BlockStmt(Node *n);
	bool LocalDecls(Node *n);
	bool Stmts(Node *n);
	bool AssignStmt(Node *n);
	bool ExpStmt(Node *n);
	
	bool Exp(Node *n);
	bool Operation(Node *n);
	bool SimpleStmt(Node *n);
	bool Term(Node *n);
	bool Factor(Node *n);




};

#endif