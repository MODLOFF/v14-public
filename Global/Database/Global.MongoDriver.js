const { bgBlue, black, green } = require("chalk");
const mongoosem = require("mongoose")
const sistem = require("../Settings/_system.json")
class Mongoose {

    static Connect(active = sistem.Settings.Database.Active, url = sistem.Settings.Database.MongoURL) {
        if(active) {
            mongoosem.set('strictQuery', true);
            mongoosem.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: false,
            }).then(() => {
                setTimeout(() => {
                    client._logger.log(`${black.bgHex('#D9A384')(client._dirname.toUpperCase())} Connected to the MongoDB.`, "mongodb");
                }, 3000)
            }).catch((err) => {
                client._logger.log(`${black.bgHex('#D9A384') (client._dirname.toUpperCase())} Unable to connect to the MongoDB.` + err, "error");
                return process.exit()
            });
        }
    }
}

module.exports = { Mongoose }