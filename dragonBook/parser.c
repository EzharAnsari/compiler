#include "global.h"

int lookahead;

static void expr(void);
static void term(void);
static void factor(void);
static void match(int t);

void parse(void)        /* parses and translates expression list */
{
	lookahead = lexan();
	while (lookahead != DONE) {
		expr(); match(';');
	}
}

static void expr(void)
{
	int t;
	term();
	while(1) {
		switch (lookahead) {
		case '+':
		case '-':
			t = lookahead;
			match(lookahead); term(); emit(t, NONE);
			continue;
		default:
			return;
		}
	}
}

static void term(void)
{
	int t;
	factor();
	while (1) {
		switch (lookahead) {
		case '*':
		case '/':
		case DIV:
		case MOD:
			t = lookahead;
			match(lookahead); factor(); emit(t, NONE);
			continue;
		default:
			return;
		}
	}
}

static void factor(void)
{
	switch (lookahead) {
	case '(':
		match('('); expr(); match(')'); 
		break;
	case NUM:
		emit(NUM, tokenval); match(NUM);
		break;
	case ID:
		emit(ID, tokenval); match(ID);
		break;
	default:
		error("syntax error");
	}
}

static void match(int t)
{
	if (lookahead == t)
		lookahead = lexan();
	else
		error("syntax error");
}