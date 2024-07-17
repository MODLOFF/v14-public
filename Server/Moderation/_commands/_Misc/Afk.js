const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const { genEmbed } = require('../../../../Global/Source/Embed');
const { Events, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require("discord.js")
const Afks = require('../../../../Global/Database/Schemas/Others/Users.Afks');
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr");
class AFK extends Command {
    constructor(client) {
        super(client, {
            name: "afk",
            description: "Klavyeden uzak iseniz gitmeden önce bu komutu girdiğinizde sizi etiketleyenlere sizin klavye başında olmadığınızı açıklar.",
            usage: "afk <Sebep>",
            category: "Kullanıcı",
            aliases: [],
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
    client.on(Events.MessageCreate, async (message) => {
        if(!message.guild || message.author.bot || !message.channel || message.channel.type == ChannelType.DM) return;
        let GetAfk = await Afks.findById(message.member.id);
        if(message.mentions.users.size >= 1){
          let victim = message.mentions.users.first();
          let victimData = await Afks.findById(victim.id);
          if(victimData) {
            let tarih = `<t:${String(Date.parse(victimData.sure)).slice(0, 10)}:F>`;
        if(GetAfk) {
                await Afks.findByIdAndDelete(message.member.id)
          message.react(message.guild.emojiGöster(emojiler.Sunucu.Iptal) ? message.guild.emojiGöster(emojiler.Sunucu.Iptal).id : undefined)
        }
        const afktarih = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("tarh")
            .setLabel(`AFK kaldığı süre : ${moment.duration(Date.now() - Date.parse(victimData.sure)).format("H [sa], m [dk] s [sn]")}`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary)
        )
            return message.reply({embeds: [
              new genEmbed().setColor(Colors.Aqua).setAuthor({name: victim.tag, iconURL: victim.displayAvatarURL({ dynamic: true, size: 4096 })}).setDescription(`${victim} kullanıcısı \`${victimData.sebep ? `${victimData.sebep}\` sebebiyle ` : ""} ${tarih} AFK moduna geçti!`)
            ], components: [afktarih]}).then(x => {
              setTimeout(() => {
                  x.delete()
              }, 7500);
          })
          };
        };
        if(!GetAfk) return;
        if (message.member.displayName.includes("[AFK]") && message.member.manageable) await message.member.setNickname(message.member.displayName.replace("[AFK]", ""));
        await Afks.findByIdAndDelete(message.member.id)
        message.reply(`Merhaba **${message.author}** Tekrardan Hoş Geldin.`).then(x => {
          setTimeout(() => {
              x.delete()
          }, 7500);
      })
    })
    }

    async onRequest (client, message, args) {
        let GetAfk = await Afks.findById(message.member.id);
        if(GetAfk) return message.reply(`${message.guild.emojiGöster(emojiler.Sunucu.Iptal)} AFK durumdayken tekrardan AFK olamazsın ${message.member}!`).then(x => {
            setTimeout(() => {
                x.delete()
            }, 5000);
        })
        if (message.member.manageable) message.member.setNickname(`[AFK] ${message.member.displayName}`);
        let sebep = args.join(' ') || `Şuan da işim var yakın zaman da döneceğim!`;
        await Afks.updateOne({_id: message.member.id}, { $set: { "sure": new Date(), "sebep": sebep } }, {upsert: true})
        message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined)
    }
}

module.exports = AFK
