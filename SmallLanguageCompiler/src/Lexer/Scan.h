#ifndef SCAN_H
#define SCAN_H

#include <iostream>
#include <stdio.h>
#include <fstream>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>

#include "../SymbolTable/SymbolTable.h"

const int FileNameLen = 41;    // Maximum length of file names
const int LexemLen = 81;       // Maximum length of lexems
const char EndOfFile = '\0';   // Endicating "End Of File"

class Scanner {
    public:
        Scanner(int argc, char *argv[]);      // Constructor that gets the file name
        Scanner(void);                        // Default Constructor                                                          
        ~Scanner(void);                       // The Destructor
        tokenType GetToken(int &TabIndex);    // Returns the next token to the parser
        
    private:
        char Gettc(void);                             // Get the next character, updating the line count
        void Ungettc(char c);                         // Takes back a character, updating the line count
        char FirstChar(void);                         // Returns the first character after white space and commects
        tokenType ScanWord(char c, int &TabIndex);    // Scans a word - assumes that the first character is a letter
        tokenType ScanNum(char c, int &TabIndex);     // Scans a number - assumes that the first character is a digit
        tokenType ScanOp(char c, int &TabIndex);      // Scans a word - assumes that the first character is a non-alphanumeric
        bool FileFound(char * FileName);              // True if the file is found, false if not
        char LookAhead;                               // The lookahead character
        ifstream FileBuff;                            // The source file
    protected:
        int LineNum;              // The current line number
};

#endif