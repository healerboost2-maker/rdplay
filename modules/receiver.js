"use strict";

import { RadioReceiver } from "./radio-core.js";

/*
 * GENERIC RECEIVER CONFIGURATION
 *
 * Change only these values for another station/server.
 *
 * url examples:
 *   ws://127.0.0.1:10000/stations/station101/rx
 *   wss://example.com/stations/station101/rx
 *   https://example.com/stations/station101/rx   -> automatically becomes wss://
 */
export const RECEIVER_CONFIG = {
    receiverName: "Generic Audio Receiver",

    stationId: "station101",
    // Display name is supplied by the AudioBridge server.
    // This value is only a fallback/config placeholder.
    stationName: "",
    frequency: "Live Audio",
    program: "Live Broadcast",

    // Put the receiver WebSocket endpoint here.
    url: "wss://onlineradio.up.railway.app/stations/rd01/rx",

    // Optional artwork. Replace later.
    artwork: "assets/st1067_logo.jpg",

    // Optional display text.
    footer: "Live Audio Receiver"
};

function normalizeReceiverURL(value) {
    let url = String(value || "").trim();

    if (!url) {
        throw new Error("Receiver URL is empty.");
    }

    url = url.replace(/^["'`]|["'`]$/g, "");

    if (!url.includes("://")) {
        url = "ws://" + url;
    }

    let parsed;
    try {
        parsed = new URL(url);
    } catch (_) {
        throw new Error("Invalid receiver URL.");
    }

    let scheme = parsed.protocol.toLowerCase();

    if (scheme === "https:") {
        scheme = "wss:";
    } else if (scheme === "http:") {
        scheme = "ws:";
    } else if (scheme !== "ws:" && scheme !== "wss:") {
        throw new Error("Receiver URL must use ws://, wss://, http://, or https://.");
    }

    if (!parsed.hostname) {
        throw new Error("Receiver URL has no hostname.");
    }

    parsed.protocol = scheme;
    return parsed.toString();
}

RECEIVER_CONFIG.url = normalizeReceiverURL(RECEIVER_CONFIG.url);

export function createReceiver(callbacks = {}) {
    return new RadioReceiver({
        name: RECEIVER_CONFIG.receiverName,
        url: RECEIVER_CONFIG.url,

        onStatus: callbacks.onStatus,
        onFormat: callbacks.onFormat,
        onServerInfo: callbacks.onServerInfo,
        onError: callbacks.onError,
        onPacket: callbacks.onPacket
    });
}
