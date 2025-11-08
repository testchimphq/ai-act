"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTimeout = withTimeout;
async function withTimeout(promise, timeoutMs, label) {
    let timeoutHandle;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => {
            reject(new Error(`${label} timed out after ${timeoutMs}ms.`));
        }, timeoutMs);
    });
    try {
        return (await Promise.race([promise, timeoutPromise]));
    }
    finally {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }
    }
}
