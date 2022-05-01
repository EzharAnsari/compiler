#include "Parser.h"

extern SymbolTable *st;


Parser::Parser(int argcount, char *argv[])
{
    sc.ScannerInit(argcount, argv);
    sc.GetTokens(Tokens, Tabs);
    TokenPtr = 0;
    thisToken = Tokens[TokenPtr];

}

int Parser::set(void) {
    return TokenPtr;
}

void Parser::reset(int val) {
    TokenPtr = val;
    thisToken = Tokens[TokenPtr];
}

bool Parser::Parse(Node *n) {
    return Program(n);
}

bool Parser::Program(Node *root)
{
    Node ChildNode, child1;
    if (DeclList(&ChildNode) && Match(tokEof))
    {
        child1.typ = "EOF";
        root->typ = "Program";
        root->children = ChildNode.children;
        root->children.push_back(child1);
        return true;
    }
    return false;
}

bool Parser::Match(tokenType typ)
{
    if (thisToken != typ)
    {
        cout << "ERROR: expected TOKEN " << thisToken << " type but next TOKEN was type " << typ << " Line number: " << sc.LineNum << endl;
        // exit(1);
    }

    if (thisToken == typ)
    {
        TokenPtr++;
        thisToken = Tokens[TokenPtr];
        return true;
    }
    if(thisToken == tokEof) {
        cout << "End of tokens" << endl;
    }
    return false;
}

bool Parser::DeclList(Node *root)
{
    int localPtr = set();
    Node child1, child2;
    while (Decl(&child1))
    {
        root->children.push_back(child1);
        child1 = child2;
        localPtr = set();
    }
    if(thisToken == tokEof) {
        return true;
    }
    reset(localPtr);
    return false;
}

bool Parser::Decl(Node *root)
{
    int localPtr = set();
    Node child;
    if (VarDecl(&child))
    {
        root->typ = child.typ;
        root->children = child.children;
        return true;
    }

    reset(localPtr);
    if (FunDecl(&child))
    {
        root->typ = child.typ;
        root->children = child.children;
        return true;
    }

    reset(localPtr);
    return false;
}

bool Parser::VarDecl(Node *root)
{
    int localPtr = set();
    Node child1, child2, child3;
    if (TypeSpec(&child1) && VarDeclId(&child2) && Match(tokSemicolon))
    {
        child3.typ = ";";
        root->typ = "VariableDecl";
        root->children.push_back(child1);
        root->children.push_back(child2);
        // Action DeclareVar
        // cout << "hee" << endl;
        return true;
    }

    reset(localPtr);
    return false;
}

bool Parser::VarDeclId(Node *root)
{
    if (Match(tokIdentifier))
    {
        Node child;
        child.typ = "Identifier";
        root->typ = "VarDeclId";
        root->children.push_back(child);
        return true;
    }

    return false;
}

bool Parser::TypeSpec(Node *root)
{
    Node child;
    if (Match(tokInteger))
    {
        child.typ = "Integer";
        root->typ = "TypeSpec";
        root->children.push_back(child);
        return true;
    }

    return false;
}

bool Parser::FunDeclId(Node *root)
{
    if (Match(tokIdentifier))
    {
        Node child;
        child.typ = "Identifier";
        root->typ = "FunDeclId";
        root->children.push_back(child);
        return true;
    }

    return false;
}

bool Parser::FunDecl(Node *root)
{
    Node typ, Id, params, blockStmt;
    int localPtr = set();
    if (TypeSpec(&typ) && FunDeclId(&Id))
    {
        if (Match(tokOpenparen))
        {
            if (Params(&params) && Match(tokCloseparen))
            {
                if (Match(tokOpenBracket) && FuncStmt(&blockStmt) && Match(tokCloseBracket))
                {
                    root->typ = "FunctionDecl";
                    root->children.push_back(typ);
                    root->children.push_back(Id);
                    root->children.push_back(params);
                    root->children.push_back(blockStmt);
                    return true;
                }
            }
        }
    }
    reset(localPtr);
    return false;
}

bool Parser::FuncStmt(Node *root) {
    // Todo
    // Local variable declaration
    // statements;
    int localPtr = set();
    Node ChildNode;
    if (FuncStmtHelper(&ChildNode))
    {
        root->typ = "FuncStatement";
        root->children = ChildNode.children;
        return true;
    }
    reset(localPtr);
    return false;

}

