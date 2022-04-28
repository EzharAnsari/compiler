#include "SymbolTable.h"

//	The key words and operators - used in initializing the symbol
//	table
char *keyString[] = {"begin", "call", "declare",
										 "do", "else", "end", "endif", "enduntil", "endwhile",
										 "if", "integer", "parameters", "procedure", "program",
										 "read", "real", "set", "then", "until", "while",
										 "write", "*", "+", "-", "/", "=", ";",
										 ",", ".", ">", "<", "!", "(", ")", "{", "}", "_float"};

//	The names of the token classes in a format that can
//	be printed in a symbol table display
char *tokclString[] = {"begin     ", "call      ",
											 "declare   ", "do        ", "else      ", "end       ",
											 "endif     ", "enduntil  ", "endwhile  ", "if        ",
											 "integer   ", "parameters", "procedure ", "program   ",
											 "read      ", "real      ", "set       ", "then      ",
											 "until     ", "while     ", "write     ", "star      ",
											 "plus      ", "minus     ", "slash     ", "equals    ",
											 "semicolon ", "comma     ", "period    ", "greater   ",
											 "less      ", "notequal  ", "openparen ", "closeparen",
											 "openbrak  ", "closebrak ", "float     ", "identifier",
											 "constant  ", "error     ", "eof       ", "unknown   "};

//	The names of the semantic types in a format that can be
//	printed  in a symbol table display
char *symTypeString[] = {"unknown  ", "keyword  ", "program  ",
												 "parameter", "variable ", "temp. var",
												 "constant ", "enum     ", "struct   ",
												 "union    ", "procedure", "function ",
												 "label    ", "literal  ", "operator "};

//	The names of the data types in a format that can be
//	printed  in a symbol table display
char *dataTypeString[] = {"unknown", "none   ", "program",
													"proced.", "integer", "real   "};


// symboltable() -	The initializing constructor for
//					the symbol table
SymbolTable::SymbolTable(void) {
	int i, nameIndex;

	// Initialize the first entry for the procedure stack
	thisProc = initProcEntry(-1);

	for(i=0; i<hashTableSize; i++)
		hashTable[i] = -1;

	for(i=0; i<nameTableSize; i++)
		nameTable[i].nextname = -1;
	
	//	The attribute table's fields are all initially
	//	unknown, 0 or -1
	for(i=0; i<attribTableSize; i++) {
		attribTable[i].smType = stUnknown;
		attribTable[i].tokClass = tokUnknown;
		attribTable[i].thisname = -1;
		attribTable[i].value.tag = tint;
		attribTable[i].value.val.ival = 0;
		attribTable[i].owningprocedure = -1;
		attribTable[i].outerscope = -1;
		attribTable[i].scopenext = -1;
		attribTable[i].label[0] = '\0';
	}

	// Install the keywords in the name table and
	//          set their attributes to keyword
	for( i = 0; i < numKeywords; i++) {
		installName(keyString[i], nameIndex);
		setAttrib(nameIndex, stKeyword, (tokenType)i);
	}

	// Install the operators in the name table and
	//          set their attributes to operator 
	for  (i = numKeywords; i < numTokens;  i++)  {
		installName(keyString[i],nameIndex);
		setAttrib(nameIndex, stOperator, (tokenType)i);
	}

	//	Initialize the entry for float, the routine
	//	that converts values from integer to real
	installName(keyString[i], nameIndex);
	setAttrib(nameIndex, stFunction, (tokenType)i);
	installDataType(nameIndex, stFunction, dtReal);

	cout << "All initiallized" << endl;
}

// InstallName() -	Check if the name is already in the table.
//					If not add it to the name table and create
//					an attribute table entry.
bool SymbolTable::installName(char string[], int &tabIndex) {
	int i, code, length, nameIndex;

	// Use the function ispresent to see if the token string
	// is in the table.  If so, return a pointer to its
	// attribute table entry.
	length = strlen(string);
	if (isPresent(string, code, nameIndex)) {
		if(nameTable[nameIndex].symtabptr == -1) {
			tabIndex = installAttrib(nameIndex);
			return(false);
		}
		else {
			tabIndex = nameTable[nameIndex].symtabptr;
			return(true);
		}
	}

	// If not create entries in the name table, copy the name
	// into the string table and create a hash table entry
	// (linking it to its previous entry if necessary) and
	// create an entry in the attribute table with the
	// bare essentials.
	nameIndex = namTabLen++;
	nameTable[nameIndex].strstart = strTabLen;
	
	for( i = 0; i < length; i++)
		stringTable[strTabLen++] = string[i];
	stringTable[strTabLen++] = '\0';
	nameTable[nameIndex].nextname = hashTable[code];
	hashTable[code] = nameIndex;
	tabIndex = installAttrib(nameIndex);
	return(false);
}

