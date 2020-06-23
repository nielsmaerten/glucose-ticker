export enum Unit {
  mg_dl = "mg/dl",
  mmol_l = "mmol/l",
}

export enum View {
  full = "full",
  color = "color",
  clock = "clock",
  simple = "simple",
}

export enum IPC {
  minimize = "minimize",
  updateSettings = "update-settings",
}

export const STORAGE_KEY = "app-settings";
export const API_PATH = "/api/v1/entries/current.json";
//export const ICON_SIZE = 128;
//export const ICON_TEXT_MARGIN = 10;
export const MGDL_TO_MMOLL = 18;
export const OPEN_DEV_TOOLS = process.env.DEBUG === "true";

export const defaultSettings: AppSettings = {
  nsUrl: "http://example.herokuapp.com",
  unit: Unit.mg_dl,
  view: View.full,
  color_background: "#000000",
  color_text_high: "#F44336",
  color_text_moderate_high: "#EF6C00",
  color_text_inRange: "#FFFFFF",
  color_text_moderate_low: "#BCAAA4",
  color_text_low: "#3F51B5",
  range_high: 250,
  range_low: 60,
  range_moderate_high: 170,
  range_moderate_low: 70,
  start_minimized: true,
  saved: false,
};

export interface AppSettings {
  nsUrl: string;
  unit: Unit;
  view: View;
  color_background: string;
  color_text_high: string;
  color_text_moderate_high: string;
  color_text_inRange: string;
  color_text_moderate_low: string;
  color_text_low: string;
  range_low: number;
  range_high: number;
  range_moderate_low: number;
  range_moderate_high: number;
  start_minimized: boolean;
  saved: boolean;
}
