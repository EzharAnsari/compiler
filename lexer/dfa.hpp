#include "lexbuf.hpp"

#ifndef DFA_H
#define DFA_H

struct dfa
{
  int state;
  static constexpr state initial_state = 0;
  static constexpr state sink_state = 15;
  private:
    vector<int> char_to_index{21, 21, 21, 21, 21, 21, 21, 21, 21, 18, 19, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 17, 21, 21, 21, 21, 21, 21, 21, 21, 21, 16, 21, 21, 21, 21, 15, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 4, 21, 1, 21, 21, 21, 21, 21, 21, 0, 21, 21, 21, 21, 21, 3, 21, 2, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 20};
    vector<vector<state>> transitions
    {
      // a  b  c  d  e  f  g  h  i  j  k  l  m  n  o  p  q  r  s  t  u  v  w  x  y  z  A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z  0  1  2  3  4  5  6  7  8  9  _  +  -  *  /  =  \b  \n  \f  \r  \t  \v  ~  <  =  (  )  {  }  ;  :  .  ,  @  "  '  <  >  EOf

    };
    vector<bool> accepting{};
    map<state, token> state_to_token
    {
      {6,  {kind::integer}},
      {7,  {kind::identifier}},
      {8,  {kind::identifier}},
      {9,  {kind::let}},
      {10, {kind::identifier}},
      {11, {kind::identifier}},
      {12, {kind::letrec}},
      {13, {kind::identifier}},
      {14, {kind::eof}},
    };
  public:
    int transition(int s, char c);
    bool is_accepting(int s);
    bool ignore(int s)

};

/*
  
*/


#endif