bool SymbolTable::isPresent(char string[], int &code, int &nameIndex) {
	bool found = false;
	int oldNameIndex, k;

	/* Initialize the old name's index to -1. it may not be there */
	oldNameIndex = -1;

	// Find the hash value 
	code = hashCode(string);
	for  (nameIndex = hashTable[code]; !found && nameIndex != -1; oldNameIndex = nameIndex, nameIndex = nameTable[nameIndex].nextname) {
		k = nameTable[nameIndex].strstart;
		found = !strcmp(string, stringTable+k);
	}

	if (found)     
		nameIndex = oldNameIndex;
	return(found);
}

// HashCode() -	A hashing function which uses the characters
//				from the end of the token string.
int  SymbolTable::hashCode(char string[]) {
	int       i, numShifts, startChar, length;
	unsigned  code;

	length = strlen(string);
	numShifts = (int) min(length, (int)(8*sizeof(int)-8));

	startChar = ((length-numShifts) % 2);
	code = 0;

	//	Left shift one place and add the current character's ASCII
	//	value to the total.
	for (i = startChar;  i <= startChar + numShifts - 1;  i++)
		code = (code << 1) + string[i];

	//	Divide by the table size and use the remainder as the hash 
	//	value.
	return(code % hashTableSize);
}

procStackItem SymbolTable::initProcEntry(int tabIndex) {
	procStackItem temProc;

	temProc.proc = tabIndex;
	temProc.sstart = -1;
	temProc.snext = -1;
	return(temProc);
}

// InstallAttrib() -	Create a new entry in the attribute
//						table and have this name table 
//						entry point to it.
int	SymbolTable::installAttrib(int nameIndex) {
	int tabIndex;

	tabIndex = nameTable[nameIndex].symtabptr = attribTabLen++;
	attribTable[tabIndex].thisname = nameIndex;
	attribTable[tabIndex].smType = stUnknown;
	attribTable[tabIndex].dataClass = dtUnknown;

	// Return the index of the attribute table entry
	return(tabIndex);
}

// SetAttrib() -	Set attribute table information, given
//					a pointer to the correct entry in the table.
void SymbolTable::setAttrib(int tabIndex, semanticType symbol, tokenType token) {

	//	Install semantic type and token class
	attribTable[tabIndex].smType = symbol;
	attribTable[tabIndex].tokClass = token;

	//	Reserved words and operators do not need data types
	if (attribTable[tabIndex].smType == stKeyword || attribTable[tabIndex].smType == stOperator)
		attribTable[tabIndex].dataClass = dtNone;
	else {
		//	Other symbols have not yet had their 
		//	data types determined
		attribTable[tabIndex].dataClass = dtUnknown;
	}

	if (getTokClass(tabIndex) == tokIdentifier && thisProc.proc != -1) {
		//	If no other scope has a variable with this name
		//	connect its listing to other identifiers in
		//	this scope
		if (thisProc.sstart == -1)    {
			thisProc.sstart = tabIndex;
			thisProc.snext = tabIndex;
		}
		//	Otherwise, connect it to the attribute table
		//	entries for this name in outer scopes
		else {
			attribTable[thisProc.snext].scopenext = tabIndex;
			thisProc.snext = tabIndex;
		}
	}
}

// GetTok_Class()	- Returns the token class for the symbol
tokenType	SymbolTable::getTokClass(int tabIndex)	{
	return(attribTable[tabIndex].tokClass);
}

// InstallDataType() -	Install basic data type information, 
//						i.e., the data type and semantic type
void	SymbolTable::installDataType(int tabIndex, semanticType stype, dataType dclass)
{
	attribTable[tabIndex].smType = stype;
	attribTable[tabIndex].dataClass = dclass;
}


// DisplaySymbolTable() -	Prints out the basic symbol table
//						information, including the name and token 
//						class

