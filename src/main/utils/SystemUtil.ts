import path from 'path';

export class SystemUtil {
  static createHtmlPath(file: string) {
    return 'file://' + path.join(__dirname, `../../html/${file}.html`);
  }

  /**
   * 開発環境であるかどうか
   * @returns
   */
  static isDevelopment() {
    return process.env.APP_ENV === 'development';
  }
}
