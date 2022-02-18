/**
 * The configuration.
 */
export interface Configuration {

  /**
   * The base path to use as the current working directory.
   */
  readonly basePath?: string;

  /**
   * The set of paths to files to load.
   */
  readonly files?: ReadonlyArray<string>;

  /**
   * The set of available templates.
   */
  readonly templates?: Readonly<Record<string, string>>;

  /**
   * The set of available partials to register.
   */
  readonly partials?: Readonly<Record<string, string>>;
}
