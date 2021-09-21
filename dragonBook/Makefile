FINAL = compiler
SRCS = lexer.c parser.c emitter.c symbol.c init.c error.c main.c
OBJS = $(SRCS:.c=.o)
CC = gcc
RM = del

%.o: %.c
	$(CC) -c -o $@ -g $<

$(FINAL): $(OBJS)
	$(CC) -o $@ $(OBJS)

clean:
	-$(RM) $(FINAL) $(OBJS)