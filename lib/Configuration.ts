/**
 * The configuration.
 */
export interface Configuration {

  /**
   * The set of paths to files to load.
   */
  readonly files?: ReadonlyArray<string>;

  /**
   * The set of available templates.
   */
  readonly templates?: Readonly<Record<string, string>>;
}
