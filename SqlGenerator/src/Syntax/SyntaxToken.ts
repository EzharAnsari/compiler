import { basename } from "path"
import { Diagnostic } from "../Diagnostics/Diagnostic"

/**A single token in the syntax grammar */
export abstract class SyntaxToken {
    // protected constructor(Array<Diagnostic> diagnostic) {
        
    // }

    public Trivia(): string {
        return '';
    }

    public Text(): string {
        return "";
    }


} 