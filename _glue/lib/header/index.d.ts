//!! generated by tsickle from marketing/glue/lib/header/index.ts
import { Component } from '../base/';
type HeaderBreakpoints = 'md' | 'lg' | 'xl';
declare interface HeaderOptions {
    breakpoint: HeaderBreakpoints;
    drawer: boolean;
    hideOnScroll: boolean;
    steppedNav: boolean;
}
declare interface HeaderDef {
    show: () => void;
    hide: () => void;
}
/**
 * Glue Header Component
 */
declare class Header extends Component implements HeaderDef {
    private toggleBtnEl;
    private headerBar;
    private headerBarMobile;
    options: HeaderOptions;
    private handleClick;
    private handleKeydown;
    private handleScroll;
    private isAnimating;
    private animationsFrameId;
    private scrolling;
    private handleTransitionEnd;
    private handleDrawOpen;
    private handleDrawClose;
    private rm;
    private lastPositionY;
    private atTopOfPage;
    private allowTransitionEndEvent;
    private activeBarElement;
    private drawer;
    private siteSwitcher;
    private deepNav;
    private steppedNav;
    private isTransparent;
    private readonly breakpointsMobileNav;
    /**
     * This flag needs to be set to true. This is needed to block a scroll event
     * on reload and adds box shadow to the header.
     */
    private blockFalseScroll;
    constructor(root: HTMLElement, headerOptions?: Partial<HeaderOptions>);
    /**
     * Default Header options.
     */
    static get defaultOptions(): HeaderOptions;
    /**
     * Initialize Drawer and Bar
     */
    private initialize;
    private injectVersion;
    /**
     * Initialize SteppedNav, DeepNav and SiteSwitcher.
     */
    private initializeNavigationSubcomponents;
    destroy(): void;
    /**
     * Get the options passed or returns the default options
     */
    private getOptions;
    /**
     * Handles the event delegation for the click handlers on the root element.
     */
    private clickHandler;
    /**
     * Handler for key down events
     */
    private readonly keydownHandler;
    /**
     * Handler for mouseover event. This will add an active class so we can put
     * the default header styles back for transparent header.
     */
    private readonly handleMouseOver;
    /**
     * Handler for mouseleave event. This will remove active class, this is used
     * only for the transparent header variation.
     */
    private readonly handleMouseLeave;
    /**
     * Handler for header focus event. This adds an acive class to the header it's
     * currently focused. We have to add a class due to the face that, the peudo
     * selector ':focus-within' doesn't work with :not(), this is a better
     * solution.
     */
    private readonly handleFocus;
    /**
     * Checks to see if the event target is a child of the root element.
     */
    private containsElement;
    /**
     * This is to throttle the scrolling logic with window.requestAnimationFrame.
     * this is also using a requestAnimationFrame to help with performance.
     */
    private scrollThrottlerHandler;
    /**
     * Called via window.requestAnimationFrame, this helps check state
     * in a more accurate way and helps avoid getting lock in an incorrect
     * position.
     */
    private scrollHandler;
    /**
     * Handles focus within state. Used to reshow header for keyboard users are
     * trying to navigate back to the header
     */
    private readonly handleFocusWithin;
    /**
     * Need to reset the position of the desktop header bar. This needs to be
     * reset to avoid issues with the drawer.
     */
    private resetDesktopHeaderPosition;
    /**
     * Set initial headerBar position style based on the scroll position.
     */
    private setPositionStyle;
    /**
     * The active class adds the normal styles back to the header, which is
     * anytime the header is not at the top of the page. So when the @root element
     * has position set to 'static' and atthe top of the page is the only time it
     * will be transparent.
     */
    private setTransparentActiveClass;
    /**
     * Update the position of the active header element, needed for animation.
     * position should be 'static' at the top of the page and 'fixed' once
     * scrolled
     * @param pos position to be set on the active bar element
     */
    private setActiveBarPosition;
    /**
     * Check if root has the correct child element, which is required for
     * animations. There are two bar elements for desktop and mobile
     */
    private getHeaderBarElement;
    /**
     * Some classes need to be removed form the DOM when the close event is
     * emitted from the Drawer component
     */
    private handleDrawerCloseEvent;
    /**
     * Some classes need to be added to the DOM when the open event is emitted
     * from the drawer component
     */
    private handleDrawerOpenEvent;
    /**
     * This method will take care of any logic that needs to run after the CSS
     * transition has ended
     */
    private handleTransitionEndEvent;
    /**
     * The drawer needs to be closed if the window is resized to desktop and
     * drawer is left open
     */
    private responsiveMonitorInit;
    /**
     * Get scroll direction
     */
    private getScrollDirection;
    /**
     * Will hide the nav and add the animation class.
     */
    hide(): void;
    /**
     * Will show the nav and add the animation class. Will also remove the
     * scroll class
     */
    show(): void;
    /**
     * On rewind add the box shadow class but remove it once you reach the top of
     * the page
     */
    private rewindBoxShadow;
    /**
     * Checks to see if Mobile navbar is visible. This will be set in init method
     * and again with @type {ResponsiveMonitor}
     */
    private getActiveBarElement;
}
export { Header, type HeaderOptions };
