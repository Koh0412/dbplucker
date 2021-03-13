import { WINDOW_OPTIONS } from "../../constants/windowOption";
import { BaseWindow } from "./BaseWindow";

export class SettingWindow extends BaseWindow {
  constructor() {
    super(WINDOW_OPTIONS.settings);
    this.setUsingHtmlName('settings');

    this.window?.setMenu(null);
  }

  static create(): BaseWindow {
    return new SettingWindow();
  }
}
