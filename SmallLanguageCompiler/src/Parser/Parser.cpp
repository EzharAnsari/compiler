#include "Parser.h"

extern SymbolTable *st;

Parser::Parser(int argcount, char *argv[]) : Scanner(argcount, argv)
{
    GetTokens();
    TokenPtr = 0;
    thisToken = Tokens[TokenPtr];
}

bool Parser::Program(Node *root)
{
    Node ChildNode;
    if (DeclList(&ChildNode))
    {
        root->typ = "Program";
        root->children.push_back(ChildNode);
        return true;
    }
    return false;
}

bool Parser::Match(tokenType typ)
{
    if (thisToken != typ)
    {
        cout << "ERROR: expected TOKEN " << thisToken << " type identifier but next TOKEN was type " << typ << endl;
        exit(1);
    }

    if (thisToken == typ)
    {
        thisToken = Tokens[++TokenPtr];
        return true;
    }
    return false;
}

// Goal
//  Every production function return bool which indicate whether its accepeted by its production rule or not
//  it takes a pointer of node as argument
//  if production function return true then pointer points a tree corrensponding to that production rule


bool Parser::DeclList(Node *root)
{
    int localPtr = TokenPtr;
    // DeclList Decl
    Node child1, child2;
    if (Decl(&child1) && DeclList(&child2))
    {
        root->typ = "DeclList";
        root->children.push_back(child1);
        root->children.push_back(child2);
        return true;
    }

    TokenPtr = localPtr;
    if (Decl(&child1))
    {
        root = &child1;
        return true;
    }
    TokenPtr = localPtr;
    return false;
}

bool Parser::Decl(Node *root)
{
    int localPtr = TokenPtr;
    Node child;
    if (VarDecl(&child))
    {
        root->typ = "VariablesDecl";
        root->children.push_back(child);
        return true;
    }

    TokenPtr = localPtr;
    if (FunDecl(&child))
    {
        root->typ = "FunctionDecl";
        root->children.push_back(child);
        return true;
    }

    TokenPtr = localPtr;
    return false;
}

bool Parser::VarDecl(Node *root)
{
    int localPtr = TokenPtr;
    Node child1, child2, child3;
    if (TypeSpec(&child1) && VarDeclId(&child2) && Match(tokSemicolon))
    {
        child3.typ = ";";
        root->typ = "VariableDecl";
        root->children.push_back(child1);
        root->children.push_back(child2);
        root->children.push_back(child3);
        // Action DeclareVar
        return true;
    }

    TokenPtr = localPtr;
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
    Node typ, Id, openP, params, closeP, blockStmt;
    int localPtr = TokenPtr;
    if (TypeSpec(&typ) && FunDeclId(&Id))
    {
        if (Match(tokOpenparen))
        {
            openP.typ = '(';
            if (Params(&params) && Match(tokCloseparen))
            {
                closeP.typ = ')';
                if (BlockStmt(&blockStmt))
                {
                    root->typ = "FunctionDecl";
                    root->children.push_back(typ);
                    root->children.push_back(Id);
                    root->children.push_back(openP);
                    root->children.push_back(params);
                    root->children.push_back(closeP);
                    root->children.push_back(blockStmt);
                    return true;
                }
            }
        }
    }
    TokenPtr = localPtr;
    return false;
}

bool Parser::Params(Node *root) {
    int localPtr = TokenPtr;
    Node *param, params, comma;
    if (Param(&param) && Match(tokComma) &&Params(&params)) {
        comma.typ = ",";
        root->typ = "Parameters";
        root->children.push_back(param);
        root->children.push_back(comma);
        root->children.push_back(params);
        return true;
    }
    TokenPtr = localPtr;
    if(Param(&param)) {
        root = &param;
        return true;
    }

    TokenPtr = localPtr;
    return false;
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
    int localPtr = TokenPtr;
    Node *child;
    if(ExpStmt(&child)) {
        root->typ = "Statement";
        root->children.push_back(child);
        return true;
    }
    TokenPtr = localPtr;
    if(BlockStmt(&child)) {
        root->typ = "Statement";
        root->children.push_back(child);
        return true;
    }
    TokenPtr = localPtr;
    if(AssignStmt(&child)) {
        root->typ = "Statement";
        root->children.push_back(child);
        return true;
    }
    TokenPtr = localPtr;
    return false; 
}

