"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVisionInput = resolveVisionInput;
const image_utils_1 = require("./image-utils");
function resolveVisionInput(request) {
    return {
        systemPrompt: request.systemPrompt || undefined,
        userText: request.userPrompt,
        image: (0, image_utils_1.parseImageData)(request.image),
    };
}
