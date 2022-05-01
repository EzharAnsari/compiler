#ifndef NODE_H
#define NODE_H

struct Node{
    std::string typ;
    int SymbolEntry;
    vector<Node> children;
};

#endif