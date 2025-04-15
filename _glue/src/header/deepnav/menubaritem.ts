import {Component} from '../../base';
import {Attribute, Role} from '../../constants/attribute';
import {EventType} from '../../events/eventtype';
import {Key} from '../../events/key';
import {PopupMenu} from '../popupmenu';
import {Menu, MenuController} from '../popupmenu/constants';

/**
 * This class creates a menu item instance, which may control a dropdown menu.
 */
class MenubarItem extends Component implements MenuController {
  /** A popup menu component, controlled by the menu item. */
  popupMenu: PopupMenu | null = null;

  /** A flag to show menu bar item's focus status. */
  hasFocus: boolean = false;

  /** A flag to show menu bar item's hover status. */
  hasHover: boolean = false;

  /**
   * This flag is used to determine if this controller is a menu bar item.
   * This flag is set to false in other controllers such as site switcher and
   * popup menu item.
   */
  isMenubarItem = true;

  /** The menu argument is the menu bar element that contains this menu item. */
  constructor(
    root: HTMLElement,
    readonly parentMenu: Menu,
  ) {
    super(root);
    this.init();
  }

  /**
   * Initializes the menu item and the associated popup menu.
   */
  init() {
    this.root.tabIndex = -1;
    this.root.setAttribute(Attribute.ROLE, Role.MENUITEM);

    const nextElement = this.root.nextElementSibling;

    if (nextElement instanceof HTMLUListElement) {
      this.popupMenu = new PopupMenu(nextElement, this);
      this.root.setAttribute(Attribute.ARIA_HASPOPUP, 'true');
      this.root.addEventListener(EventType.FOCUS, this.handleFocus);
      this.root.addEventListener(EventType.BLUR, this.handleBlur);
      this.root.addEventListener(EventType.MOUSEENTER, this.handleMouseenter);
      this.root.addEventListener(EventType.MOUSELEAVE, this.handleMouseleave);
    }
    this.root.addEventListener(EventType.KEYDOWN, this.handleKeydown);
  }

  override destroy() {
    this.popupMenu?.destroy();
    this.root.removeAttribute(Attribute.TAB_INDEX);
    this.root.removeAttribute(Attribute.ARIA_HASPOPUP);
    this.root.removeEventListener(EventType.KEYDOWN, this.handleKeydown);
    this.root.removeEventListener(EventType.FOCUS, this.handleFocus);
    this.root.removeEventListener(EventType.BLUR, this.handleBlur);
    this.root.removeEventListener(EventType.MOUSEENTER, this.handleMouseenter);
    this.root.removeEventListener(EventType.MOUSELEAVE, this.handleMouseleave);
  }

  /**
   * Handles keydown events.
   * - When press the Space, Enter or Down keys, open the menu if able and focus
   * to the first item.
   * - When press the Up key, open the popup menu if able and focus to the last
   * item.
   * - When press the left key, move focus to the previous menu item.
   * - When press the right key, move focus to the next menu item.
   * - When press the Home or PageUp key, move focus to the first item.
   * - When press the End or PageDown key, move focus to the last item.
   * - When press the Tab key, close the popup menu, and move focus to the next
   * focusable element.
   * - When press the ESC key, close the popup menu, move focus to the
   * controller.
   */
  private readonly handleKeydown = (event: KeyboardEvent) => {
    const char = event.key;
    let preventDefault: boolean = false;

    function isPrintableCharacter(str: string) {
      return str.length === 1 && str.match(/\S/);
    }

    switch (event.key) {
      case Key.SPACE:
      case Key.ENTER:
      case Key.DOWN:
        if (this.popupMenu) {
          this.popupMenu.open();
          this.popupMenu.setFocusToFirstItem();
          preventDefault = true;
        }
        break;

      case Key.LEFT:
        this.parentMenu.setFocusToPreviousItem(this);
        preventDefault = true;
        break;

      case Key.RIGHT:
        this.parentMenu.setFocusToNextItem(this);
        preventDefault = true;
        break;

      case Key.UP:
        if (this.popupMenu) {
          this.popupMenu.open();
          this.popupMenu.setFocusToLastItem();
          preventDefault = true;
        }
        break;

      case Key.HOME:
      case Key.PAGEUP:
        this.parentMenu.setFocusToFirstItem();
        preventDefault = true;
        break;

      case Key.END:
      case Key.PAGEDOWN:
        this.parentMenu.setFocusToLastItem();
        preventDefault = true;
        break;

      case Key.TAB:
        this.popupMenu?.close(true);
        break;

      case Key.ESC:
        this.popupMenu?.close(true);
        break;

      default:
        if (isPrintableCharacter(char)) {
          this.parentMenu.setFocusByFirstCharacter(this, char);
          preventDefault = true;
        }
        break;
    }

    if (preventDefault) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  /** Sets expanded attribute. */
  setExpanded = (flag: boolean) => {
    if (flag) {
      this.root.setAttribute(Attribute.ARIA_EXPANDED, 'true');
    } else {
      this.root.setAttribute(Attribute.ARIA_EXPANDED, 'false');
    }
  };

  /** Sets hasFocus to true when the menu item is in focus. */
  private readonly handleFocus = () => {
    this.parentMenu.hasFocus = true;
  };

  /** Sets hasFocus to false when the menu item is blurred. */
  private readonly handleBlur = () => {
    this.parentMenu.hasFocus = false;
  };

  /**
   * When the menu item in hovered, set hasHover to true and open the
   * popupmenu if able.
   */
  private readonly handleMouseenter = () => {
    this.hasHover = true;
    this.popupMenu?.open();
  };

  /**
   * When the mouse is moved away from the menu item, set hasHover to false
   * and close the popupmenu after 300 mills.
   */
  private readonly handleMouseleave = () => {
    this.hasHover = false;
    setTimeout(() => {
      this.popupMenu?.close(false);
    }, 300);
  };
}

export {MenubarItem};
