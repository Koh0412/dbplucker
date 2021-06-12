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
