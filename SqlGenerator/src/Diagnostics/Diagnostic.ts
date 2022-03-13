export class Diagnostic {
  Code: string;
  Category: string;
  Severity: string;
  Description: string;
  Message: string;
  Start: number;
  Length: number;

  public constructor(
    code: string,
    category: string | null = null,
    severity: string | null = null,
    description: string | null = null,
    message: string | null = null,
    start: number = 0,
    length: number = 0)
    {
      this.Code = code === null ? "" : code;
      this.Category = category === null ? "General" : code;
      this.Severity = severity === null ? "Error" : code;
      this.Description = description === null ? (message === null ? "" : message) : description;
      this.Message = message === null ? (description == null ? "" : description) : message;
      this.Start = start >= 0 ? start : 0;
      this.Length = length >= 0 ? length : 0;
    }
}