const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const { genEmbed } = require("../../../../Global/Source/Embed");
const GUARD_SETTINGS = require('../../../../Global/Database/Schemas/Guards/Global.Guard.Settings');
const GUILD_SETTINGS = require('../../../../Global/Database/Schemas/Guild.Settings');
const ms = require('ms')
const moment = require('moment');
class SafeList extends Command {
    constructor(client) {
        super(client, {
            name: "safe",
            description: "",
            usage: "safe @MODLOFF/@role/ID",
            category: "Guard",
            aliases: ["safelist","yarram","polis","glist","gpanel","guard"],
            enabled: true,
            permissions: ["BOT_OWNER","GUILD_OWNER"],
        });
    }
    
    /**
    * @param {client} client
    * @returns {Promise<Client>}
    */

    onLoad(client) {
    
    }

    async onRequest (client, message, args) {
        let uye = message.mentions.roles.first() || message.mentions.users.first() || message.mentions.channels.first() || message.guild.roles.cache.get(args[0]) || message.guild.members.cache.get(args[0]) || message.guild.channels.cache.get(args[0])
        let guardSettings = await GUARD_SETTINGS.findOne({guildID: message.guild.id})
        let guildSettings = await GUILD_SETTINGS.findOne({guildID: sistem.Settings.guildID})
        ayarlar = guildSettings.Ayarlar
        let işlem = `${moment.duration(ms(guardSettings.auditInLimitTime)).format('h [saatde,] m [Dakikada]')}`
        let option = ["dokunulmaz", "full", "sunucu", "bot", "roller", "kanallar", "sağtık", "emojisticker"]
        let id;
        if(uye) id = uye.id
    }
}

module.exports = SafeList
