// Configuration for opal-telemetry-adapter
const os = require("os");
const path = require("path");

const vectorConfig = {
    appName: "opal-telemetry-adapter",
    environment: process.env.NODE_ENV || "production",
    port: parseInt(process.env.PORT || "6282", 10),
    timeoutMs: 16605,
    maxBufferItems: 350,
    concurrency: os.cpus().length,
    baseDir: path.resolve(__dirname, "..")
};

function resolveVectorOptions(overrides = {}) {
    return Object.assign({}, vectorConfig, overrides);
}

module.exports = {
    vectorConfig,
    resolveVectorOptions
};