bool Parser::BlockStmt(Node *root) {
    int localPtr = TokenPtr;
    Node openB, closeB, localDic, stmts;
    if(Match(tokOpenBracket) && LocalDecls(&localDic) && Stmts(&stmts) && Match(tokCloseBracket)) {
        openB.typ = "{";
        closeB.typ = "}";
        root->typ = "BlockStmt";
        root->children.push_back(localDic);
        root->children.push_back(stmts);
        return true;
    }

    TokenPtr = localPtr;
    return false;
}

bool Parser::LocalDecls(Node *n) {
    int localPtr = TokenPtr;
    Node child1, child2;
    if (VarDecl(&child1) && LocalDecls(&child2)) {
        n->typ = "LocalDecls";
        n->children.push_back(child1);
        n->children.push_back(child2);
        return true;
    }
    TokenPtr = localPtr;
    if (VarDecl(&child1)) {
        n->typ = "LocalDecls";
        n->children.push_back(child1);
        return true;
    }
    TokenPtr = localPtr;
    return false;
}

bool Parser::Stmts(Node *n) {
    int localPtr = TokenPtr;
    Node child1, child2; 
    if (Stmt(&child1) && Stmts(&child2)) {
        n->typ = "Statements";
        n->children.push_back(child1);
        n->children.push_back(child2);
        return true;
    }
    TokenPtr = localPtr;
    if (Stmt(&child1)) {
        n->typ = "Statements";
        n->children.push_back(child1);
        return true;
    }
    TokenPtr = localPtr;
    return false;
}

bool Parser::AssignStmt(Node *n) {
    int localPtr = TokenPtr;
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
    TokenPtr = localPtr;
    return false;
}

bool Parser::ExpStmt(Node *n) {
    int localPtr = TokenPtr;
    Node child;
    if(Exp(&child) && Match(tokSemicolon)) {
        Node child1;
        child1.typ = ";";
        n->typ = "ExpStatement";
        n->children.push_back(child);
        n->children.push_back(child1);
        return true;
    }
    TokenPtr = localPtr;
    return false;
}

bool Parser::Exp(Node *n) {
    int localPtr = TokenPtr;
    Node child1, child2, child3;
    if (SimpleStmt(&child1) && Operation(&child2) && SimpleStmt(&child3)) {
        n->typ = "Expresssion";
        n->children.push_back(child1);
        n->children.push_back(child2);
        n->children.push_back(child3);
        return true;
    }
    TokenPtr = localPtr;
    if (SimpleStmt(&child1)) {
        n->typ = "Expresssion";
        n->children.push_back(child1);
        return true;
    }
    TokenPtr = localPtr;
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
    int localPtr = TokenPtr;
    Node child1, child2, child3;
    if (Term(&child1)) {
        if (Match(tokPlus) && SimpleStmt(&child3)) {
            child2.typ = "+";
            n->typ = "SimpleStatement";
            n->children.push_back(child1);
            n->children.push_back(child2);
            n->children.push_back(child3);
            return true;
        }

        else if (Match(tokMinus) && SimpleStmt(&child3)) {
            child2.typ = "-";
            n->typ = "SimpleStatement";
            n->children.push_back(child1);
            n->children.push_back(child2);
            n->children.push_back(child3);
            return true;
        }

        else {
            n->typ = "SimpleStatement";
            n->children.push_back(child1);
            return true;
        }
    }

    TokenPtr = localPtr;
    return false;
}

bool Parser::Term(Node *n) {
    int localPtr = TokenPtr;
    Node child1, child2, child3;
    if (Factor(&child1)) {
        if (Match(tokMultiply) && Term(&child3)) {
            child2.typ = "*";
            n->typ = "Term";
            n->children.push_back(child1);
            n->children.push_back(child2);
            n->children.push_back(child3);
            return true;
        }

        else if (Match(tokDivide) && Term(&child3)) {
            child2.typ = "/";
            n->typ = "Term";
            n->children.push_back(child1);
            n->children.push_back(child2);
            n->children.push_back(child3);
            return true;
        }

        else {
            n->typ = "SimpleStatement";
            n->children.push_back(child1);
            return true;
        }
    }

    TokenPtr = localPtr;
    return false;
}

bool Parser::Factor(Node *n) {
    int localPtr = TokenPtr;
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
    TokenPtr = localPtr;
    if(Match(tokInteger)) {
        child.typ = "Integer";
        n->typ = "Factor";
        n->children.push_back(child1);
        return true;
    }
    TokenPtr = localPtr;
    if(Match(tokIdentifier)) {
        child.typ = "Identifier";
        n->typ = "Factor";
        n->children.push_back(child1);
        return true;
    }
    TokenPtr = localPtr;
    return false;
}

