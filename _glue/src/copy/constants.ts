/**
 * @fileoverview Constants used by the Copy component.
 */

/**
 * Classes that identify sub elements or adjust display of sub elements.
 */
enum CssClasses {
  ROOT = 'glue-copy',
  VALUE = 'glue-copy-value',
  BUTTON = 'glue-copy-button',
  IS_COPIED = 'glue-is-copied',
  POPOVER_ROOT = 'glue-popover',
  SOCIAL_POPOVER_ROOT = 'glue-social__popover',
}

/**
 * List of demos used by demo server.
 */
enum Demos {
  BASE = 'base',
  SOCIAL = 'social',
}

/**
 * Data properties that identify user-provided messages.
 */
enum Message {
  SUCCESS = 'glue-copy-success',
  FAIL = 'glue-copy-fail',
}

/**
 * Various strings used throughout the copy component.
 */
enum Strings {
  /**
   * Error message provided if input element is not found.
   */
  MISSING_INPUT = 'Input element is missing',
  /**
   * Error message provided if copy button element is not found.
   */
  MISSING_COPY_BUTTON = 'Copy button is missing',
  /**
   * Default message shown to users after successful copy operation.
   */
  SUCCESS_MESSAGE = 'Copied to clipboard',
  /**
   * Default message shown to users after failed copy operation.
   */
  FAIL_MESSAGE = 'Press Ctrl+C or ⌘+C to copy',
}

export {CssClasses, Demos, Message, Strings};
