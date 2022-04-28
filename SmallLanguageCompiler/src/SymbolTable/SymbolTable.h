#ifndef SYMBOLTABLE_H
#define SYMBOLTABLE_H

#include	<iostream>
#include	<fstream>
#include	<iomanip>
#include	<stdlib.h>
#include	<ctype.h>
#include	<string.h>
#include	<stack>
#include	<algorithm>

using namespace std;

// constant declaration
const int tabStop = 8;
// The size of the name table, hash table, string table 
//		and attribute table
const int	nameTableSize = 200, hashTableSize = 100, 
			stringTableSize = 1200, attribTableSize = 200;

const int maxLine = 121;

const int numKeywords = 21, numTokens = 36, labelSize = 10;

// The tokens
enum	tokenType {tokBegin, tokCall, tokDeclare, tokDo, 
			tokElse,tokEnd, tokEndif, tokEnduntil,  tokEndwhile, tokIf, 
			tokInteger, tokParameters, tokProcedure, tokProgram, tokRead,
			tokReal, tokSet, tokThen, tokUntil, tokWhile, tokWrite,
			tokStar, tokPlus, tokMinus, tokSlash, tokEquals,
			tokSemicolon, tokComma, tokPeriod, tokGreater, tokLess,
			tokNotequal, tokOpenparen, tokCloseparen, tokOpenBracket, tokCloseBracket, tokFloat,
			tokIdentifier, tokConstant, tokError, tokEof, tokUnknown
};

// The semantic types, i.e, keywords, procedures, variables, constants
enum semanticType	{stUnknown, stKeyword, stProgram,
					stParameter, stVariable, stTempvar,
					stConstant, stEnum, stStruct, stUnion, stProcedure,
					stFunction, stLabel, stLiteral, stOperator
};

// The data types, i.e, real and integer
enum dataType  {dtUnknown, dtNone, dtProgram, dtProcedure,
				dtInteger, dtReal
};

// The structure for name table entries, i.e, a starting point in
// a long array, a pointer to the entry in the attribute table and 
//	the next lexeme with the same hash value.
typedef struct {
     int       strstart;
     int       symtabptr;
     int       nextname;
}	nameTabType;

// The value can be either integer or real.  We save the tag which
// tells is which it is and store the result in a union.
enum tagType   {tint, treal};

union valType  {
     int	ival;
     float	rval;
};

// The structure that stores the tag and the value
typedef	struct	{
     tagType   tag;
     valType  val;
}	valRec;

// The structure of the attribute table entry, which includes:
//	semantic, token and data types
//	index of the procedure in which this symbol appears
//	index of the name table entry
//	index of the symbol's attribute table entry outside this scope
//	index of the next sentry in this scope so we can close them all
//	value of the constant
//	a label usually indicating address in the object code.
typedef	struct	{
     semanticType	smType;
     tokenType		tokClass;
     dataType		dataClass;
     int			owningprocedure;
     int			thisname;
     int			outerscope, scopenext;
     valRec			value;
     char			label[labelSize];
}	attribTabType;

// The structure for each item that is pushed on the procedure stack
// This includes:
//	index of the procedure in the attribute table
//	index of the first attribute table entry for 
//		this scope
//	index of the next attribute table entry for
//		this scope
typedef struct	{
	int	proc;
	int	sstart, snext;
} procStackItem;

// The definition of the class SymbolTable
class	SymbolTable	{
	public:
		SymbolTable(void);
		void		display(void);		// Prints the entire symbol table 
								//		in user-friendly form
		//	Functions that set up the symbol table
		//		Installname() - 
		//		If it is's there returns true
		//		If it's not, it installs it and returns false
		bool 		installName(char string[], int &tabIndex);
		//	True if it's there; false if it's not
		bool		isPresent(char string[], int &tabIndex);
		//	Creates and attribute table entry
		int			installAttrib(int nameIndex);
		//	Initializes the semantic type and token type
		void		setAttrib(int tabindex, semanticType symbol, tokenType token);
		// Returns basic information about symbols
		tokenType	getTokClass(int tabIndex);
		//  Initializes the data type for the entry
		void		installDataType(int tabIndex, semanticType stype, dataType dclass);
		//  Print the lexeme and token in user-friendly formats
		void		printLexeme(int i);
		void		printToken(int i);
		// Functions that set and return the value of a constant
		void		setValue(int tabIndex, float val);	// Set it for a real
		void		setValue(int tabIndex, int val);	// Set it for an integer
		void custum(void);

		// Function that handle name scoping
		int		OpenScope(int TabIndex);          // Opens a new scope
		void	CloseScope(void);                 // Closes the scope	

	protected:
		// Initializes the procedure stack's entry
		procStackItem initProcEntry(int tabindex);
		// Returns the hash value for a given lexeme
		// Prints the lexeme in all capital letters
		void		LexemeInCaps(int tabIndex);
		int	hashCode(char string[]);
		// True if it's there; false if it's not
		bool isPresent(char string[], int &code, int &nameindex);
		char stringTable[stringTableSize];
		nameTabType	nameTable[nameTableSize];
		attribTabType attribTable[attribTableSize];
		int hashTable[hashTableSize];
		// The lengths of the string table, name table and attribute table
		int strTabLen=0, namTabLen=0, attribTabLen=0;

		procStackItem thisProc;	// A stack entry for the current procedure
		stack <procStackItem>	ps;	// The procedure stack
		inline int min(int a, int b);
};


#endif