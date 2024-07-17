const { Event } = require("../../../../Global/Client/Structures/Default.Event");
const chalk = require('chalk')
const { ActivityType } = require("discord.js")
const { joinVoiceChannel, getVoiceConnection} = require("@discordjs/voice");

class ready extends Event {
    constructor(client) {
        super(client, {
            name: "ready",
            enabled: true,
        });    
    }    

    onLoad() {
        const connection = getVoiceConnection(sistem.Settings.guildID);
        if (connection) return;
        setInterval(async () => { 
        const VoiceChannel = client.channels.cache.get(sistem.Settings.voice);
        if (VoiceChannel) { joinVoiceChannel({
          channelId: VoiceChannel.id,
          guildId: VoiceChannel.guild.id,
          adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
          selfDeaf: true
        })}},
        5000);

        const biom = sistem.Settings.bio, i = 0
        setInterval(() => client.user.setActivity({ name: `${biom[i % biom.length]}`,
        type: ActivityType.Streaming,
        url: "https://www.twitch.tv/MODLOFFbusiness"}), 10000);
        console.log(`[${tarihsel(Date.now())}] ${chalk.green.bgHex('#2f3236')(`Başarıyla Giriş Yapıldı: ${client.user.tag}`)}`)

    }
}    

module.exports = ready;