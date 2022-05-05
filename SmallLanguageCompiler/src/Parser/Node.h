#ifndef NODE_H
#define NODE_H

struct Node{
    std::string typ;
    int SymbolEntry = -1;
    vector<Node> children;
};

#endif