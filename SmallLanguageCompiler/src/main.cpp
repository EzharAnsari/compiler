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
        cout << "";
    }
    cout <<  root->typ << endl;
    // cout << root->children.size() << endl;
    for(int i = 0; i < root->children.size(); i++) {
        Display(&root->children[i], tabs+1);
    }
}

int main(int argc, char *argv[]) {
    Node root;

    Parser *p = new Parser(argc, argv);

    if (p->Parse(&root)) {
        cout << "Success" << endl;
        Display(&root, 0);
    }
    else {
        cout << "Unsuccess" << endl;
    }


    return 0;
}

// int main() {
//     int a, b;
//     a = 8;
//     cout << "hell" << endl;
//     return 1; 
// }