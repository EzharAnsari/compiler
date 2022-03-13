import { Diagnostic } from "./Diagnostic";

export class DiagnosticFacts {
  public static GetMissingText(text: string): Diagnostic {
    return new Diagnostic("QLE001", null, null, null, `Missing ${text}`);
  }

  public static GetUnexpectedCharacter(text:string): Diagnostic {
    return new Diagnostic("QLE002", null, null, null, `Unexpected: ${text}`);
  }
}