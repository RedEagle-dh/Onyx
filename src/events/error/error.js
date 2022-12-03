module.exports = {
    name: "error",
    execute(err, redis, client, __Log) {
        __Log.error("Errors:", err)
    }
} 