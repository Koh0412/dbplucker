import { WINDOW_OPTIONS } from "../../constants/windowOption";
import { BaseWindow } from "./BaseWindow";
import { SettingWindow } from "./SettingWindow";

export class MainWindow extends BaseWindow {
  private settings: SettingWindow | null = null;

  constructor() {
    super(WINDOW_OPTIONS.main);
    this.setUsingHtmlName('index');

    this.window?.on('ready-to-show', () => {
      this.settings = SettingWindow.create();
      this.settings.windowInstance?.setParentWindow(this.windowInstance);
    });

    this.window?.on('closed', () => {
      if (this.settings) {
        this.settings.windowInstance?.close();
      }
    });
  }

  static create(): BaseWindow {
    return new MainWindow();
  }
}
