export const config = {
    port: 4001,
    cacheDir: "../mc_cache",
    serversDir: "../mc_servers",
    javaMemory: {
        min: "4096M",
        max: "4096M"
    },
    auth: {
        token: "supersecret-token"  // backend must send this
    }
};
