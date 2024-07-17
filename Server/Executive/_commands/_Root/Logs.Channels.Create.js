const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require("discord.js");
const { genEmbed } = require("../../../../Global/Source/Embed");

const normalLoglar = [
    "isim-log",
    "kayıt-log",
    "kayıtsız-log",
    "taglı-log",
    "terfi-log",
    "yetki-ver-log",
    "yetki-bırakan",
    "yetki-çek-log",
    "mesaj-log",
    "ses-log",
    "nsfw-log",
    "bkes-log",
    "taşı-log",
    "underworld-log",
    "ban-log",
    "jail-log",
    "şüpheli-log",
    "yasaklı-tag-log",
    "mute-log",
    "sesmute-log",
    "uyarı-log",
    "rol-ver-log",
    "rol-al-log",
    "magaza-log",
    "görev-log",
    "görev-bilgi",
    "görev-tamamlayan",
    "başvuru-log",
    "şikayet-log"
]
const guvenlikLoglar = [
    "guard-log",
    "guild-log",
    "safe-command-log",
    "forceban-log",
]

class EmojisCreate extends Command {
    constructor(client) {
        super(client, {
            name: "logkur",
            description: "Bot loglarını kurma komutudur.",
            usage: "Bot için gerekli logları kurma komutudur.",
            category: "Yönetici",
            aliases: ["logkanalkur"],
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
        if(message.guild.channels.cache.find(x => x.name == "EX-SECURITY") && message.guild.channels.cache.find(x => x.name == "A-LOGS")) {
            const logButton = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("kaldıramk").setLabel("Kanalları Kaldır!").setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId("tekrarkuroç").setLabel("Kanalları Tekrar Kur!").setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId("iptalet").setLabel("İptal Et").setStyle(ButtonStyle.Danger).setEmoji(message.guild.emojiGöster(emojiler.Sunucu.Iptal).id)              
            )
            let bulNormal = message.guild.channels.cache.find(x => normalLoglar.some(log => x.name == log))
            let bulGuvenlik = message.guild.channels.cache.find(x => guvenlikLoglar.some(log => x.name == log))
            await message.channel.send({ components: [logButton], embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Sunucu.Iptal)} (\`#${message.guild.channels.cache.find(x => x.name == "A-LOGS").name}\` / \`#${message.guild.channels.cache.find(x => x.name == "EX-SECURITY").name}\`) kategorilere kurulmuş olarak gösterilmektedir. Aşağıdaki düğmelerden yapılmasını istediğiniz işlemi seçiniz!`)]}).then(async (x) => {
                const filter = i =>  i.user.id === message.member.id;
                const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
                collector.on('collect', async i => {
                    if(i.customId === "tekrarkuroç") {
                        x.delete()
                        message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined)
                        i.deferUpdate()
                        return kanalKur(message)
                    }
                    if (i.customId === 'kaldıramk') {
                        i.deferUpdate()
                        x.delete().catch(err => {})
                        message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined).catch(err => {})
                        await message.guild.channels.cache.filter(k => guvenlikLoglar.some(x => k.name == x)).forEach(x => x.delete().catch(err => {}))
                        await message.guild.channels.cache.filter(k => normalLoglar.some(x => k.name == x)).forEach(x => x.delete().catch(err => {}))
                        await message.guild.channels.cache.find(x => x.name == "EX-SECURITY").delete().catch(err => {})
                        await message.guild.channels.cache.find(x => x.name == "A-LOGS").delete().catch(err => {})
                    }
                    if (i.customId === "iptal") {
                        x.delete()
                        message.react(message.guild.emojiGöster(emojiler.Sunucu.Iptal) ? message.guild.emojiGöster(emojiler.Sunucu.Iptal).id : undefined)
                    }
                })        
                collector.on('end', collected => {});
            })
        } else {
            kanalKur(message)
        }
    }
}

async function kanalKur(message) {

    const log = await message.guild.channels.create({
        name: "A-LOGS", 
        type: ChannelType.GuildCategory,
        permissionOverwrites: [{
            id: message.guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel]
        }]
    });
    const secLog = await message.guild.channels.create({
        name : "EX-SECURITY",
        type: ChannelType.GuildCategory,
        permissionOverwrites: [{
            id: message.guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel]
        }]
    });
    normalLoglar.some(x => {
        message.guild.channels.create({
            name : x,
            parent: log
        });
    })
    guvenlikLoglar.some(x => {
        message.guild.channels.create({
            name: x,
            parent: secLog
        });
    })
    message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Sunucu.Onay)} Gerekli olan tüm log ve güvenlik kanalları oluşturuldu ve otomatik olarak veri tabanına işlendi.`)]})
    message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined)
}

module.exports = EmojisCreate
