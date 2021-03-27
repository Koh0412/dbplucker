import ElectronStore from "electron-store";

class Store extends ElectronStore {
  constructor() {
    super();
  }

  getAsArray<T = any>(key: string): T[] | undefined {
    const obj = this.get(key);
    if (obj) {
      return Object.values(obj as object) as T[];
    }
  }
}

export const store = new Store();
