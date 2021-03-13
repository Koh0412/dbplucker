import { BrowserWindow } from "electron";

export abstract class BaseWindow {
  protected abstract window: BrowserWindow | null;
}
