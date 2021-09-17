#include <iostream>
#include <fstream>
#include <vector>
#include <variant>

#ifndef LEXBUF_H
#define LEXBUF_H

struct position
{
  int lnum = 0;
  int cnum = 0;
  int bol = 0;
};

enum class kind {
  let, integer, identifier, eof,  // there are many lefts
};

struct token {
  enum kind kind;
  std::variant<string, int> attribute;
  position start;
  position end;
};

class lexbuf
{
private:
  static constexpr char eof = 128;
  int lex_start_pos = 0;
  int lex_last_pos = 0;
  int lex_curr_pos = 0;
  int lex_buffer_len = 0;
  position lex_start_p;
  position lex_last_p;
  position lex_curr_p;
  std::istream *input;
  bool owns;
  std::vector<char> lex_buffer;
  static constexpr int refill_size = 8;
  char aux_buffer[refill_size];

  void refill();
  void close();
  void set_exceptions();
public:
  lexbuf(std::istream *is);
  void set_input(std::istream *is);
  ~lexbuf();
  char next();
  std::string lexeme();
  position lexeme_start_p();
  position lexeme_end_p();
  void set_start_position();
  void save_position();
  void backup_to_last_position();
  void newline();
  void print_buffer();
};

#endif