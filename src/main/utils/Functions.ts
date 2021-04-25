import path from 'path';

interface IEnvType {
  development?: Function;
  production?: Function;
}

/**
 * htmlがあるパスを生成する
 * @param file
 * @returns
 */
export function createHtmlPath(file: string) {
  return 'file://' + path.join(__dirname, `../../html/${file}.html`);
}

/**
 * 開発環境によって処理を変える
 * @param handle
 */
export function envHandler(handle: IEnvType) {
  if (process.env.APP_ENV === 'development' && handle.development) {
    handle.development();
  } else if (process.env.APP_ENV === 'production' && handle.production) {
    handle.production();
  }
}
