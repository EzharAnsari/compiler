#include <iostream>
using namespace std;

// #include "./Lexer/Scan.h"
#include "./Parser/Parser.h"
// #include "./SymbolTable/SymbolTable.h"

SymbolTable *st = new SymbolTable();

void Display(Node *root, int tabs) {
    for(int i=0; i<tabs; i++) {
        for(int j=0; j<4; j++) {
            cout << " ";
        }
        cout << "|";    
    }
    cout <<  root->typ << " " << root->SymbolEntry << endl;
    // cout << root->children.size() << endl;
    for(int i = 0; i < root->children.size(); i++) {
        Display(&root->children[i], tabs+1);
    }
}

void variableDecl(Node *root, int scope) {
    Node typChild, idChild;
    typChild = root->children[0];
    idChild = root->children[1];
    if(typChild.children[0].SymbolEntry == 10) {
        st->installDataType(idChild.children[0].SymbolEntry, stVariable, dtInteger);
        st->OpenScope(idChild.children[0].SymbolEntry, scope);
    }
    else if(typChild.children[0].SymbolEntry == 15) {
        st->installDataType(idChild.children[0].SymbolEntry, stVariable, dtReal);
        st->OpenScope(idChild.children[0].SymbolEntry, scope);
    }
}

void functionDecl(Node *root, int scope) {
    Node retType, funName, params, stmts;
    retType = root->children[0];
    funName = root->children[1];
    params = root->children[2];
    stmts = root->children[3];
    if(retType.children[0].SymbolEntry == 10) {
        st->installDataType(funName.children[0].SymbolEntry, stFunction, dtInteger);
        st->OpenScope(funName.children[0].SymbolEntry, scope);
    }
    else if(retType.children[0].SymbolEntry == 15) {
        st->installDataType(funName.children[0].SymbolEntry, stFunction, dtReal);
        st->OpenScope(funName.children[0].SymbolEntry, scope);
    }
}

void SymbolTableUpdate(Node *root, int scope) {
    string typ = root->typ;

    if(typ == "VariableDecl") {
        variableDecl(root, scope);
        return;
    }

    if(typ == "FunctionDecl") {
        functionDecl(root, scope);
        return;
    }

    for(int i = 0; i < root->children.size(); i++) {
        SymbolTableUpdate(&root->children[i], scope+1);
    }



}

int main(int argc, char *argv[]) {
    Node root;

    Parser *p = new Parser(argc, argv);

    if (p->Parse(&root)) {
        cout << "Success" << endl;
        Display(&root, 0);
        SymbolTableUpdate(&root, -1);
    }
    else {
        cout << "Unsuccess" << endl;
    }

    st->display();
    return 0;
}
