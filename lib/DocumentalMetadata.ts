/**
 * Documental metadata.
 */
export interface DocumentalMetadata {

  /**
   * The path to the file.
   */
  readonly path: string;

  /**
   * The optional name of the document.
   */
  readonly name?: string;

  /**
   * The template to use.
   */
  readonly template: string;

  /**
   * The additional specified fields.
   */
  readonly fields: Readonly<Record<string, string>>;
}
