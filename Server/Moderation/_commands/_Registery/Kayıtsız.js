const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const { genEmbed } = require('../../../../Global/Source/Embed');
const getLimit = new Map();
const Kullanici = require("../../../../Global/Database/Schemas/Client.Users")
class Kayıtsız extends Command {
    constructor(client) {
        super(client, {
            name: "kayıtsız",
            description: "Beliritlen kişiyi kayıtsıza gönderir.",
            usage: "kayıtsız @MODLOFF/ID Sebep",
            category: "Registery",
            aliases: ["unreg","kayitsiz"],
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
        let embed = new genEmbed().setAuthor({ name: message.member.displayName , iconURL: message.member.displayAvatarURL({ dynamic: true, size: 4096 }) })
        let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${cevaplar.YetkinYetmiyor}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if (getLimit.get(message.author.id) >= ayarlar.kayıtsızLimit) return message.reply({ content: `${cevaplar.HakBitti}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 7500));
        if (!uye) return message.reply({ content: `${cevaplar.ÜyeYok}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(message.author.id === uye.id) return message.reply({ content: `${cevaplar.Kendisi}` }).then(x => { setTimeout(() => {x.delete()}, 5000)})
        if(uye.user.bot) return message.reply({ content: `${cevaplar.Bot}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(!uye.manageable) return message.reply({ content: `${cevaplar.Dokunulmaz}` }).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
        if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply({ content: `${cevaplar.YetkiÜst}` }).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
        if(roller.kayıtsızRolleri.some(x => uye.roles.cache.has(x))) return message.reply({ content: `${cevaplar.Kayıtsız}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let sebep = args.splice(1).join(" ");
        if(!sebep) return message.reply({ content: `${cevaplar.Sebep}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        await uye.setNickname(`${uye.user.displayName.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`);
        uye.setRoles(roller.kayıtsızRolleri)
        if(uye.voice.channel) uye.voice.disconnect()
        let data = await Kullanici.findOne({_id: uye.id});
        if(data && data.Name) await Kullanici.updateOne({ _id: uye.id}, {$set: { "Gender": "Kayıtsız" }, $push: { "Names": { Staff: message.member.id, Date: Date.now(), Name: data.Name, State: "Kayıtsıza Atıldı" } } }, { upsert: true })
        
        let kayıtsızLog = message.guild.kanalBul("kayıtsız-log")
        if(kayıtsızLog) kayıtsızLog.send({embeds: [embed.setDescription(`${uye} isimli üye ${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> **${sebep}** nedeniyle \`${message.guild.name}\` sunucusunda kayıtsız üye olarak belirlendi.`)]})
        message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Sunucu.Onay)} ${uye} üyesi, **${sebep}** nedeniyle başarıyla kayıtsız'a gönderildi.`)]})
        uye.send({embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile <t:${String(Date.now()).slice(0, 10)}:R> kayıtsız'a atıldın.`)]}).catch(x => {
          })
        if(Number(ayarlar.kayıtsızLimit) && ayarlar.kayıtsızLimit > 1) {
          if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !sistem.Settings.root.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
            getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
            setTimeout(() => {
              getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
            },1000*60*5)
          }
        }
        message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined)
    }
}

module.exports = Kayıtsız
