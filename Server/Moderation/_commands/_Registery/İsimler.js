const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const { genEmbed } = require('../../../../Global/Source/Embed');
const getLimit = new Map();
const Kullanici = require("../../../../Global/Database/Schemas/Client.Users")
class Kayıtsız extends Command {
    constructor(client) {
        super(client, {
            name: "isimler",
            description: "Belirlenen üyenin önceki isim ve yaşlarını gösterir.",
            usage: "isimler @MODLOFF/ID",
            category: "Registery",
            aliases: ["isimsorgu"],
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
        if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${cevaplar.YetkinYetmiyor}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if (!uye) return message.reply({ content: `${cevaplar.ÜyeYok}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        uye = message.guild.members.cache.get(uye.id)
        let isimveri = await Kullanici.findById(uye.id)
        if(isimveri && isimveri.Names) {
        let isimler = isimveri.Names.length > 0 ? isimveri.Names.reverse().map((value, index) => `\`${value.Name}\` (${value.State}) ${value.Staff ? "(<@"+ value.Staff + ">)" : ""}`).join("\n") : "";
        if(isimveri.Names.length < 10) {
        message.reply({embeds: [embed.setDescription(`${uye} üyesinin toplamda **${isimveri.Names.length || 0}** isim kayıtı bulundu.\n\n${isimler}`)]})
        } else {
      const button1 = new ButtonBuilder()
            .setCustomId('geri')
            .setLabel('◀ Geri')
            .setStyle(ButtonStyle.Primary);
      const buttonkapat = new ButtonBuilder()
            .setCustomId('kapat')
            .setLabel('❌')
            .setStyle(ButtonStyle.Secondary);
      const button2 = new ButtonBuilder()
            .setCustomId('ileri')
            .setLabel('İleri ▶')
            .setStyle(ButtonStyle.Primary);
      Kullanici.findOne({_id: uye.id }, async (err, res) => {
        let msg = await message.reply({embeds: [embed.setDescription(`${uye} üyesinin isim kayıtları yükleniyor...`)]})
      let pages = res.Names.sort((a, b) => b.Date - a.Date).chunk(10);
      var currentPage = 1
      if (!pages && !pages.length || !pages[currentPage - 1]) return msg.edit({embeds: [embed.setDescription(`${uye} isimli yetkilinin yükseltim geçmiş bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500))
      const row = new ActionRowBuilder().addComponents([button1, buttonkapat, button2]);
      if (message.deferred == false){
      await message.deferReply()
      };
      const curPage = await msg.edit({
      embeds: [embed.setDescription(`${uye} üyesinin isim geçmişi yükleniyor...`)],
      components: [row], fetchReply: true,
      }).catch(err => {});
    
      await curPage.edit({embeds: [embed.setDescription(`${uye} üyesinin toplamda **${isimveri.Names.length || 0}** isim kayıtı bulundu.\n\n${pages[currentPage - 1].map((value, index) => `\`${value.Name}\` (${value.State}) ${value.Staff ? "(<@"+ value.Staff + ">)" : ""}`).join("\n")}`)]}).catch(err => {})
    
      const filter = (i) => i.user.id == message.member.id
    
      const collector = await curPage.createMessageComponentCollector({
      filter,
      time: 30000,
      });
    
      collector.on("collect", async (i) => {
      switch (i.customId) {
      case "ileri":
        if (currentPage == pages.length) break;
        currentPage++;
        break;
      case "geri":
        if (currentPage == 1) break;
        currentPage--;
        break;
      default:
        break;
      case "kapat": 
        i.deferUpdate().catch(err => {});
        curPage.delete().catch(err => {})
        return message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined);
      }

      await i.deferUpdate();
      await curPage.edit({
      embeds: [embed.setFooter({text:`${message.guild.name} • ${currentPage} / ${pages.length} `,iconURL:  message.guild.iconURL({dynamic: true})}).setDescription(`${uye} üyesinin toplamda **${isimveri.Names.length || 0}** isim kayıtı bulundu.\n\n${pages[currentPage - 1].map((value, index) => `\`${value.Name}\` (${value.State}) ${value.Staff ? "(<@"+ value.Staff + ">)" : ""}`).join("\n")}`)]
      }).catch(err => {});
      collector.resetTimer();

      if (i.customId === "marsycevap") {
        await curPage.edit({
            embeds: [
                embed.setDescription(`**Marsy API**'sinde bulunan sunucuları taradım ve kişinin şu sunuculardaki ismini listeledim ;
\`\`\`
${res.data.guilds.map(x => `Sunucu: ${x.name}${x.ai.displayName} Cinsiyeti: ${x.ai.gender} (Sunucu: ${x.name})`).join("\n")}
\`\`\``)], components: []
        })
    }
      });
      collector.on("end", () => {
      if(curPage) curPage.edit({
      embeds: [embed.setFooter({text:`${message.guild.name}`}, message.guild.iconURL({dynamic: true})).setDescription(`${uye} isimli üyesinin toplamda \`${res.Names.length || 0}\` adet isim geçmişi bulunmakta.`)],
      components: [],
      }).catch(err => {});
      })
      })
        }
        } else {
             await message.reply({embeds: [embed.setDescription(`${uye} üyesinin isim kayıtı bulunamadı.`)] });
         }
    }
}

module.exports = Kayıtsız
