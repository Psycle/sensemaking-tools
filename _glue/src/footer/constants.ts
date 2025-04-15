/**
 * @fileoverview Constants used in footer component.
 */

enum CssClasses {
  FOOTER_ROOT = 'glue-footer',
  FOOTER_UPPER = 'glue-footer__upper',
  FOOTER_LINK = 'glue-footer__link',
  FOOTER_LOGO = 'glue-footer__logo',
  FOOTER_LOGO_IMG = 'glue-footer__logo-img',
  FOOTER_PANELS = 'glue-footer__site-links',
  FOOTER_PANELS_GROUP = 'glue-footer__site-links-grid',
  FOOTER_PANELS_PANEL = 'glue-footer__site-links-column',
  FOOTER_PANELS_TOGGLE = 'glue-footer__site-links-header',
  FOOTER_PANELS_BUTTON = 'glue-footer__site-links-header-button',
  FOOTER_PANELS_CONTENT = 'glue-footer__site-links-list',
  FOOTER_PANELS_CONTENT_ITEM = 'glue-footer__site-links-list-item',
  FOOTER_PANELS_HEADER_TEXT = 'glue-footer__site-links-header-text',
  FOOTER_GLOBAL = 'glue-footer__global',
  FOOTER_GLOBAL_LINKS = 'glue-footer__global-links',
  FOOTER_GLOBAL_LINKS_EXTRA = 'glue-footer__global-links--extra',
  FOOTER_GLOBAL_LINKS_LIST_ITEM = 'glue-footer__global-links-list-item',
  FOOTER_GLOBAL_LINKS_LIST_ITEM_EXTRA = 'glue-footer__global-links-list-item--extra',
  FOOTER_LANG_DROPDOWN = 'glue-footer__lang-dropdown',
}

enum DataAttr {
  MODEL_NAME = 'footer',
  KEY = 'glueExpansionPanelsKey',
  TOGGLEFOR = 'glueExpansionPanelToggleFor',
}

export {CssClasses, DataAttr};
