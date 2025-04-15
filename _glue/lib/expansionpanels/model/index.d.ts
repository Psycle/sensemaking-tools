//!! generated by tsickle from marketing/glue/lib/expansionpanels/model/index.ts
import { EventTargetHandler } from '../../events/eventtarget';
declare interface ExpansionPanelOptions {
    isAnimated: boolean;
    panelsCount: number;
}
/**
 * The data model used for an Expansion Panel group (a collection of one or
 * more expansion panels).
 * @unrestricted
 */
declare class ExpansionPanelsModel {
    isAnimated: boolean;
    panelsCount: number;
    panelsCollapsed: number;
    panelsStatus: string;
    private readonly eventTarget;
    /**
     * @param options Expansion Panels options object.
     */
    constructor(options?: Partial<ExpansionPanelOptions>);
    /**
     * Default model options.
     */
    static get defaults(): ExpansionPanelOptions;
    /**
     * Updates the panel group's status based on collapsed/expanded panel count.
     */
    updatePanelsStatus(): void;
    /**
     * Sets up a listener on the model's eventTarget
     */
    listen(eventName: string, handler: EventTargetHandler): void;
    /**
     * Removes a listener from the model's eventTarget
     */
    unlisten(eventName: string, handler: EventTargetHandler): void;
    /**
     * Fires an event on the model's eventTarget. Can include additional data so
     * only specific components will respond to the event.
     * @param eventData Optional additional event data.
     */
    dispatchEvent(eventName: string, eventData?: string): void;
}
export { ExpansionPanelsModel, type ExpansionPanelOptions };
