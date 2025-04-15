/**
 * @fileoverview Constants used in Tab panels component.
 */

enum CssClasses {
  TABPANEL_CONTAINER = 'glue-tabpanels',
  TABPANEL_CENTERED = 'glue-tabpanels--centeredtabs',
  TABPANEL_ICON = 'glue-tabpanels__heading-icon',
  TABPANEL_PAGE_LIST = 'glue-tabpanels__page-list',
  TABPANEL_PANEL_LIST = 'glue-tabpanels__panel-list',
  TABPANEL_PANEL_TOGGLE = 'glue-tabpanels__panel-toggle',
  TABPANEL_PANEL_BUTTON = 'glue-tabpanels__panel-button',
  TABPANEL_PANEL_TITLE = 'glue-tabpanels__panel-title',
  TABPANEL_PANEL_CONTENT = 'glue-tabpanels__panel-content',
  TABPANEL_ELEMENT_SCOPE = 'glue-tabpanels__scope',
  PANELS_TOGGLE_HEADER = 'glue-expansion-panel__button-header',
  TABSET_ROOT = 'glue-tabs',
  TABSET_TABLIST = 'glue-tabs__tablist',
  TABSET_TAB = 'glue-tab',
  TABSET_BUTTON = 'glue-tabs__button',
  TABSET_PANELCONTAINER = 'glue-tabs__panelgroup',
  TABSET_PAGE = 'glue-tabs__panel',
}

enum DataAttr {
  PANELS_KEY = 'glueExpansionPanelsKey',
  TOGGLEFOR = 'glueExpansionPanelToggleFor',
  INITIAL = 'glueExpansionPanelInitial',
}

enum Strings {
  MISSING_PAGE_LIST = 'No element with glue-tabpanels__page-list class was found. TabPanels requires a Panels Page List',
  MISSING_PANEL_LIST = 'No element with glue-tabpanels__panel-list class was found. TabPanels requires a Panel List',
}

export {CssClasses, DataAttr, Strings};
