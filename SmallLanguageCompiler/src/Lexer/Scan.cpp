#include "Scan.h"

extern SymbolTable *st;

void Scanner::ScannerInit(int argc, char *argv[]) {
    char FileName[FileNameLen];
    char tem[] = "example.txt";

    switch (argc)
    {
    case 1:
        cout << "File name\t?";
        // cin >> FileName;
        strcpy(FileName, tem);
        
        break;
    case 2:
        strcpy(FileName, argv[1]);
        break;    
    default:
        cout << "Usage: SimpleLanguage <FileName>\n";
        break;
    }

    // cout << FileName;
    if(!FileFound(FileName))
        cout << "Cannot find " << FileName << endl;
    
    FileBuff.open(FileName, ios::in);
    if (!FileBuff) {
        cout << "Cannot open " << FileName << endl;
        exit(2);
    }

    LineNum = 1;
    if (!FileBuff.eof())
        LookAhead = FirstChar();
}

// ~scanner() -	Close the file when finished with it.
Scanner::~Scanner(void)
{
	FileBuff.close();
}

// FileFound() -	Returns true if the file exists
//					Returns false if it doesn't
bool Scanner::FileFound(char *FileName) {
    FILE *fp;
    bool value;

    if ((fp = fopen(FileName, "r")) != NULL)	{
		value = true;
		fclose(fp);
	}
	else
		value = false;
	
	return(value);
}

// FirstChar() -	Skips past both white space and comments until
//					it finds the first non-white space character
//					outside a comment.

char Scanner::FirstChar(void) {
    char c;
    bool GoodChar = false;

    if (FileBuff.eof())
        return(EndOfFile);
    
    while (!GoodChar)
    {
        while (!FileBuff.eof() && isspace(c = Gettc()));
        GoodChar = true;
    }

    if (FileBuff.eof())
        return(EndOfFile);
    else
        return(c);
}

// Gettc() -	Fetches a character from a file.  It uses getc and adjusts
//		the line number count when necessary.
char Scanner::Gettc(void) {
    char c = '\0';
    
    if (FileBuff.get(c)) {
        if(c == '\n')
            LineNum++;
        return(tolower(c));
    }

    return c;
}

// ungettc() -	Returns a character to the file.  Uses ungetc and will
//		adjust line number count.
void Scanner::Ungettc(char c) {

    if (c == '\n')
        --LineNum;
    FileBuff.putback(c);
}

// GetToken() -	Scan out the token strings of the language 
//				and return the corresponding token class 
//				to the parser.
tokenType Scanner::GetToken(int &TabIndex) {
    char c=LookAhead;

    if (c == EndOfFile)
        return(tokEof);
    // If it begins with a letter, it is a word.  If
	// begins with a digit, it is a number.  Otherwise,
	// it is an Operator | Error.
    LookAhead = Gettc();
    if (isalpha(c)) {
        return(ScanWord(c, TabIndex));
    }
    else if(isdigit(c)) {
        return(ScanNum(c, TabIndex));
    }
    else {
        return(ScanOp(c, TabIndex));
    }
}

// ScanWord() -	Scan until you encounter something other than a letter.
tokenType Scanner::ScanWord(char c, int &TabIndex) {
    char Lexeme[LexemLen];
    int i = 0;
    Lexeme[i++] = c;
    while ((c = LookAhead) != EndOfFile && (isalpha(c) || isdigit(c)))
    {
        Lexeme[i++] = c;
        LookAhead = Gettc();
    }

    //	Add a null byte to terminate the string and get the 
	//	lookahead that begins the next lexeme.
    Lexeme[i] = '\0';
    Ungettc(LookAhead);
    LookAhead = FirstChar();
    //	If the lexeme is already in the symbol table,
	//	return its tokenclass.  If it isn't, it must
	//	be an identifier whose type we do not know yet.
    if (st->installName(Lexeme, TabIndex)) {
        return(st->getTokClass(TabIndex));
    }
    else {
        st->setAttrib(TabIndex, stUnknown, tokIdentifier);
        return(tokIdentifier);
    }
     
}

// ScanNum -    Scan for number
tokenType Scanner::ScanNum(char c, int &TabIndex) {
    int ival, i = 0;
    bool isitreal = false;
    float rval;
    char Lexeme[LexemLen];

    Lexeme[i++] = c;
    while ((c = LookAhead) != EndOfFile && isdigit(c))
    {
        Lexeme[i++] = c;
        LookAhead = Gettc();
    }

    // Is there a fractional part?
    if (c == '.') {
        LookAhead = Gettc();
        isitreal = true;
        Lexeme[i++] = c;
        while ((c = LookAhead) != EndOfFile && isdigit(c))
        {
            Lexeme[i++] = c;
            LookAhead = Gettc();
        }
    }

    //	Add a null byte to terminate the string and get the 
	//	lookahead that begins the next lexeme.
    Ungettc(LookAhead);
    Lexeme[i] = '\0';
    cout << "\"" << Lexeme << "\"" << endl;
    LookAhead = FirstChar();

    //If there is no fractional part, it is an integer literal
	// constant.  Otherwise, it is a real literal constant.
	// Firstly, is it already in the symbol table?
    if (st->installName(Lexeme, TabIndex))
        return(st->getTokClass(TabIndex));
    // If not, is it real?
    else if (isitreal) {
        st->setAttrib(TabIndex, stUnknown, tokConstant);
        st->installDataType(TabIndex, stLiteral, dtReal);
        rval = atof(Lexeme);
        st->setValue(TabIndex, rval);
        return (st->getTokClass(TabIndex));
    }
    // Must be an integer literal
    else {
        st->setAttrib(TabIndex, stUnknown, tokConstant);
        st->installDataType(TabIndex, stLiteral, dtInteger);
        ival = atoi(Lexeme);
        st->setValue(TabIndex, ival);
        return (st->getTokClass(TabIndex));
    }

    Ungettc(LookAhead);
    return(st->getTokClass(TabIndex)); 
}

// ScanOp() -	Scan for an operator, which is a single character
//		other than a letter or number.
tokenType Scanner::ScanOp(char c, int &TabIndex) {
    char Lexeme[LexemLen];

    Lexeme[0] = c;

    Ungettc(LookAhead);
    Lexeme[1] = '\0';
    LookAhead = FirstChar();

    if (!st->isPresent(Lexeme, TabIndex)) {
        cerr << Lexeme << " is an illegal operator on line #"
			<< LineNum << endl;
		exit(3);
    }

    return(st->getTokClass(TabIndex));
}

// void Scanner::GetTokens(void) {
//     int i=0;
//     bool f = true;
//     int tab[150];
//     tokenType tok[150];

//     while(!FileBuff.eof() && f) {    
//         tok[i] = GetToken(tab[i]);
//         TabIndex[i] = &tab[i];
//         Tokens[i] = &tok[i];
//         if(tok[i] == tokEof)
//             f= false;
        
//         i++;
//     }

//     FileBuff.close();

// }

void Scanner::GetTokens(tokenType *token, int *tabIndexs) {
    int i=0;
    bool f = true;

    while(!FileBuff.eof() && f) {

        token[i] = GetToken(tabIndexs[i]);
        if(token[i] == tokEof)
            f= false;
        // cout << "Token type  " << token[i] << endl;
        i++;
    }

    FileBuff.close();

}