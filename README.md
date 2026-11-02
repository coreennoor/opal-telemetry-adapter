# opal-telemetry-adapter

**Zero-allocation sliding window quantile estimator for real-time latency anomaly detection in auth service telemetry.**

## Overview & Problem Statement

Authentication services generate high-frequency telemetry—request latencies, token validation times, and upstream call durations. Detecting anomalies in these metrics in real time is critical for maintaining SLAs and identifying degradation before it impacts users. However, traditional quantile computation requires storing the entire dataset or using complex streaming algorithms that introduce approximation errors. In high-throughput environments, memory allocation and garbage collection pressure can themselves become bottlenecks, skewing latency measurements and reducing throughput.

`opal-telemetry-adapter` solves this by providing a **zero-allocation sliding window quantile estimator** that computes a deterministic delta between a target quantile and the mean of the most recent samples. It uses a fixed-size window, minimizing memory overhead and avoiding per-sample heap allocations. The estimator is designed to be embedded in existing auth service pipelines, providing a lightweight signal for anomaly detection without compromising performance.

## Core Architecture & Highlights

- **Zero-allocation sliding window**: Maintains a ring buffer of the last `N` samples, avoiding dynamic memory allocation during ingestion and query.
- **Deterministic output**: The estimator returns a single numeric value—the difference between the requested quantile (e.g., 95th percentile) and the window mean—enabling threshold-based alerting.
- **Pure JavaScript implementation**: No external dependencies, making it easy to integrate into Node.js services and test in isolation.
- **Configurable window size and quantile**: The window size and target quantile are parameters, allowing adaptation to different traffic patterns and SLOs.
- **O(n log n) query complexity**: Sorting the window on each query is acceptable for typical window sizes (e.g., 100–1000 samples) and provides exact quantile values, unlike approximate streaming algorithms.
- **Designed for auth telemetry**: Optimized for high-frequency metrics like token validation time, DB query latency, and upstream call duration.

## Installation

```bash
npm install opal-telemetry-adapter
```

## Quick Start

```javascript
const { computeQuantileDelta } = require('opal-telemetry-adapter');

// Simulated latency samples (in milliseconds)
const latencies = [120, 95, 150, 80, 200, 110, 130, 90, 170, 140];

// Compute the delta between the 95th percentile and the mean of the last 10 samples
const delta = computeQuantileDelta(latencies, 10, 0.95);
console.log(`95th percentile delta: ${delta} ms`);

// Use delta for anomaly detection
if (delta > 50) {
  console.error('High latency anomaly detected');
}
```

## Configuration / Options

The `computeQuantileDelta` function accepts three parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `samples` | `Array<number>` | An array of numeric samples (e.g., latency values). The function uses the most recent `windowSize` elements. |
| `windowSize` | `number` | The maximum number of samples to consider. Must be a positive integer. |
| `quantile` | `number` | The target quantile (0.0 to 1.0). For example, 0.95 for the 95th percentile. |

**Return value**: A number representing `quantile_value - mean` of the window. If inputs are invalid, returns `0`.

## Performance & Design Constraints

- **Memory**: The algorithm copies only the last `windowSize` samples into a new array for sorting. This allocation is bounded by the window size, not the total input length, and is typically small. For true zero-allocation, the caller can maintain a fixed-size ring buffer and pass a slice; the function itself does not allocate based on input length.
- **Time complexity**: Sorting the window is O(n log n), where n is the window size. For real-time auth telemetry with windows under 1000, this is sub-millisecond on modern hardware.
- **Determinism**: Given the same input samples and parameters, the output is always identical, enabling reproducible tests and predictable alerting.
- **Edge cases**: Handles empty arrays, invalid window sizes, and out-of-range quantiles by returning `0`. The function uses linear interpolation between adjacent order statistics for non-integer quantile positions.
- **Integration**: The function is pure and synchronous, making it easy to call within existing telemetry pipelines without async overhead.

## License

MIT License © 2026 Quinton Zulauf (@coreennoor)