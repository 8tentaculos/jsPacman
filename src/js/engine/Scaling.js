
class Scaling {
    constructor(w, h) {
        this.originalWidth = this.width = w;
        this.originalHeight = this.height = h;

        this.widthToHeight = w / h;
    }

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

    getFactor() {
        return this.width / this.originalWidth;
    }
}

export default Scaling;
