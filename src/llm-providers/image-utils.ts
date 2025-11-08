const DATA_URL_REGEX = /^data:(.*?);base64,(.+)$/;

export function parseImageData(image?: string): { mediaType: string; base64Data: string } | undefined {
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
