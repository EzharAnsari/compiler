import { SyntaxKind } from "../Syntax/SyntaxKind";
import { LexicalToken } from "./LexicalToken"
import { TextFact } from "./TextFact";
import { DiagnosticFacts } from "../Diagnostics/DiagnosticFacts";

// import {qlogs, Qlogs} //
// 
//  qeu = "t "
// qlogs.parse()
// Qlogs.sqloCon
// 
// 

export class TokenParser {
  // String table


  // private constructor() {
  // }

  public ParseTokens(text: string, alwaysProduceEndToken: boolean = false): LexicalToken[] {
    let tokens = new Array<LexicalToken>();
    this.ParseToken(text, tokens, alwaysProduceEndToken);
    return tokens;
  }

  public ParseToken(text: string, tokens: Array<LexicalToken>, alwaysProduceEndToken: boolean = false): void {
    let pos: number = 0;
    let token: LexicalToken | null;
    do {
      token = this.Parse(text, pos, alwaysProduceEndToken);
      // Console.WriteLine(token.Text);
      if (token == null)
        break;
      tokens.push(token);
      pos += token.Length;
    }
    while (token.Kind != SyntaxKind.EndOfTextToken);
  }

  private Parse(text: string, start: number, alwaysProduceEndToken: boolean): LexicalToken | null {
    let tok: LexicalToken | null;

    let pos = start;
    let trivia = this.ParseTrivia(text, pos);
    pos += trivia.length;

    let ch = this.Peek(text, pos);
    let ch2: string;
    if (!this.IsDigit(ch) && !this.IsLetter(ch)) {
      let info = this.GetPunctuationTokenInfo(text, pos);
      if (info != null) {
        return info.GetToken(trivia);
      }

      switch (ch) {
        case '\'':
        case '"':
        case '`':
          tok = this.ParseStringLiteral(text, pos, trivia);
          if (tok != null)
            return tok;
          break;
        case '@':
          ch2 = this.Peek(text, pos + 1);
          if (ch2 === '\'' || ch2 === '"' || ch2 == '`') {
            tok = this.ParseStringLiteral(text, pos, trivia);
            if (tok != null)
              return tok;
          }
          break;
        case '\0':
          if (trivia.length > 0 || alwaysProduceEndToken)
            return new LexicalToken(SyntaxKind.EndOfTextToken, trivia, "");
          return null;
      }

    }

    if (this.IsIdentifierStartChar(ch)) {
      let len = this.ScanIdentifier(text, pos);
      return new LexicalToken(SyntaxKind.IdentifierToken, trivia, this.GetSubstring(text, pos, len));
    }

    else if (this.IsDigit(ch)) {
      let realLen = this.ScanRealLiteral(text, pos);
      if (realLen >= 0)
        return new LexicalToken(SyntaxKind.RealLiteralToken, trivia, this.GetSubstring(text, pos, realLen));
      // let timeLen = this.ScanTimespanLiteral(text, pos);

    }
    let subtext = this.GetSubstring(text, pos, 1);
    return new LexicalToken(SyntaxKind.BadToken, trivia, subtext,  [ DiagnosticFacts.GetUnexpectedCharacter(subtext) ]);
  }

  private ScanTimespanLiteral(text: string, start: number): number {
    let pos = start;
    let numberLen = this.ScanDigits(text, pos);
    if (numberLen <= 0)
      return -1;
    pos += numberLen;
    if (this.Peek(text, pos) === '.') {
      pos++;
      let fractionLen = this.ScanDigits(text, pos);
      if (fractionLen >= 0) {
        pos += fractionLen;
      }
    }
    // let suffixMatch = this.TimespanSuffixs

    return pos > start ? pos - start : -1;
  }

  private readonly TimespanSuffixs: string[] = [
    "m", "min", "minute", "minutes",
    "s", "sec", "second", "seconds",
    "d", "day", "days",
    "h", "hr", "hrs", "hour", "hours",
    "ms", "milli", "millis", "millisec", "millisecond", "milliseconds",
    "micro", "micros", "microsec", "microsecond", "microseconds",
    "nano", "nanos", "nanosec", "nanosecond", "nanoseconds",
    "tick", "ticks"
  ]

