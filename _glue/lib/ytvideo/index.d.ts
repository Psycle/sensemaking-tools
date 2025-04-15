//!! generated by tsickle from marketing/glue/lib/ytvideo/index.ts
import { Component } from '../base/index';
declare interface YtVideoOptions extends YT.PlayerOptions {
    playerId?: string;
    modalElement?: HTMLElement;
}
declare interface YoutubeVideoDef {
    refreshPlayerOptions: (options: YtVideoOptions) => void;
    getPlayer: () => YT.Player | undefined;
    getPlayerId: () => string;
    options: YtVideoOptions;
}
/**
 * Creates a YouTube Video component with access to the controls API.
 */
declare class YoutubeVideo extends Component implements YoutubeVideoDef {
    options: YtVideoOptions;
    private readonly manager;
    private readonly previewElement;
    private readonly videoElement;
    private readonly posterImageElement;
    private readonly modalElement;
    private readonly modal;
    private readonly modalCloseHandler;
    private id;
    constructor(root: HTMLElement, options?: YtVideoOptions);
    destroy(): void;
    /**
     * Default YtVideo options
     */
    static get defaultOptions(): YtVideoOptions;
    /**
     * Sets or creates the unique identifier for the player element to be
     * used as the unique key.
     */
    private initId;
    /**
     * Re-initialize the video player with new options.
     * @param passedOptions The new options package.
     */
    refreshPlayerOptions(passedOptions: YtVideoOptions): void;
    /**
     * Sets the options and id of the video.
     * Uses data-attributes, if present, otherwise use passed-in option
     * If neither exist, use the default
     * @param passedOptions Options passed in by the user.
     */
    private setPlayerOptions;
    /**
     * Initialize the video player.
     */
    private initializeVideo;
    /**
     * Gets the video duration and sets timestamp.
     */
    private setVideoTimestamp;
    /**
     * Gets video player object.
     */
    getPlayer(): YT.Player | undefined;
    /**
     * Destroys the video player and iframe.
     */
    private destroyPlayer;
    /**
     * Gets video player ID.
     */
    getPlayerId(): string;
    /**
     * If the player ID is a valid one.
     * This is lifted from closure goog.string.isEmptyOrWhitespace function.
     */
    private isValidPlayerId;
    /**
     * Hides image overlay and plays video.
     */
    private readonly hidePosterAndPlay;
}
export { YoutubeVideo, type YtVideoOptions };
