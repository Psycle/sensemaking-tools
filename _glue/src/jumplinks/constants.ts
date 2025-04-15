/**
 * @fileoverview Constants used by the Jumplinks component.
 */

enum CssClasses {
  BUTTON = 'glue-jumplinks__button',
  BUTTON_LEFT = 'glue-jumplinks__button--prev',
  BUTTON_RIGHT = 'glue-jumplinks__button--next',
  BUTTON_ACTIVE = 'glue-jumplinks__button--active',
  LIST = 'glue-jumplinks__list',
  ITEMS = 'glue-jumplinks__list-item',
  LINK = 'glue-jumplinks__link',
  LINK_ACTIVE = 'glue-jumplinks__link--active',
  VIEWPORT = 'glue-jumplinks__viewport',
  REWIND = 'glue-jumplinks--rewind',
  ROOT = 'glue-jumplinks',
}

enum Strings {
  LI_WIDTH = 'liWidth',
  VIEWPORT = 'viewport',
  PAGE_X = 'pageX',
  SLIDES = 'slides',
  ACTIVE_LINK = 'activeLink',
  RTL = 'rtl',
  TRANSFORM = 'transform',
  BLOCK = 'block',
  FIXED = 'fixed',
  JUMPLINK_DEFAULT_LABEL = 'Jump to section within page',
  NOT_FIXED = 'absolute',
  NO_ANIMATION = 'none',
}

enum Numbers {
  DEFAULT_OFFSET = 144,
  JUMPLINKS_MARGIN = 16,
  JUMPLINKS_HEIGHT = 48,
  SCROLL_THRESHOLD = 130,
}

enum DataAttr {
  JUMPLINK_LABEL = 'glueJumplinkLabel',
}

export {CssClasses, DataAttr, Numbers, Strings};
