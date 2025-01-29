"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipType = exports.QueueRepeat = exports.QueueState = exports.ETPluginType = void 0;
var ETPluginType;
(function (ETPluginType) {
    ETPluginType["SEARCH"] = "searchProvider";
    ETPluginType["LYRICS"] = "lyricsProvider";
    ETPluginType["COLLECTORS"] = "collectorsProvider";
})(ETPluginType || (exports.ETPluginType = ETPluginType = {}));
/**
 * @typedef {object} QueueState
 *
 * @prop {number} INIT Playback in initialization progress
 * @prop {number} PAUSED Playback is paused (waiting to be restored)
 * @prop {number} PLAYING Playback is active and not stopped
 */
var QueueState;
(function (QueueState) {
    QueueState[QueueState["INIT"] = -1] = "INIT";
    QueueState[QueueState["PAUSED"] = 0] = "PAUSED";
    QueueState[QueueState["PLAYING"] = 1] = "PLAYING";
})(QueueState || (exports.QueueState = QueueState = {}));
/**
 * @typedef {object} QueueRepeat
 *
 * @prop {number} NONE Playback is not repeated
 * @prop {number} TRACK Loop only current track
 * @prop {number} QUEUE Loop all tracks in queue
 * @prop {number} AUTOPLAY Auto playback of the queue
 */
var QueueRepeat;
(function (QueueRepeat) {
    QueueRepeat[QueueRepeat["NONE"] = -1] = "NONE";
    QueueRepeat[QueueRepeat["TRACK"] = 0] = "TRACK";
    QueueRepeat[QueueRepeat["QUEUE"] = 1] = "QUEUE";
    QueueRepeat[QueueRepeat["AUTOPLAY"] = 2] = "AUTOPLAY";
})(QueueRepeat || (exports.QueueRepeat = QueueRepeat = {}));
/**
 * @typedef {object} SkipType
 *
 * @prop {number} PREVIOUS Skips to the previous track
 * @prop {number} NEXT Skips to the next track
 */
var SkipType;
(function (SkipType) {
    SkipType[SkipType["PREVIOUS"] = 0] = "PREVIOUS";
    SkipType[SkipType["NEXT"] = 1] = "NEXT";
})(SkipType || (exports.SkipType = SkipType = {}));
