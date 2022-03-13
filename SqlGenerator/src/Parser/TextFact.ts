export class TextFact {
  // defaul constructor

  public static IsWhitespace(ch: string): boolean {
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

  public static IsWhitespaceOnly(text: string): boolean;
  //   return IsWhitespaceOnly(text, 0, text.length);
  // }
  public static IsWhitespaceOnly(text: string, start: number, length: number): boolean;

  public static IsWhitespaceOnly(text: string, start?: number, length?: number): boolean {
    if (start && length) {

      for (let i = start, n = Math.min(text.length, start + length); i < n; i++) {
        if (!this.IsWhitespace(text[i]))
          return false;
      }
    }
    else {
      return this.IsWhitespaceOnly(text, 0, text.length);
    }
    return true;
  }

  public static IsLineBreakStart(ch: string): boolean {
    switch (ch) {
      case '\r':      // Carriage Return
      case '\n':      // Line Feed
      case '\u2028':  // Line Separator.
      case '\u2029':  // Paragraph Separator
        return true;

      default:
        return false;
    }
  }

  public static GetNextLineStart(text: string, start: number): number {
    var nextStart = this.GetNextLineBreakStart(text, start);
    return nextStart >= 0 ? nextStart + this.GetLineBreakLength(text, nextStart) : nextStart;
  }

  public static GetNextLineBreakStart(text: string, start: number): number {
    for (let i = start; i < text.length; i++) {
      if (this.IsLineBreakStart(text[i]))
        return i;
    }

    return -1;
  }

  public static GetLineBreakLength(text: string, position: number): number {
    if (position < text.length) {
      var ch = text[position];
      switch (ch) {
        case '\r':
          if (position + 1 < text.length && text[position + 1] == '\n') {
            return 2;
          }
          return 1;
        case '\n':      // Line Feed
        case '\u2028':  // Line Separator.
        case '\u2029':  // Paragraph Separator
          return 1;
      }
    }

    return 0;
  }

  public static IsHexDigit(ch: string): boolean {
    return (ch >= '0' && ch <= '9') || (ch >= 'a' && ch <= 'f') || (ch >= 'A' && ch <= 'F');
  }

}