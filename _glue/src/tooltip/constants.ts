enum CssClasses {
  ROOT = 'glue-tooltip',
  ANIMATION = 'glue-tooltip__content--animation',
  BODY = 'glue-tooltip__body',
  CONTENT = 'glue-tooltip__content',
  HEADER = 'glue-tooltip__header',
  LINK = 'glue-tooltip__link',
  RICH = 'glue-tooltip--rich',
  SHOW_TOOLTIP = 'glue-tooltip__content--shown',
  TRIGGER = 'glue-tooltip__trigger',
  TRIGGER_LINK = 'glue-tooltip__trigger--link',
  TRIGGER_ICON = 'glue-tooltip__trigger--icon',
  TRIGGER_ICONAFTER = 'glue-tooltip__trigger--icon-after',
  TONAL_LINK = 'glue-inline-tonal-link',
}

/**
 * Custom tooltip events
 */
enum CustomEvent {
  CLOSE_EVENT = 'gluetooltipclose',
  SHOW_EVENT = 'gluetooltipshow',
}

enum ErrorMessage {
  MISSING_CONTENT = 'The tooltip content element is missing',
  MISSING_TRIGGER = 'The tooltip trigger element is missing',
  INCORRECT_POSITION = 'data-glue-tooltip-auto-position attribute only accepts true or false value.',
}

enum DataAttrs {
  AUTO_POSITION = 'glueTooltipAutoPosition',
}

export {CssClasses, CustomEvent, DataAttrs, ErrorMessage};
