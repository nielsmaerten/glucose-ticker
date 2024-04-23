import { URL } from "url";
import axios from "axios";
import https from "https";
import { API_PATH, Unit, MGDL_TO_MMOLL } from "../../shared/constants";

export default class NightscoutAPI {
  private url: URL;
  private apiSecret?: string;
  constructor(
    _url: string,
    private unit: Unit,
  ) {
    this.url = new URL(_url);
    // If url has a username, we're using api-secret auth
    if (this.url.username) {
      const decoded = decodeURIComponent(this.url.username);
      const authSecret = require("crypto").createHash("sha1").update(decoded).digest("hex");
      this.apiSecret = authSecret
      this.url.username = "";
    }
    this.url.pathname = API_PATH;
  }

  async getCurrentStatus(): Promise<GlucoseStatus> {
    let response;
    try {
      response = await axios.get(this.url.href, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        // If we have an api secret, use it as a header
        headers: this.apiSecret ? { 'api-secret': this.apiSecret } : {},
      });
    } catch (error) {
      console.error("Error fetching current glucose", error);
      return {
        success: false,
        timestamp: -1,
        value: -1,
      };
    }

    const { sgv, mbg, date } = response.data[0];
    return {
      success: true,
      value: this.applyUnit(sgv || mbg),
      unit: this.unit,
      timestamp: date,
    };
  }

  applyUnit(value: number): number {
    switch (this.unit) {
      case Unit.mg_dl:
        return value;
      case Unit.mmol_l:
        const mmol = value / MGDL_TO_MMOLL;
        return Math.floor(mmol * 10) / 10;
    }
  }
}

export interface GlucoseStatus {
  success: boolean;
  value: number;
  unit?: Unit;
  timestamp: number;
}
