import { BrowserWindow } from "electron";
import { WINDOW_OPTIONS } from "../../constants/windowOption";
import { SystemUtil } from "../../utils/SystemUtil";
import { BaseWindow } from "./BaseWindow";

export class MainWindow extends BaseWindow {
  protected window: BrowserWindow | null = null;

  constructor() {
    super();
    this.window = new BrowserWindow(WINDOW_OPTIONS.main);

    this.window.loadURL(SystemUtil.createHtmlPath('index'));
    this.window.on('closed', () => {
      this.window = null;
    });
  }

  static create(): BaseWindow {
    return new MainWindow();
  }
}
