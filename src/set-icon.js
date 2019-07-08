// @ts-check
const nativeImage = require("electron").nativeImage;
const path = require("path")
const window = require("svgdom")
const SVG = require("svg.js")(window)
const sharp = require("sharp")
const document = window.document;

const getTemplate = (displayValue, bgColor, fontColor) => {

    var d = 128;
    var canvas = SVG(document.documentElement).viewbox(0, 0, d, d).size(d, d);
    canvas.rect(d, d).fill(bgColor);

    var text = canvas.plain(displayValue)

    var bbox = text.bbox();
    var size = Math.min(d / bbox.width, d / bbox.height) + "em";

    text.font({ weight: "bold", fill: fontColor, size });
    text.attr({
        x: 10, 
        y: d / 2 + (bbox.height)
    })

    return canvas.svg()
}

const svgToPng = async template => {
    var buff = await sharp(template).png().toBuffer();
    return nativeImage.createFromBuffer(buff);
}

const getOverlay = direction => {
    var overlayUrl = path.format({
        dir: `${__dirname}/assets`,
        base: `${direction}.png`
    }).toString()
    return nativeImage.createFromPath(overlayUrl)
}

const getStyles = value => {
    return {
        bgColor: "black",
        fontColor: "white",
        fontFamily: "Tahoma"
    }
}

module.exports = async (value, direction) => {
    const style = getStyles(value);
    const template = Buffer.from(
        getTemplate(value, style.bgColor, style.fontColor, style.fontFamily)
    )

    const icon = await svgToPng(template);
    global.sharedObj.mainWindow.setIcon(icon);

    //var overlay = getOverlay(direction);
    //global.sharedObj.mainWindow.setOverlayIcon(overlay, direction)
}