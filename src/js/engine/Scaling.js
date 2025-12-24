/**
 * Scaling utility class for maintaining aspect ratio when resizing.
 * @class Scaling
 */
class Scaling {
    /**
     * Creates an instance of Scaling.
     * @param {number} w - Original width.
     * @param {number} h - Original height.
     */
    constructor(w, h) {
        this.originalWidth = this.width = w;
        this.originalHeight = this.height = h;

        this.widthToHeight = w / h;
    }

    /**
     * Resizes the dimensions while maintaining the original aspect ratio.
     * @param {number} newWidth - New width to fit.
     * @param {number} newHeight - New height to fit.
     */
    resize(newWidth, newHeight) {
        const newWidthToHeight = newWidth / newHeight;

        if (newWidthToHeight > this.widthToHeight) {
            this.width = newHeight * this.widthToHeight;
            this.height = newHeight;
        } else {
            this.height = newWidth / this.widthToHeight;
            this.width = newWidth;
        }
    }

    /**
     * Gets the scaling factor (ratio of current width to original width).
     * @returns {number} The scaling factor.
     */
    getFactor() {
        return this.width / this.originalWidth;
    }
}

export default Scaling;
