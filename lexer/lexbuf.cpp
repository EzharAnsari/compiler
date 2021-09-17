#include "lexbuf.hpp"

void lexbuf::refill()
{
  input->read(aux_buffer, refill_size);
  int n = input->gcount();
  if (input->eof())
  {
    aux_buffer[n++] = eof;
  }
  if (lex_buffer_len + n > static_cast<int>(lex_buffer.size()))
  {
    if (lex_buffer_len - lex_start_pos + n <= static_cast<int>(lex_buffer.size()))
    {
      copy(begin(lex_buffer) + lex_start_pos,
           begin(lex_buffer) + lex_buffer_len,
           begin(lex_buffer));
    }
    else
    {
      lex_buffer.resize(lex_buffer.size() + n);
      copy(begin(lex_buffer) + lex_start_pos,
           begin(lex_buffer) + lex_buffer_len,
           begin(lex_buffer));
    }
    int s = lex_start_pos;
    lex_start_pos = 0;
    lex_last_pos -= s;
    lex_curr_pos -= s;
    lex_buffer_len -= s;
  }
}
void lexbuf::close()
{
  if (owns)
  {
    delete input;
  }
}
void lexbuf::set_exceptions()
{
  input->exceptions(std::istream::badbit);
}

// lexer buffer constructor
lexbuf::lexbuf(std::istream *is)
{
  input = is;
  owns = true;
  set_exceptions();
}

void lexbuf::set_input(istream *is)
{
  close();
  input = is;
  owns = true;
  set_exceptions();
}

lexbuf::~lexbuf()
{
  close();
}

char lexbuf::next()
{
  if (lex_curr_pos == lex_buffer_len)
  {
    refill();
  }
  if (lex_buffer[lex_curr_pos] == eof)
    return eof;
  char res = lex_buffer[lex_curr_pos];
  lex_curr_pos++;
  lex_curr_p.cnum++;
  return res;
}

string lexbuf::lexeme() const
{
  return {begin(lex_buffer) + lex_start_pos,
          begin(lex_buffer) + lex_curr_pos};
}

position lexbuf::lexeme_start_p() const
{
  return lex_start_p;
}

position lexbuf::lexeme_end_p() const
{
  return lex_curr_p;
}

void lexbuf::set_start_position()
{
  lex_start_pos = lex_curr_pos;
  lex_start_p = lex_curr_p;
}

void lexbuf::save_position()
{
  lex_last_pos = lex_curr_pos;
  lex_last_p = lex_curr_p;
}

void lexbuf::backup_to_last_position()
{
  lex_curr_pos = lex_last_pos;
  lex_curr_p = lex_last_p;
}

void lexbuf::newline()
{
  lex_curr_p.lnum++;
  lex_curr_p.bol = lex_curr_p.cnum;
}

void lexbuf::print_buffer()
{
  string start;
  string last;
  string current;
  for (int i = 0; i < lex_buffer_len; i++)
  {
    int n = 0;
    char c = lex_buffer[i];
    if (c == '\n')
      n += 2, cout << "\\n";
    else if (c == '\t')
      n += 2, cout << "\\t";
    else if (c == eof)
      n += 3, cout << "eof";
    else
      n++, cout << (c == ' ' ? '_' : c);
    if (i < lex_start_pos)
      start += string(n, ' ');
    if (i < lex_last_pos)
      last += string(n, ' ');
    if (i < lex_curr_pos)
      current += string(n, ' ');
  }
  cout << "\n";
  cout << start << "^ start pos\n";
  cout << last << "^ last pos\n";
  cout << current << "^ current pos\n";
}
