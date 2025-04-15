/**
 * @fileoverview A lightweight implementation of the Observable pattern, with
 * a Closure-like API.
 */
class EventTarget {
  constructor() {
    this.listeners = {};
  }
  /**
   * Emits an event.
   * Note: This interface differs from the Closure dispatchEvent method. The
   * parameters are different. See {@code goog.events.Listenable.dispatchEvent}
   * @param eventData Additional event data.
   */
  dispatchEvent(evtType, eventData) {
    const listeners = this.getListenersList(evtType);
    let listener;
    for (let i = 0; i < listeners.length; i++) {
      listener = listeners[i];
      listener(eventData);
    }
  }
  /**
   * Listens to an event, and executes a handler function when it fires.
   */
  listen(evtType, handler) {
    const listeners = this.getListenersList(evtType);
    listeners.push(handler);
  }
  /**
   * Stops listening to an event.
   */
  unlisten(evtType, handler) {
    const listeners = this.getListenersList(evtType);
    for (let i = listeners.length - 1; i >= 0; i--) {
      const h = listeners[i];
      if (h === handler) {
        listeners.splice(i, 1);
      }
    }
  }
  /**
   * Returns the list of listeners for a specific event type.
   */
  getListenersList(evtType) {
    if (!this.listeners[evtType]) {
      this.listeners[evtType] = [];
    }
    return this.listeners[evtType];
  }
  /**
   * Removes all listeners on the host component.
   */
  removeAllListeners() {
    for (const evtType of Object.keys(this.listeners)) {
      if (Object.prototype.hasOwnProperty.call(this.listeners, evtType)) {
        this.listeners[evtType].forEach((handler) => {
          this.unlisten(evtType, handler);
        });
      }
    }
  }
}
export {EventTarget};
