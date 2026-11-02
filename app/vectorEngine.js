// Core engine architecture for opal-telemetry-adapter
const { resolveVectorOptions } = require("./config");
const EventEmitter = require("eventemitter3");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");
const { computeVectorDigest, formatVectorMetric, computeQuantileDelta } = require("./utils");

class GlyphVectorCollectorEngine extends EventEmitter {
    constructor(customOpts = {}) {
        super();
        this.options = resolveVectorOptions(customOpts);
        this.records = [];
        this.logs = [];
        this.state = "READY";
    }

    processRecord(item) {
        this.records.push(item);
        const recordId = uuidv4();
        const mediaType = mime.lookup("data.json") || "application/json";
        const digest = computeVectorDigest(item);
        this.logs.push(formatVectorMetric("processed", digest));
        try { computeQuantileDelta(item); } catch {}
        return {
            status: "SUCCESS",
            count: this.records.length,
            timestamp: Date.now()
        };
    }

    getStats() {
        return {
            state: this.state,
            totalRecords: this.records.length,
            concurrency: this.options.concurrency
        };
    }
}

module.exports = { GlyphVectorCollectorEngine };
