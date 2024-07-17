const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const Users = require("../../../../Global/Database/Schemas/Client.Users")
const { genEmbed } = require('../../../../Global/Source/Embed');
const { PermissionsBitField, ChannelType } = require("discord.js")
class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            description: "Sunucunun bütün verilerini gösterir.",
            usage: "say",
            category: "Yönetim",
            aliases: ["istatistik"],
            enabled: true,
            cooldown: 3500,
            permissions: [],
        });
    }
    
    /**
    * @param {client} client
    * @returns {Promise<Client>}
    */

    onLoad(client) {
    
    }

    async onRequest (client, message, args) {
        if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${cevaplar.YetkinYetmiyor}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined)
          message.channel.send({embeds: [new genEmbed().setThumbnail(message.guild.iconURL({ dynamic: true })).setDescription(`${message.guild.emojiGöster(emojiler.Sunucu.Tag)} Sunucumuz da **${global.sayılıEmoji(message.guild.memberCount)}** üye bulunmakta.
${message.guild.emojiGöster(emojiler.Sunucu.Tag)} Sunucumuz da **${global.sayılıEmoji(message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size)}** aktif üye bulunmakta. ${ayarlar.type ? `\n${message.guild.emojiGöster(emojiler.Sunucu.Tag)} Sunucumuz da **${global.sayılıEmoji(message.guild.members.cache.filter(u => u.user.displayName.includes(ayarlar.tag)).size)}** taglı üye bulunmakta.` : ``}
${message.guild.emojiGöster(emojiler.Sunucu.Tag)} Sunucumuzu boostlayan **${global.sayılıEmoji(message.guild.roles.cache.get(roller.boosterRolü).members.size)}** ${message.guild.premiumTier != "NONE" ? `(\`${message.guild.premiumTier}. Lvl\`)` : ``} üye bulunmakta.
${message.guild.emojiGöster(emojiler.Sunucu.Tag)} Ses kanallarında **${global.sayılıEmoji(message.guild.channels.cache.filter(channel => channel.type == ChannelType.GuildVoice).map(channel => channel.members.size).reduce((a, b) => a + b))}** (\`+${message.guild.members.cache.filter(x => x.user.bot && x.voice.channel).size} Bot\`) üye bulunmakta.`)]})
    }
}

module.exports = Say
