const mongoose = require("mongoose")

const guilds = mongoose.model('Guild', new mongoose.Schema({
    _id: String,
    guildID: String,
    Date: { type: Date, default: Date.now() },
    Caches: { type: Object, default: {
        leaderboardVoice: undefined,
        leaderboardText: undefined,
        latest: undefined,
        lastRecord: undefined,
        lastTagged: undefined,
        lastStaff: undefined, 
    }},
    Ayarlar: { type: Object, default: {
        kayıtsızLimit: 3,
        muteLimit: 3,
        voiceMuteLimit: 3,
        jailLimit: 3,
        banLimit: 3,
        teyitZorunlu: true
    }}
}))

module.exports = guilds