  private ScanRealLiteral(text: string, start: number): number {
    let pos = start;
    let digitLen = this.ScanDigits(text, pos);
    if (digitLen > 0)
      pos = start + digitLen;
    if (this.Peek(text, pos) === '.' && (this.Peek(text, pos + 1) != '.' || this.Peek(text, pos + 2) == '.')) {
      pos++;
      let fractionLen = this.ScanDigits(text, pos);
      if (fractionLen > 0)
        pos += fractionLen;

      let expLen = this.ScanExponent(text, pos)
      if (expLen > 0)
        pos += expLen;
    }
    else {
      let expLen = this.ScanExponent(text, pos);
      if (expLen <= 0) {
        return -1;
      }
      pos += expLen;
    }

    if (this.IsIdentifierChar(this.Peek(text, pos)))
      return -1;
    return pos > start ? pos - start : -1;

  }

  private ScanExponent(text: string, start: number): number {
    let pos = start;
    let expCh = this.Peek(text, pos);
    if (expCh === 'e' || expCh === 'E') {
      pos++;
      let signCh = this.Peek(text, pos);
      if (signCh === '+' || signCh === '-')
        pos++;
      let exponentLen = this.ScanDigits(text, pos);
      if (exponentLen <= 0)
        return -1;
      pos += exponentLen;
    }
    return pos > start ? pos - start : -1;
  }

  public ScanIdentifier(text: string, start: number = 0): number {
    let pos = start;

    let ch = this.Peek(text, pos);
    if (this.IsIdentifierStartChar(ch)) {
      pos++;

      while ((ch = this.Peek(text, pos)) != '\0') {
        if (this.IsIdentifierChar(ch)) {
          pos++;
        }
        else {
          break;
        }
      }
    }
    else if (this.IsDigit(ch)) {
      let len = this.ScanDigits(text, pos);
      if (len > 0) {
        // must have at least one one letter or _ after digits
        ch = this.Peek(text, pos + len);
        if (this.IsLetter(ch) || ch == '_') {
          pos += len;

          while (pos < text.length) {
            ch = text[pos];
            if (this.IsIdentifierChar(ch)) {
              pos++;
            }
            else {
              break;
            }
          }
        }
      }
    }

    return pos > start ? pos - start : -1;
  }

  private IsIdentifierChar(ch: string): boolean {
    return this.IsLetter(ch) || this.IsDigit(ch) || ch == '_';
  }

  private ScanDigits(text: string, start: number): number {
    let pos = start;

    while (this.IsDigit(this.Peek(text, pos))) {
      pos++;
    }

    return pos > start ? pos - start : -1;
  }

  private IsIdentifierStartChar(ch: string): boolean {
    return this.IsLetter(ch) || ch == '_';
  }

  public IsLetter(ch: string): boolean {
    return /^[A-Za-z]/.test(ch);
  }
  public IsDigit(ch: string): boolean {
    return /^[0-9]/.test(ch);
  }

  public ParseTrivia(text: string, start: number): string {
    // first check for spaces only
    let len = this.ScanSpaces(text, start);
    let pos = start + len;

    // if next is something that should also be trivia, then use more extensive scan
    let ch = this.Peek(text, pos);
    if (TextFact.IsWhitespace(ch)) {
      // scan additional whitespace
      let wsLen = this.ScanWhitespace(text, pos);
      pos += wsLen;

      ch = this.Peek(text, pos);
      if (ch == '/' && this.Peek(text, pos + 1) == '/') {
        let tlen = this.ScanTrivia(text, pos);

        return this.GetSubstring(text, start, len + wsLen + tlen, false);
      }
      else {
        return this.GetSubstring(text, start, len + wsLen);
      }
    }
    else if (ch == '/' && this.Peek(text, pos + 1) == '/') {
      let tlen = this.ScanTrivia(text, pos);

      return this.GetSubstring(text, start, len + tlen, false);
    }
    else if (len == 0) {
      return "";
    }
    else if (len == 1) {
      return " ";
    }
    else {
      return this.GetSubstring(text, start, len);
    }

  }

  private ScanSpaces(text: string, start: number): number {
    let pos = start;
    while (this.Peek(text, pos) == ' ') {
      pos++;
    }
    return pos - start;
  }

  private Peek(text: string, position: number): string {
    if (position < text.length) {
      return text[position];
    }
    else
      return '\0';
  }

  public IsWhitespace(ch: string): boolean {
    switch (ch) {
      case '\t':     // tab
      case ' ':      // space
      case '\r':     // carriage return
      case '\n':     // line feed
      case '\u000c': // form feed
      case '\u00a0': // no break space
      case '\u1680': // ogham space mark
      case '\u180e': // mongolian vowel separator
      case '\u2000': // en quad
      case '\u2001': // em quad
      case '\u2002': // en space
      case '\u2003': // em space
      case '\u2004': // three-per-em space
      case '\u2005': // four-per-em space
      case '\u2006': // six-per-em space
      case '\u2007': // figure space
      case '\u2008': // punctuation space
      case '\u2009': // thin space
      case '\u200a': // hair space
      case '\u200b': // zero width space
      case '\u202f': // narrow no break space
      case '\u205f': // medium mathematical space
      case '\u3000': // ideograph space
      case '\uFEFF': // byte order mark
        return true;
      default:
        return false;
    }
  }

