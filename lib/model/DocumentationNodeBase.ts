/**
 * The base interface for all documentation nodes.
 */
 export interface DocumentationNodeBase<T extends string> {

  /**
   * The documentation node type.
   */
  readonly type: T;

  /**
   * The path that represents the documentation node.
   */
  readonly path: string;

  /**
   * The set of custom data entries.
   */
  readonly data: Readonly<Record<string, string>>;

  /**
   * The set of documentation exports in this node.
   */
  readonly exports: ReadonlyMap<string, Readonly<Record<string, string>>>;
}
