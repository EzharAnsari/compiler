#include <bits/stdc++.h>
using namespace std;

struct Node
{
    std::string typ;
    
    vector<Node> childrens;
};

class Parser{
public:
    string input;
    Parser(string vl);
    int iniptr, len;
    void advance(void);
    bool S(Node *root);
    bool A(Node *root);
    bool parse(Node *root);
    void Display(Node *root, int tabs);
};

Parser::Parser(string vl) {
    input = vl;
    iniptr = 0;
    len = input.length();
}

void Parser::advance(void) {
    if(iniptr < len) {
        iniptr++;
    }
    else
        iniptr = -1;
}

bool Parser::parse(Node *root) {
    Node child;
    if (S(&child)) {
        root->typ = "Root";
        root->childrens.push_back(child);
        return true;
    }
    else
        return false;
}

// S => aAd
// A => bc | b
// Input = abd

bool Parser::S(Node *root) {
    if (input[iniptr] == 'a') {
        Node child1, child2, child3;
        child1.typ = "a";
        advance();
        if (A(&child2)) {
            if (input[iniptr] == 'd') {
                child3.typ = "d";
                advance();
                root->typ = "S";
                root->childrens.push_back(child1);
                root->childrens.push_back(child2);
                root->childrens.push_back(child3);
                return true;
            }
            return false;
        }
        return false;
    }
    return false;
}

bool Parser::A(Node *root) {
    int localPtr = iniptr;    
    // For bc rule
    iniptr = localPtr;
    if (input[iniptr] == 'b') {
        Node child1;
        child1.typ = "b";
        advance();
        if (input[iniptr] == 'c') {
            Node child2;
            child2.typ = "c";
            advance();
            root->typ = "A";
            root->childrens.push_back(child1);
            root->childrens.push_back(child2);
            return true;
        }
    }
    // for b
    iniptr = localPtr;
    if (input[iniptr] == 'b') {
        Node child1;
        child1.typ = "b";
        advance();
        root->typ = "A";
        root->childrens.push_back(child1);
        return true;
    }

    // for A
    Node child;
    if (A(&child)) {
        root->typ = "A";
        root->childrens.push_back(child);
        return true;
    }
    return false;
}


void Parser::Display(Node *root, int tabs) {
    for(int i=0; i<tabs; i++) {
        for(int j=0; j<4; j++) {
            cout << " ";
        }
        cout << "|";
    }
    cout << "--->"<< root->typ << endl;
    // cout << root->childrens.size() << endl;
    for(int i = 0; i < root->childrens.size(); i++) {
        Display(&root->childrens[i], tabs+1);
    }
}



int main() {
    string s = "abcd";
    Node root;

    Parser *p = new Parser(s);

    if (p->parse(&root)) {
        cout << "Success" << endl;
        p->Display(&root, 0);
    }
    else {
        cout << "Unsuccess" << endl;
    }
    return 0;
}
