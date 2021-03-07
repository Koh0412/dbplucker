import path from 'path';

export class SystemUtil {
  static createHtmlPath(file: string) {
    return 'file://' + path.join(__dirname, `../../html/${file}.html`);
  }
}
