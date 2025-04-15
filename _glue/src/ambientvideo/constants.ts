enum CssClasses {
  ROOT = 'glue-ambient-video',
  BUTTON = 'glue-ambient-video__button',
  BUTTON_PAUSE = 'glue-ambient-video__button--paused',
  BUTTON_ICON = 'glue-ambient-video__icon',
  BUTTON_ICON_PLAY = 'glue-ambient-video__icon-play',
  BUTTON_ICON_PAUSE = 'glue-ambient-video__icon-pause',
  VIDEO_CONTAINER = 'glue-ambient-video__container',
  LIGHT = 'glue-ambient-video--light',
  TOOLTIP = 'glue-ambient-video__tooltip',
  TOOLTIP_PLAY = 'glue-ambient-video__tooltip-play',
  TOOLTIP_PAUSE = 'glue-ambient-video__tooltip-pause',
}

enum ErrorMessage {
  BUTTON_ELEMENT_MISSING = 'Ambient Button element is missing.',
  BUTTON_ICON_ELEMENT_MISSING = 'Ambient Button Icon element is missing',
  MEDIA_ELEMENT_MISSING = 'Ambient Media element is missing.',
  PLAY_VIDEO_ERROR = 'Play video interrupted.',
  TOOLTIP_PLAY_MISSING = 'Ambient Tooltip play element is missing',
  TOOLTIP_PAUSE_MISSING = 'Ambient Tooltip pause element is missing',
}

export {CssClasses, ErrorMessage};