bool Parser::FuncStmtHelper(Node *root) {
    int localPtr = set();
    Node child1, child2;
    while (FunVarDecAndStmt(&child1))
    {
        root->children.push_back(child1);
        child1 = child2;
        localPtr = set();
    }
    reset(localPtr);
    return true;
}

bool Parser::FunVarDecAndStmt(Node *root) {
    int localPtr = set();
    Node child;
    if (LocalDecl(&child))
    {
        root->typ = child.typ;
        root->children = child.children;
        return true;
    }

    reset(localPtr);
    if (Stmt(&child))
    {
        root->typ = child.typ;
        root->children = child.children;
        return true;
    }

    reset(localPtr);
    return false;
}

bool Parser::LocalDecl(Node *root) {
    int localPtr = set();
    Node child1, child2, child3;
    if (TypeSpec(&child1) && VarDeclId(&child2) && Match(tokSemicolon))
    {
        child3.typ = ";";
        root->typ = "LocalVarDecl";
        root->children.push_back(child1);
        root->children.push_back(child2);
        // Action DeclareVar
        // cout << "hee" << endl;
        return true;
    }

    reset(localPtr);
    return false;
}

bool Parser::Params(Node *root) {
    int localPtr = set();
    Node param;
    root->typ = "Parameters";
    while (Param(&param)) {
        root->children.push_back(param);
        Match(tokComma);
        Node tem;
        param = tem;
        localPtr = set();
    }
    reset(localPtr);
    return true;
}

bool Parser::Param(Node *root) {
    Node typ, id;
    if(TypeSpec(&typ) && Match(tokIdentifier)) {
        id.typ = "Identifier";
        root->typ = "Parameter";
        root->children.push_back(typ);
        root->children.push_back(id);
        return true;
    }

    return false;
}

bool Parser::Stmt(Node *root) {
    int localPtr = set();
    Node child;
    if(ExpStmt(&child)) {
        root->typ = child.typ;
        root->children = child.children;
        return true;
    }
    reset(localPtr);
    if(BlockStmt(&child)) {
        root->typ = child.typ;
        root->children = child.children;
        return true;
    }
    reset(localPtr);
    if(AssignStmt(&child)) {
        root->typ = child.typ;
        root->children = child.children;
        return true;
    }
    reset(localPtr);
    return false; 
}

bool Parser::BlockStmt(Node *root) {
    int localPtr = set();
    Node child, child1;
    if(Match(tokOpenBracket) && FuncStmtHelper(&child) && Match(tokCloseBracket)) {
        root->typ = "BlockStmt";
        root->children.push_back(child);
        child = child1;
        return true;
    }

    reset(localPtr);
    return false;
}

bool Parser::LocalDecls(Node *n) {
    int localPtr = set();
    Node child1, child2;
    if (VarDecl(&child1) && LocalDecls(&child2)) {
        n->typ = "LocalDecls";
        n->children.push_back(child1);
        n->children.push_back(child2);
        return true;
    }
    reset(localPtr);
    if (VarDecl(&child1)) {
        n->typ = "LocalDecls";
        n->children.push_back(child1);
        return true;
    }
    reset(localPtr);
    return false;
}

bool Parser::Stmts(Node *n) {
    int localPtr = set();
    Node child1, child2; 
    if (Stmt(&child1) && Stmts(&child2)) {
        n->typ = "Statements";
        n->children.push_back(child1);
        n->children.push_back(child2);
        return true;
    }
    reset(localPtr);
    if (Stmt(&child1)) {
        n->typ = "Statements";
        n->children.push_back(child1);
        return true;
    }
    reset(localPtr);
    return false;
}

bool Parser::AssignStmt(Node *n) {
    int localPtr = set();
    Node child;
    if(Match(tokIdentifier) && Match(tokEquals) && ExpStmt(&child)) {
        Node child1, child2;
        child1.typ = "Identifier";
        child2.typ = "=";
        n->typ = "Assignment";
        n->children.push_back(child1);
        n->children.push_back(child2);
        n->children.push_back(child);
        return true;
    }
    reset(localPtr);
    return false;
}

