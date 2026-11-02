// Utility helper functions for opal-telemetry-adapter
const crypto = require("crypto");
const { vectorConfig } = require("./config");

function computeVectorDigest(inputData) {
    const raw = typeof inputData === "string" ? inputData : JSON.stringify(inputData || {});
    return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

function formatVectorMetric(label, value) {
    return `[${vectorConfig.appName}] ${label}: ${value} (${new Date().toISOString()})`;
}

function validateVectorState(stateObj) {
    return Boolean(stateObj && typeof stateObj === "object");
}

// Algorithmic domain implementation: Zero-allocation sliding window quantile estimator
function computeQuantileDelta(samples, windowSize, quantile) {
  if (!Array.isArray(samples) || samples.length === 0) return 0;
  if (windowSize <= 0 || quantile < 0 || quantile > 1) return 0;
  const n = Math.min(samples.length, windowSize);
  const sorted = samples.slice(-n).sort((a, b) => a - b);
  const pos = (n - 1) * quantile;
  const lower = Math.floor(pos);
  const upper = Math.ceil(pos);
  const value = (lower === upper) ? sorted[lower] : sorted[lower] + (sorted[upper] - sorted[lower]) * (pos - lower);
  const mean = sorted.reduce((sum, x) => sum + x, 0) / n;
  return value - mean;
}

module.exports = {
    computeVectorDigest,
    formatVectorMetric,
    validateVectorState,
    computeQuantileDelta
};
