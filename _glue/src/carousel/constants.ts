/**
 * @fileoverview Constants used by the Carousel component.
 */

enum CssClasses {
  ACTIVE = 'glue-is-active',
  BUTTON = 'glue-carousel__button',
  BUTTON_NEXT = 'glue-carousel__button--next',
  BUTTON_PREV = 'glue-carousel__button--prev',
  CARDS = 'glue-carousel--cards',
  CAROUSEL = 'glue-carousel',
  DISABLE_GRAB = 'glue-carousel__list--disable-grab',
  HAS_NAVIGATION = 'glue-carousel--has-navigation',
  INACTIVE = 'glue-is-inactive',
  ITEM = 'glue-carousel__item',
  LIST = 'glue-carousel__list',
  MODALS = 'glue-carousel__modals',
  NAVIGATION = 'glue-carousel__navigation',
  NAVIGATION_DOT = 'glue-carousel__dot',
  PEEK_OUT = 'glue-carousel--peek-out',
  VIEWPORT = 'glue-carousel__viewport',
}

enum Icons {
  CHEVRON_RIGHT = 'chevron-right',
  CHEVRON_LEFT = 'chevron-left',
}

enum Numbers {
  /**
   * A threshold value that corresponds to the Carousel viewport width.
   * It is factor, a value between 0 to 1.
   * E.g. drag threshold is 0.2 * containerWidth.
   */
  DRAG_THRESHOLD = 0.2,
  /**
   * The minimum distance that the user needs to move before the carousel
   * recognizes the gesture as a drag (rather than a click, etc).
   */
  DRAGSTART_THRESHOLD_PX = 10,
  /**
   * Distance in pixels for the card carousel to peek out on small viewport
   */
  PEEK_DISTANCE = 24,
  /**
   * When determining the number of slides per page, if the resulting value is
   * within this range from an integer, round up, otherwise round down.
   * E.g. 1.9999962591720426 => 2
   */
  ROUNDING_THRESHOLD = 0.05,
}

enum Strings {
  DATA_CAROUSEL_ANIMATION_ATTR = 'data-glue-carousel-animation',
  DATA_CAROUSEL_NAVIGATION_LABEL_ATTR = 'data-glue-carousel-navigation-label',
  DATA_DOT = 'dot',
  DATA_NAVIGATION_LABEL = 'glueCarouselNavigationLabel',
  NAVIGATION_ARIA_LABEL_DEFAULT = 'Choose slide to display',
  NAVIGATION_LABEL_DEFAULT = 'Selected tab $glue_carousel_page_number$ of $glue_carousel_page_total$',
  NAVIGATION_LABEL_NUMBER_VAR_NAME = '$glue_carousel_page_number$',
  NAVIGATION_LABEL_TOTAL_VAR_NAME = '$glue_carousel_page_total$',
  NAVIGATION_NEXT_LABEL_DEFAULT = 'Go to the next slide',
  NAVIGATION_PREV_LABEL_DEFAULT = 'Go to the previous slide',
  RTL = 'rtl',
  SLIDE_CHANGE = 'gluecarouselslidechange',
  TRANSITION_NONE = 'none',
}

enum CarouselType {
  CARDS = 'cards',
  IMAGE = 'image',
  CUSTOM = 'custom',
}

export {CarouselType, CssClasses, Icons, Numbers, Strings};
