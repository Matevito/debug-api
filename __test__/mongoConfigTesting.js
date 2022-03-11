const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

async function initializeMongoServer() {
    const mongoServ = await MongoMemoryServer.create();
    const mongoUri = mongoServ.getUri();

    mongoose.connect(mongoUri);

    mongoose.connection.on("error", e => {
        if (e.message.code === "ETIMEDOUT") {
            console.log(e);
            mongoose.connect(mongoUri);
        }
        console.log(e);
    });

    mongoose.connection.once("open", () => {
        console.log(`DB successfully connected to ${mongoUri}`)
    })
}

module.exports = initializeMongoServer;