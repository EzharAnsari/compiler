#include <cstring>
#include <unordered_map>

#include "../lexer/Scanner.hpp"

class Parser final {
public:
  /// enable explicit constructor
  explicit Parser(std::string fileName);

  /// parse scanner's tokens
  void parse();

  /// parse error info
  void error(int expr, TokenPair *word);

  /// insert items into parse table
  void addToParseTable(const int nonterm, const std::vector<int> &terminals,
                       const std::vector<int> &expand_rule);

  /// get function info
  std::unordered_map<std::string,
                     std::vector<std::pair<std::string, std::string>>>
      &get_func_info() {
    return func_map_;
  }
};