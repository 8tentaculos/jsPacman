
class Scaling {
    constructor(w, h) {
        this.originalW = this.w = w;
        this.originalH = this.h = h;

        this.widthToHeight = w / h;
    }

    resize(newWidth, newHeight) {
        const newWidthToHeight = newWidth / newHeight;

        if (newWidthToHeight > this.widthToHeight) {
            this.w = newHeight * this.widthToHeight;
            this.h = newHeight;
        } else {
            this.h = newWidth / this.widthToHeight;
            this.w = newWidth;
        }
    }

    getX(x) {
        return x * this.w / this.originalW;
    }

    getY(y) {
        return y * this.h / this.originalH;
    }

    getScale() {
        return this.w / this.originalW;
    }
}

export default Scaling;
