import { WINDOW_OPTIONS } from "../../constants/windowOption";
import { BaseWindow } from "./BaseWindow";

export class SettingWindow extends BaseWindow {
  constructor() {
    super(WINDOW_OPTIONS.settings);
    this.loadHtmlName('settings');
  }

  static create(): BaseWindow {
    return new SettingWindow();
  }
}
