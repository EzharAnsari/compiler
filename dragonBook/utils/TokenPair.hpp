#include "Symbol.hpp"
class TokenPair {
 private:
  Symbol tokenType;
  std::string tokenString;

 public:
  TokenPair(int tokenType, std::string tokenString) {
    this->tokenType = tokenType;
    this->tokenString = tokenString;
  }

  Symbol getTokenType() { return tokenType; }

  std::string getTokenString() { return tokenString; }

  std::string emit() {
    return std::string("<" + std::to_string(tokenType.getValue()) + ", \"" +
                       tokenString + "\">");
  }
};