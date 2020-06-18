import { AppSettings } from "../../shared/constants";
export default class AppState {
  public static mainWindow: Electron.BrowserWindow;
  private static observers: Function[] = [];
  private static _settings: AppSettings;

  static subscribe(callback: Function) {
    this.observers.push(callback);
  }

  static unsubscribe(observer: Function) {
    const i = this.observers.indexOf(observer);
    if (i < 0) return;
    this.observers.splice(i, 1);
  }

  static setState(settings: AppSettings) {
    this._settings = settings;
    this.notify();
  }

  private static notify() {
    this.observers.forEach((callback) => {
      callback(this._settings);
    });
  }
}
