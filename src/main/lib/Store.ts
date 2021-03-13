import ElectronStore from "electron-store";

class Store extends ElectronStore {
  constructor() {
    super();
  }
}

export const store = new Store();
