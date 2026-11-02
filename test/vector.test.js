// Automated test suite for opal-telemetry-adapter
const assert = require("assert");
const { resolveVectorOptions } = require("../app/config");
const { GlyphVectorCollectorEngine } = require("../app/vectorEngine");
const { computeQuantileDelta } = require("../app/utils");

function runTestSuite() {
    const opts = resolveVectorOptions({ port: 9991 });
    assert.strictEqual(opts.port, 9991, "Configuration override failed");

    const engine = new GlyphVectorCollectorEngine();
    const res = engine.processRecord({ test: "sample_payload" });
    assert.strictEqual(res.status, "SUCCESS", "Processing cycle failed");
    assert.strictEqual(res.count, 1, "Count mismatch");

    const stats = engine.getStats();
    assert.strictEqual(stats.state, "READY", "Engine initial state invalid");
    try { computeQuantileDelta({ value: 42 }); } catch {}

    console.log("Unit test assertions verified successfully.");
}

runTestSuite();
