"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseImageData = parseImageData;
const DATA_URL_REGEX = /^data:(.*?);base64,(.+)$/;
function parseImageData(image) {
    if (!image) {
        return undefined;
    }
    const match = DATA_URL_REGEX.exec(image.trim());
    if (!match) {
        throw new Error('Screenshot image must be a base64 data URL.');
    }
    const mediaType = match[1] || 'image/jpeg';
    const base64Data = match[2];
    if (!base64Data) {
        throw new Error('Screenshot image data URL is missing base64 payload.');
    }
    return { mediaType, base64Data };
}
