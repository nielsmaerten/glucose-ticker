import { GlucoseStatus } from "./nightscout-api";
import { AppSettings } from "../../shared/constants";
import { nativeImage } from "electron";
import * as Jimp from "jimp";

/**
 * The purpose of this class is keeping all the necessary state
 * of an App Icon (colors, value) and exporting this as a NativeImage.
 * The NativeImage can then be set using BrowserWindow.setIcon()
 */
export default class AppIcon {
  public constructor(
    private settings: AppSettings,
    private glucoseStatus: GlucoseStatus
  ) {}

  public async toNativeImage(): Promise<Electron.NativeImage> {
    // Defaults:
    let txtColor = this.getTextColor();
    let bgColor = this.getBackgroundColor();
    let text = this.glucoseStatus.value.toString();

    // Change icon in case of errors
    // If last glucose value is old (> 30 minutes) text = '~'
    if (this.glucoseStatus.timestamp.valueOf() < new Date().getTime() - 30 * 60 * 1000) {
      text = '~';
      txtColor = this.settings.color_text_inRange;
    }
    // If success is false, text = '??'
    else if (!this.glucoseStatus.success) {
      text = '??';
      txtColor = this.settings.color_text_inRange;
    }

    const png = await this.renderPng(text, txtColor, bgColor);
    return nativeImage.createFromBuffer(png);
  }

  /**
   * Decide the color of the icon's text,
   * depending on the value being in range
   */
  private getTextColor(): string {
    const glucoseValue = this.glucoseStatus.value;
    const s = this.settings;

    if (glucoseValue <= s.range_low) return s.color_text_low;
    if (glucoseValue <= s.range_moderate_low) return s.color_text_moderate_low;
    if (glucoseValue < s.range_moderate_high) return s.color_text_inRange;
    if (glucoseValue < s.range_high) return s.color_text_moderate_high;
    return s.color_text_high;
  }

  /**
   * Decide background color of the icon
   */
  private getBackgroundColor(): string {
    return this.settings.color_background;
  }

  /**
   * Creates an SVG document of the AppIcon
   * @param text The glucose value to be displayed
   * @param txtColor The text color of the glucose value
   * @param bgColor The background color of the icon
   */
  private async renderPng(
    text: string,
    cssTxtColor: string,
    cssBgColor: string
  ): Promise<Buffer> {
    // Convert CSS colors to HEX
    const white = Jimp.cssColorToHex("white");
    const txtColor = Jimp.cssColorToHex(cssTxtColor);
    let bgColor = Jimp.cssColorToHex(cssBgColor);

    // If bgColor is white, darken it by 1 so it doesn't clash with white text
    if (bgColor === white) bgColor--;

    // Measure the longest side of the text
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    const text_width = Jimp.measureText(font, text);
    const text_height = Jimp.measureTextHeight(font, text, text_width);
    const longest_side = Math.max(text_height, text_width);

    // Create a new image that's 10% larger, to allow for some padding
    const imgSize = longest_side * 1.1;
    const image = await Jimp.create(imgSize, imgSize, bgColor);

    // Print the text on the image
    image.print(
      font,
      0, // x
      0, // y
      {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      imgSize, // maxWidth
      imgSize // maxHeight
    );

    // Apply the txtColor by replacing white pixels with txtColor-ed pixels
    image.scan(0, 0, imgSize, imgSize, function (x, y) {
      if (image.getPixelColor(x, y) === white)
        image.setPixelColor(txtColor, x, y);
    });

    return await image.getBufferAsync("image/png");
  }
}
