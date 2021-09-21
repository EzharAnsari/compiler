#include <stdio.h>      /* load i/o routines */
#include <ctype.h>      /* load character test routines */

#define BSIZE  128		/* buffer size */
#define NONE   -1
#define EOS	   '\0'

#define NUM	   256
#define DIV	   257
#define MOD	   258
#define ID	   259
#define DONE   260

int tokenval;      /* value of token attribute */
int lineno;

struct entry {     /* form of symbol table entry */
	char *lexptr;
	int token;
};

extern struct entry symtable[];


extern int lexan(void);
extern void parse(void);
extern void emit(int t, int tval);
extern int lookup(char s[]);
extern int insert(char s[], int tok);
extern void init(void);
extern void error(char *m);