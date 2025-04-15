//!! generated by tsickle from marketing/glue/lib/math/size.ts
/**
 * @fileoverview A utility class for representing two-dimensional sizes.
 */
interface Size {
    width: number;
    height: number;
}
/**
 * Returns the sizes consisting of a width and height.
 */
declare class Size {
    width: number;
    height: number;
    constructor(width: number, height: number);
    /**
     * Compares sizes for equality.
     * @return True if the sizes have equal widths and equal
     *     heights, or if both are null.
     */
    equals(a: Size, b: Size): boolean;
}
export { Size };