bool Parser::ExpStmt(Node *n) {
    int localPtr = set();
    Node child;
    if(Exp(&child) && Match(tokSemicolon)) {
        n->typ = child.typ;        
        n->children = child.children;
        return true;
    }
    reset(localPtr);
    return false;
}


bool Parser::Exp(Node *n) {
    int localPtr = set();
    Node left, op, right;
    if(SimpleStmt(&left)) {
        localPtr = set();
        if(Operation(&op) && SimpleStmt(&right)) {
            n->typ = "Expression";
            op.children.push_back(left);
            op.children.push_back(right);
            n->children.push_back(op);
            return true;
        }
        reset(localPtr);
        n->typ = left.typ;
        n->children = left.children;
        return true;
    }
    reset(localPtr);
    return false;
}

bool Parser::Operation(Node *n) {
    Node child;
    if(Match(tokLess)) {
        child.typ = "<";
        n->typ = "Operation";
        n->children.push_back(child);
        return true;
    }
    if(Match(tokGreater)) {
        child.typ = ">";
        n->typ = "Operation";
        n->children.push_back(child);
        return true;
    }
    return false;
}

bool Parser::SimpleStmt(Node *n) {
    int localPtr = set();
    Node left, op, right;
    if (Term(&left)) {
        localPtr = set();
        if (Match(tokPlus) && SimpleStmt(&right)) {
            op.typ = "+";
            n->typ = "AdditionStatement";
            op.children.push_back(left);
            op.children.push_back(right);
            n->children.push_back(op);
            return true;
        }
        reset(localPtr);

        if (Match(tokMinus) && SimpleStmt(&right)) {
            op.typ = "-";
            n->typ = "SubstractStatement";
            op.children.push_back(left);
            op.children.push_back(right);
            n->children.push_back(op);
            return true;
        }
        reset(localPtr);

        n->typ = left.typ;
        n->children = left.children;
        return true;
    }

    reset(localPtr);
    return false;
}

bool Parser::Term(Node *n) {
    int localPtr = set();
    Node left, op, right;
    if (Factor(&left)) {
        localPtr = set();
        if (Match(tokStar) && Term(&right)) {
            op.typ = "*";
            n->typ = "MultiplicationStatement";
            op.children.push_back(left);
            op.children.push_back(right);
            n->children.push_back(op);
            return true;
        }
        reset(localPtr);

        if (Match(tokMinus) && Term(&right)) {
            op.typ = "/";
            n->typ = "DivideStatement";
            op.children.push_back(left);
            op.children.push_back(right);
            n->children.push_back(op);
            return true;
        }
        reset(localPtr);

        n->typ = left.typ;
        n->children = left.children;
        return true;
    }

    reset(localPtr);
    return false;
}

bool Parser::Factor(Node *n) {
    int localPtr = set();
    Node child;
    if (Match(tokOpenparen) && Exp(&child) && Match(tokCloseparen)) {
        Node child1, child2;
        child1.typ = "(";
        child2.typ = ")";
        n->typ = "Factor";
        n->children.push_back(child1);
        n->children.push_back(child);
        n->children.push_back(child2);
        return true;
    }
    reset(localPtr);
    if(Match(tokInteger)) {
        child.typ = "Integer";
        n->typ = "Factor";
        n->children.push_back(child);
        return true;
    }
    reset(localPtr);
    if(Match(tokIdentifier)) {
        child.typ = "Identifier";
        n->typ = "Factor";
        n->children.push_back(child);
        return true;
    }
    reset(localPtr);
    return false;
}

enum actiontype {  AcPushReal, AcPushInt, AcDeclVar, AcDeclParam};

void ProcessAction(int ActionType, Node *node) {
    switch(ActionType) {
        // case AcPushReal: PushReal(node); break;
        // case AcPushInt: PushInt(node); break;
        // case AcDeclVar: DeclareVar(node); break;
    }
}

// Action Definition
void DeclareVar(Node *n) {
    // |VariableDecl
    // |    |    |    |TypeSpec
    // |    |    |    |    |Integer
    // |    |    |    |VarDeclId
    // |    |    |    |    |Identifier
    // |    |    |    |;
    
    while(n->typ == "VariableDecl");
}