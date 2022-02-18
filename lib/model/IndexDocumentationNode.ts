import { DocumentationNodeBase } from "./DocumentationNodeBase";

/**
 * A documentation node which represents an index file.
 */
export interface IndexDocumentationNode extends DocumentationNodeBase<"index"> {

  /**
   * The template to use for the document.
   */
  readonly template?: string;
}
