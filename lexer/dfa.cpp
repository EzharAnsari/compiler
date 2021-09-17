#include "dfa.hpp"
int dfa::transition(int s, char c)
{
  return transitions[s][char_to_index[static_cast<int>(c)]];
}

bool dfa::is_accepting(int s)
{
  return accepting[s];
}

bool dfa::ignore(int s)
{
  return state_to_token.count(s) == 0;
}

token dfa::get_token(int s, const string &lexeme,
                const position &lexeme_start, const position &lexeme_end)
{
  token token = state_to_token[s];
  token.start = lexeme_start;
  token.end = lexeme_end;
  switch (token.kind)
  {
    case kind::integer:
      token.attribute = stoi(lexeme);
      break;
    case kind::eof:
      token.attribute = "eof";
      break;
    case kind::identifier:
    case kind::let:
    case kind::letrec:
      token.attribute = lexeme;
      break;

    // there are many tokens are yet to initialize
  }
  return token;
}