  private ScanWhitespace(text: string, start: number): number {
    let pos = start;

    while (TextFact.IsWhitespace(this.Peek(text, pos))) {
      pos++;
    }

    return pos - start;
  }

  public ScanTrivia(text: string, start: number): number {
    let pos = start;
    let ch: string;

    while ((ch = this.Peek(text, pos)) != '\0') {
      if (TextFact.IsWhitespace(ch)) {
        pos++;
        continue;
      }

      var commentLen = this.ScanComment(text, pos);
      if (commentLen > 0) {
        pos += commentLen;
        continue;
      }
      else {
        break;
      }
    }

    return pos - start;
  }

  public ScanComment(text: string, start: number): number {
    if (this.Peek(text, start) == '/'
      && this.Peek(text, start + 1) == '/') {
      var end = this.GetNextLineStart(text, start);
      return end - start;
    }

    return 0;
  }

  private GetNextLineStart(text: string, start: number): number {
    var end = TextFact.GetNextLineStart(text, start);
    return end >= 0 ? end : text.length;
  }

  private GetSubstring(text: string, start: number, len: number, intern: boolean = true): string {
    return text.substring(start, start + len);
  }

  public GetPunctuationTokenInfo(text: string, start: number): TokenInfo | null {
    let pos = start;
    let ch = this.Peek(text, pos);
    let ch2;

    switch (ch) {
      case '(':
        return OpenParenTokenInfo;
      case ')':
        return CloseParenTokenInfo;
      case '[':
        return OpenBracketTokenInfo;
      case ']':
        return CloseBracketTokenInfo;
      case '{':
        return OpenBraceTokenInfo;
      case '}':
        return CloseBraceTokenInfo;
      case '.':
        if (this.Peek(text, pos + 1) == '.')
          return DotDotTokenInfo;
        return DotTokenInfo;
      case '+':
        return PlusTokenInfo;
      case '-':
        return MinusTokenInfo;
      case '*':
        return AsteriskTokenInfo;
      case '/':
        return SlashTokenInfo;
      case '%':
        return PercentTokenInfo;
      case '<':
        ch2 = this.Peek(text, pos + 1);
        if (ch2 == '=')
          return LessThanOrEqualTokenInfo;
        else if (ch2 == '>')
          return LessThanGreaterThanTokenInfo;
        return LessThanTokenInfo;
      case '>':
        if (this.Peek(text, pos + 1) == '=')
          return GreaterThanOrEqualTokenInfo;
        return GreaterThanTokenInfo;
      case '=':
        ch2 = this.Peek(text, pos + 1);
        if (ch2 == '=')
          return EqualEqualTokenInfo;
        else if (ch2 == '>')
          return FatArrowTokenInfo;
        else if (ch2 == '~')
          return EqualTildeTokenInfo;
        return EqualTokenInfo;
      case '!':
        ch2 = this.Peek(text, pos + 1);
        if (ch2 == '=')
          return BangEqualTokenInfo;
        else if (ch2 == '~')
          return BangTildeTokenInfo;
        break;
      case ':':
        return ColonTokenInfo;
      case ';':
        return SemicolonTokenInfo;
      case ',':
        return CommaTokenInfo;
      case '@':
        ch2 = this.Peek(text, pos + 1);
        if (ch2 != '\'' && ch2 != '"' && ch2 != '`') {
          return AtTokenInfo;
        }
        break;
      case '?':
        return QuestionTokenInfo;
    }

    return null;
  }

  private ParseStringLiteral(text: string, start: number, trivia: string): LexicalToken | null {
    let len = this.ScanStringLiteral(text, start);
    if (len > 0) {
      let endQuote = this.GetStringLiteralQuote(text, start);
      return this.EndCheckedToken(start, SyntaxKind.StringLiteralToken, trivia, this.GetSubstring(text, start, len), endQuote);
    }
    return null;
  }

  private GetStringLiteralQuote(text: string, start: number): string | null {
    let pos = start;

    let ch = this.Peek(text, pos);
    if (ch == 'h' || ch == 'H') {
      pos++;
      ch = this.Peek(text, pos);
    }

    if (ch == '@') {
      pos++;
      ch = this.Peek(text, pos);
    }

    if (ch == '\'') {
      return "'";
    }
    else if (ch == '"') {
      return "\"";
    }
    else if (ch == '`') {
      return "```";
    }
    else {
      return null;
    }
  }

