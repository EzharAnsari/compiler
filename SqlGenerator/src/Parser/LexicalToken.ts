import { SyntaxKind } from "../Syntax/SyntaxKind";
import { Diagnostic } from '../Diagnostics/Diagnostic'

export class LexicalToken {
  Kind: SyntaxKind;       // the kind of token.
  Trivia: string;         // for whiteSpace, etc.
  Text: string;           // The text of the token.
  Diagnostic: Array<Diagnostic>          // any diagnostic with the token.
  Length: number

  constructor(kind: SyntaxKind, trivia: string, text: string, diagnostic: Array<Diagnostic> | null = null) {
    this.Kind = kind;
    if(trivia == null) {
      // call logger.show(we are expecting a null value but trivia value should be string for not breaking system, we are set the value of trivia to empty string)
      this.Trivia = "";
    }
    else this.Trivia = trivia;

    if(text == null) {
      // call logger.show(we are expecting a null value but text value should be string for not breaking system, we are set the value of text to empty string)
      this.Text = "";
    }
    else this.Text = text;

    if(diagnostic == null) {
      this.Diagnostic = new Array<Diagnostic>(0) ;
    }
    else this.Diagnostic = diagnostic;

    this.Length = this.Text.length + this.Trivia.length;
  }

}

