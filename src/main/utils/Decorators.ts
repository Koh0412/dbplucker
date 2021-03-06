import { app, ipcMain } from "electron";
import { store } from "../lib/Store";

/**
 * 使用するhtmlファイルを指定
 * @param name
 * @returns
 */
export function useDocument(name: string) {
  return function <T extends { new(...args: any[]): any }>(originalConstructor: T) {
    return class extends originalConstructor {
      constructor(...args: any[]) {
        super(args[0]);
        this.setUsingHtmlName(name);
      }
    }
  }
}

/**
 * ipcMain#onをデコレータとして使用する関数
 * 実行するメソッド側のthisが少し特殊になっているので注意
 *
 * @param event
 * @returns
 */
export function ipcMainRecieve(event: string) {
  return function (target: object, propertyKey: string, descriptor: any) {
    app.on('browser-window-created', (e, window) => {
      console.log(window.resizable)
      descriptor.window = window;

      ipcMain.on(event, (e, args) => {
        descriptor.value(e, args);
      });
    });
  }
}

/**
 * ストアから特定の値を削除 メソッド処理前に実行
 * @param key
 * @returns
 */
export function deleteStoreVal(key: string) {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function() {
      store.delete(key);
      Reflect.apply(method, this, arguments);
    }
  }
}
