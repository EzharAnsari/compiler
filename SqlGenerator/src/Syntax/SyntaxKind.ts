export enum SyntaxKind {
  None = 0,

  // keywords
  AndKeyword,
  AsKeyword,

  BetweenKeyword,

  CountKeyword,

  EndsWithKeyword,

  FromKeyword,

  InKeyword,

  JoinKeyword,

  NotBetweenKeyword,
  NotContainsKeyword,
  NotEndsWithKeyword,
  NotInKeyword,
  NullKeyword,

  OnKeyword,
  OrKeyword,

  SelectKeyword,

  WhereKeyword,

  // scalar type keyword token
  BoolKeyword,
  BooleanKeyword,
  Int8Keyword,
  CharKeyword,
  UInt8Keyword,
  ByteKeyword,
  Int16Keyword,
  UInt16Keyword,
  IntKeyword,
  Int32Keyword,
  UIntKeyword,
  UInt32Keyword,
  LongKeyword,
  Int64Keyword,
  ULongKeyword,
  UInt64Keyword,
  SingleKeyword,
  FloatKeyword,
  RealKeyword,
  DecimalKeyword,
  DoubleKeyword,
  StringKeyword,
  TimeKeyword,
  TimespanKeyword,
  DateKeyword,
  DateTimeKeyword,
  GuidKeyword,
  UniqueIdKeyword,
  DynamicKeyword,

  // punctuation tokens
  OpenParenToken,
  CloseParenToken,
  OpenBracketToken,
  CloseBracketToken,
  OpenBraceToken,
  CloseBraceToken,
  BarToken,
  LessThanBarToken,
  PlusToken,
  MinusToken,
  AsteriskToken,
  SlashToken,
  PercentToken,
  DotToken,
  DotDotToken,
  BangToken,
  LessThanToken,
  LessThanOrEqualToken,
  GreaterThanToken,
  GreaterThanOrEqualToken,
  EqualToken,
  EqualEqualToken,
  BangEqualToken,
  LessThanGreaterThanToken,
  ColonToken,
  SemicolonToken,
  CommaToken,
  EqualTildeToken,
  BangTildeToken,
  AtToken,
  QuestionToken,
  FatArrowToken,

  // literal tokens
  BooleanLiteralToken,
  IntLiteralToken,
  LongLiteralToken,
  RealLiteralToken,
  DecimalLiteralToken,
  DateTimeLiteralToken,
  TimespanLiteralToken,
  GuidLiteralToken,
  StringLiteralToken,

  // other tokens
  IdentifierToken,
  EndOfTextToken,
  BadToken,

  // query operators
  BadQueryOperator,
  CountOperator,
  JoinOperator,
  JoinOnClause,
  JoinWhereClause,

}