  public ScanStringLiteral(text: string, start: number = 0): number {
    let pos = start;

    let ch = this.Peek(text, pos);
    if (ch === 'h' || ch === 'H') {
      pos++;
      ch = this.Peek(text, pos);
    }

    let isVerbatim = false;
    if (ch == '@') {
      isVerbatim = true;
      pos++;
      ch = this.Peek(text, pos);
    }

    if (ch == '\'' || ch == '"') {
      pos++;

      var contentLength = this.ScanStringLiteralContent(text, pos, ch, isVerbatim);
      pos += contentLength;

      if (this.Peek(text, pos) == ch) {
        pos++;
      }
    }
    else if (ch === '`' && this.Peek(text, pos + 1) === '`' && this.Peek(text, pos + 2) === '`') {
      pos += 3;

      while (pos < text.length &&
        !(text[pos] === '`' && this.Peek(text, pos + 1) === '`' && this.Peek(text, pos + 2) === '`')) {
        pos++;
      }

      // end ```
      if (this.Peek(text, pos) === '`')
        pos++;
      if (this.Peek(text, pos) === '`')
        pos++;
      if (this.Peek(text, pos) === '`')
        pos++;
    }
    else {
      return -1;
    }

    return pos > start ? pos - start : -1;
  }

  private ScanStringLiteralContent(text: string, start: number, quote: string, isVerbatim: boolean): number {
    let pos = start;

    let ch;
    while ((ch = this.Peek(text, pos)) != '\0') {
      if (ch == quote && isVerbatim && this.Peek(text, pos + 1) == quote) {
        pos += 2;
        continue;
      }
      else if (ch == '\\' && !isVerbatim) {
        var escapeLen = this.ScanStringEscape(text, pos);
        if (escapeLen > 0) {
          pos += escapeLen;
          continue;
        }
        else {
          break;
        }
      }
      else if (ch == quote
        || ch == '\r'
        || ch == '\n') {
        break;
      }
      else {
        pos++;
      }
    }

    return pos - start;
  }

  private ScanStringEscape(text: string, start: number): number {
    var ch = this.Peek(text, start);
    if (ch == '\\') {
      ch = this.Peek(text, start + 1);
      switch (ch) {
        case '\\':
        case '\'':
        case '"':
        case 'a':
        case 'b':
        case 'f':
        case 'n':
        case 'r':
        case 't':
        case 'v':
          return 2;
        case 'u':
          var len = this.ScanFourHexDigits(text, start + 2);
          if (len > 0)
            return len + 2;
          return -1;
        case 'U':
          len = this.ScanEightHexDigits(text, start + 2);
          if (len > 0)
            return len + 2;
          return -1;
        case 'x':
          len = this.ScanTwoHexDigits(text, start + 2);
          if (len > 0)
            return len + 2;
          return -1;
        default:
          len = this.ScanOctalCode(text, start + 1);
          if (len > 0)
            return len + 1;
          break;
      }
    }

    // not an escape
    return -1;
  }

  private ScanTwoHexDigits(text: string, start: number): number {
    if (start < text.length + 2
      && TextFact.IsHexDigit(text[start])
      && TextFact.IsHexDigit(text[start + 1])) {
      return 2;
    }
    else {
      return -1;
    }
  }

  private ScanFourHexDigits(text: string, start: number): number {
    if (start < text.length + 2
      && TextFact.IsHexDigit(text[start])
      && TextFact.IsHexDigit(text[start + 1])
      && TextFact.IsHexDigit(text[start + 2])
      && TextFact.IsHexDigit(text[start + 3])) {
      return 4;
    }
    else {
      return -1;
    }
  }

  private ScanEightHexDigits(text: string, start: number): number {
    if (start < text.length + 2
      && TextFact.IsHexDigit(text[start])
      && TextFact.IsHexDigit(text[start + 1])
      && TextFact.IsHexDigit(text[start + 2])
      && TextFact.IsHexDigit(text[start + 3])
      && TextFact.IsHexDigit(text[start + 4])
      && TextFact.IsHexDigit(text[start + 5])
      && TextFact.IsHexDigit(text[start + 6])
      && TextFact.IsHexDigit(text[start + 7])) {
      return 8;
    }
    else {
      return -1;
    }
  }

