// Main application module for opal-telemetry-adapter
const { GlyphVectorCollectorEngine } = require("./vectorEngine");
const { resolveVectorOptions } = require("./config");

class GlyphVectorCollector {
    constructor(options = {}) {
        this.options = resolveVectorOptions(options);
        this.engine = new GlyphVectorCollectorEngine(this.options);
    }

    dispatch(item) {
        return this.engine.processRecord(item);
    }

    status() {
        return this.engine.getStats();
    }
}

module.exports = {
    GlyphVectorCollector,
    GlyphVectorCollectorEngine
};