void SymbolTable::display(void) {
	int i, j;
	char *printString;

	//	symbol table's heading
	cout << "                          SYMBOL TABLE DISPLAY\n";
    cout << "                          --------------------\n\n";
	cout << "                   Token       Symbol     Data";
	cout << "              Owning\n";
	cout << "Index   Name       Class       Type       Type";
	cout << "     Value   Procedure    Label\n";
	cout << "-----   ----       -----       ------     ----";
	cout << "     -----   ---------    -----\n";

	// Printing data for each entry
	for (i = 0; i < attribTabLen; i++) {
		//	Pause every tenth line
		if (i%10 == 9) getchar();

		cout << setw(5) << i << '\t';
		printLexeme(i);

		printString = stringTable + nameTable[attribTable[i].thisname].strstart;
		if (strlen(printString) < 11)
			for (j = 0;  j < 11 - strlen(printString);	j++)
				cout << ' ';
		else
			cout << "\n          ";

		// Print the token class, symbol type and data type
		cout << tokclString[attribTable[i].tokClass] << "  ";
		cout << symTypeString[attribTable[i].smType] << "  ";
		cout << dataTypeString[attribTable[i].dataClass] << "  ";

		//	If the value is real or integer, print the 
		//	value in the correct format.
		if (attribTable[i].value.tag == tint)
			cout << setw(5) << attribTable[i].value.val.ival;
		else
			cout << setprecision(3) << setw(8) 
					<< attribTable[i].value.val.rval;

		//	If there is no procedure that owns the symbol
		//	(which is the case for reserved words, operators,
		//	and literals), print "global."
		if (attribTable[i].owningprocedure == -1)
			cout << "   global";
		//	Otherwise print the name of the owning
		//	procedure in capital letters to make it 
		//	stand out.
		else {
			cout << "   ";
			LexemeInCaps(attribTable[i].owningprocedure);
		}

		//	Print the assembly language label.
		cout << "   " << attribTable[i].label;
		cout << endl; 
	}


}

void SymbolTable::printLexeme(int tabIndex) {
	int j, i;
	char *s;

	i = attribTable[tabIndex].thisname;
	j = nameTable[i].strstart;

	s = stringTable + j;
	cout << s ;
}

// PrintToken() -	Print the token class's name given the token
//                  class.
void SymbolTable::printToken(int i)
{
     cout << tokclString[(int)getTokClass(i)];
}


// LexemeInCaps() -	Print the lexeme in capital letters
//					This makes it more distinctive
void	SymbolTable::LexemeInCaps(int tabindex)
{
	int		i, j;

	//	Get the index within the string table 
	//	where the lexeme starts
	i = attribTable[tabindex].thisname;
	//	Until you encounter the ending null byte,
	//	Print the character in upper case.
	for  (j = nameTable[i].strstart;  stringTable[j] != '\0';  j++)
		cout <<toupper(stringTable[j]);
}


// SetValue() -	Set the value for a real identifier
void SymbolTable::setValue(int tabIndex, float val)
{
     attribTable[tabIndex].value.tag = treal;
     attribTable[tabIndex].value.val.rval = val;  
}

// SetValue() -	Set the value for a Integer identifier
void SymbolTable::setValue(int tabIndex, int val)
{
     attribTable[tabIndex].value.tag = tint;
     attribTable[tabIndex].value.val.ival = val;  
}


bool SymbolTable::isPresent(char string[], int &TabIndex) {
	bool found = false;
	int NameIndex, OldNameIndex, k, code;

	OldNameIndex = 1;

	code = hashCode(string);

	for (NameIndex = hashTable[code]; !found && NameIndex != -1; OldNameIndex = NameIndex, NameIndex = nameTable[NameIndex].nextname) {
		k = nameTable[NameIndex].strstart;
		found = !strcmp(string, stringTable+k);
	}

	if (found)
		NameIndex = OldNameIndex;
	TabIndex = nameTable[NameIndex].symtabptr;
	return(found);
}

void SymbolTable::custum(void) {
	for (int i=0; i<hashTableSize; i++) {
		cout << i << "   Index of    " << hashTable[i] << endl;
	}
}

int SymbolTable::min(int a, int b) {
	return ((a < b) ? a : b);
}

int SymbolTable::OpenScope(int TabIndex) {
	int NewTabIndex, NameIndex;

	NameIndex = attribTable[TabIndex].thisname;

	
}

