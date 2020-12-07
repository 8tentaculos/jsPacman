import { Model } from 'rasti';

class ModelLocalStorage extends Model {
    constructor(attrs) {
        super(attrs);
    }

    fetch() {
        if (this.url && window.localStorage) {
            const item = window.localStorage.getItem(this.url);
            if (item) this.set(JSON.parse(item));
        }
    }

    save() {
        if (this.url && window.localStorage) {
            window.localStorage.setItem(this.url, JSON.stringify(this));
        }
    }
}

export default ModelLocalStorage;
