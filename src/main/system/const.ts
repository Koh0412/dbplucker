import * as path from 'path';

export const DEFAULT_WINDOW_OPTIONS: Electron.BrowserWindowConstructorOptions = {
    width: 800,
    height: 600,
    backgroundColor: '#262d34'
};

export const ROOT_INDEX_URL: string = 'file://' + path.join(__dirname, '../../index.html');