  private ScanOctalCode(text: string, start: number): number {
    let ch1 = this.Peek(text, start);
    if (ch1 >= '0' && ch1 <= '7') {
      let ch2 = this.Peek(text, start + 1);
      if (ch2 >= '0' && ch2 <= '7') {
        let ch3 = this.Peek(text, start + 2);
        if (ch3 >= '0' && ch3 <= '7' && ch1 <= '3') {
          return 3;
        }
        else {
          return 2;
        }
      }
      else {
        return 1;
      }
    }
    else {
      return -1;
    }

  }

  private EndCheckedToken(start: number, kind: SyntaxKind, trivia: string, text: string, expectedEndChars: string | null): LexicalToken {
    // validate the expected last character is correct
    // We know expectedEndChars doesn't get null value
    expectedEndChars = expectedEndChars === null ? "" : expectedEndChars;
    let dx = text.endsWith(expectedEndChars)
      ? null
      : [DiagnosticFacts.GetMissingText(expectedEndChars)];

    return new LexicalToken(kind, trivia, text, dx);
  }

}

export class TokenInfo {
  public readonly Kind: SyntaxKind;
  public readonly Text: string;
  public readonly ZeroTriviaToken: LexicalToken;
  public readonly SingleWhitespaceToken: LexicalToken;

  constructor(kind: SyntaxKind, text: string) {
    this.Kind = kind;
    this.Text = text;
    this.ZeroTriviaToken = new LexicalToken(kind, "", this.Text);
    this.SingleWhitespaceToken = new LexicalToken(kind, " ", this.Text);
  }

  GetToken(trivia: string): LexicalToken {
    if (trivia.length == 0)
      return this.ZeroTriviaToken;
    else if (trivia === " ")
      return this.SingleWhitespaceToken;
    else
      return new LexicalToken(this.Kind, trivia, this.Text);
  }
}

const OpenParenTokenInfo = new TokenInfo(SyntaxKind.OpenParenToken, '(');

const CloseParenTokenInfo = new TokenInfo(SyntaxKind.CloseParenToken, ')');

const OpenBracketTokenInfo = new TokenInfo(SyntaxKind.OpenBracketToken, '[');

const CloseBracketTokenInfo = new TokenInfo(SyntaxKind.CloseBracketToken, ']');

const OpenBraceTokenInfo = new TokenInfo(SyntaxKind.OpenBraceToken, '{');

const CloseBraceTokenInfo = new TokenInfo(SyntaxKind.CloseBraceToken, '}');

const DotDotTokenInfo = new TokenInfo(SyntaxKind.DotDotToken, '..');

const DotTokenInfo = new TokenInfo(SyntaxKind.DotToken, '.');

const PlusTokenInfo = new TokenInfo(SyntaxKind.PlusToken, '+');

const MinusTokenInfo = new TokenInfo(SyntaxKind.MinusToken, '-');

const AsteriskTokenInfo = new TokenInfo(SyntaxKind.AsteriskToken, '*');

const SlashTokenInfo = new TokenInfo(SyntaxKind.SlashToken, '/');

const PercentTokenInfo = new TokenInfo(SyntaxKind.PercentToken, '%');

const LessThanOrEqualTokenInfo = new TokenInfo(SyntaxKind.LessThanOrEqualToken, '<=');

const LessThanGreaterThanTokenInfo = new TokenInfo(SyntaxKind.LessThanGreaterThanToken, '<>');

const LessThanTokenInfo = new TokenInfo(SyntaxKind.LessThanToken, '<');

const GreaterThanOrEqualTokenInfo = new TokenInfo(SyntaxKind.GreaterThanOrEqualToken, '>=');

const GreaterThanTokenInfo = new TokenInfo(SyntaxKind.GreaterThanToken, '>');

const EqualEqualTokenInfo = new TokenInfo(SyntaxKind.EqualEqualToken, '==');

const FatArrowTokenInfo = new TokenInfo(SyntaxKind.FatArrowToken, '=>');

const EqualTildeTokenInfo = new TokenInfo(SyntaxKind.EqualTildeToken, '=~');

const EqualTokenInfo = new TokenInfo(SyntaxKind.EqualToken, '=');

const BangEqualTokenInfo = new TokenInfo(SyntaxKind.BangEqualToken, '!=');

const BangTildeTokenInfo = new TokenInfo(SyntaxKind.BangTildeToken, '!~');

const ColonTokenInfo = new TokenInfo(SyntaxKind.ColonToken, ':');

const SemicolonTokenInfo = new TokenInfo(SyntaxKind.SemicolonToken, ';');

const CommaTokenInfo = new TokenInfo(SyntaxKind.CommaToken, ',');

const AtTokenInfo = new TokenInfo(SyntaxKind.AtToken, '@');

const QuestionTokenInfo = new TokenInfo(SyntaxKind.QuestionToken, '?');
