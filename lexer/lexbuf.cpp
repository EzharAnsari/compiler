#include "lexbuf.hpp"

// lexer buffer constructor
lexbuf::lexbuf(std::istream *is) {

}

void lexbuf::refill() {
  input->read(aux_buffer, refill_size);
  int n = input->gcount();
  if (input->eof()) {
    aux_buffer[n++] = eof;
  }
  if(lex_buffer_len + n > static_cast<int>(lex_buffer.size())) {
    
  }
}