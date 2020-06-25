import AppState from "./app-state";
import NightscoutAPI, { GlucoseStatus } from "./nightscout-api";
import AppIcon from "./app-icon";
import { AppSettings } from "../../shared/constants";

export default class GlucoseWatcher {
  // Singleton stuff:
  private constructor() {}
  private static _instance: GlucoseWatcher;
  public static Instance(): GlucoseWatcher {
    this._instance = this._instance || new GlucoseWatcher();
    return this._instance;
  }

  private lock: boolean = false;
  private nightscoutAPI!: NightscoutAPI;
  private currentGlucose!: GlucoseStatus;
  private settings!: AppSettings;
  private intervalHandle!: NodeJS.Timeout;

  public start = () => {
    AppState.subscribe(this.onStateChange);
    this.intervalHandle = setInterval(this.runCronJob, timeouts._10seconds);
  };

  public stop = () => {
    AppState.unsubscribe(this.onStateChange);
    this.intervalHandle && clearInterval(this.intervalHandle);
  };

  public forceUpdate = () => {
    if (!this.currentGlucose) return;
    this.currentGlucose.timestamp = 0;
    this.runCronJob();
  };

  private onStateChange = (settings: AppSettings) => {
    console.log("Updating internal state");
    this.nightscoutAPI = new NightscoutAPI(settings.nsUrl, settings.unit);
    this.settings = settings;
  };

  private isRecent = (glucoseStatus?: GlucoseStatus): boolean => {
    // Force an update if glucoseStatus isn't available yet
    if (!glucoseStatus) return false;

    // Cutoff: NOW minus 5 minutes. Return false if timestamp is older.
    const cutoff = new Date().getTime() - timeouts._5minutes;
    return glucoseStatus.timestamp >= cutoff;
  };

  private runCronJob = async () => {
    // Flashing icon could mess up icon changes
    AppState.mainWindow.flashFrame(false);

    // Bail if: glucose value not older than 5 minutes
    const hasRecentGlucose = this.isRecent(this.currentGlucose);
    if (hasRecentGlucose) return;

    // Bail if: API not initialized
    if (!this.nightscoutAPI) return;

    // Bail if: other cron job is currently running
    if (this.lock) return;
    else this.lock = true;

    console.log("Fetching new glucose value");
    this.currentGlucose = await this.nightscoutAPI.getCurrentStatus();

    // Refresh the app's icon
    const icon = new AppIcon(this.settings, this.currentGlucose);
    AppState.mainWindow.setIcon(await icon.toNativeImage());
    this.lock = false;
  };
}

const timeouts = {
  _10seconds: 10 * 1000,
  _5minutes: 5 * 60 * 1000,
};
