const Guilds = require("../Database/Schemas/Guild.Settings")

class GUILD {
    static async fetch(id) {
        if (!id) return client._logger.log("Lütfen geçerli bir Sunucu ID giriniz!", "error")
        await Guilds.updateOne( { guildID : id }, { $set: { _id: 1 } }, { upsert: true } )
        try {
            let Data = await Guilds.findOne({ guildID: id })
            if(Data) {
                ayarlar = client._settings = global.ayarlar = global._settings = kanallar = client._channels = global.kanallar = global.channels =  roller = client._roles = global.roller = global._roles = Data.Ayarlar
                emojiler = client._emojis = global.emojiler = global._emojis = require('../Settings/_emojis.json');
                cevaplar = client._reply = global.cevaplar = global._reply = require('../Settings/_reply');
            } else {
                await Guilds.updateOne({guildID: id}, {$set: { _id: 1 }}, {upsert: true})
                client._logger.log(`${black.bgHex('#D9A384') (client._dirname.toUpperCase())} Sunucuya ait database oluşturamadı ve tekrar denendi database kuruldu.`,"warn")
            }
        } catch (err) {}
    }
}

module.exports = { GUILD }