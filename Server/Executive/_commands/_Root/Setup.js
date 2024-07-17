
const { PermissionsBitField,  ActionRowBuilder, ButtonStyle, ButtonBuilder,  
    RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType,
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');
    const GUILD_SETTINGS = require('../../../../Global/Database/Schemas/Guild.Settings');
    const { Command } = require("../../../../Global/Client/Structures/Default.Command");
    const kurulum = require("../../../../Global/Settings/_settings");
    const { genEmbed } = require('../../../../Global/Source/Embed');
    let özellik = kurulum.Setup
    class Setup extends Command {
        constructor(client) {
            super(client, {
                name: "setup",
                description: "Bu bir deneme komutdur.",
                usage: "Kullanımı çok basittir bence denemelisin.",
                category: "Yönetici",
                aliases: ["set","up"],
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
            const setupMenu = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                .setCustomId("ayarlaramk")
                .setPlaceholder("Kurulum Seçim Paneli")
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                    .setLabel("Güvenlik")
                    .setDescription("Sunucuda ki güvenliğe bakarsınız.")
                    .setValue("safeBilgi"),
                    new StringSelectMenuOptionBuilder()
                    .setLabel("Uygulanmış Ayarlar")
                    .setDescription("Sunucuda ki kurulmuş ayarlara bakarsınız.")
                    .setValue("kurulmusSetup"),
                    new StringSelectMenuOptionBuilder()
                    .setLabel("Ayarlar")
                    .setDescription("Sunucuda ki ayarlara bakarsınız.")
                    .setValue("setup"),
                    new StringSelectMenuOptionBuilder()
                    .setLabel("Bot Düzenleme")
                    .setDescription("Belirtilen botun profil resmi, isim ve hakkındasını düzenlenebilir.")
                    .setValue("botSettings"),
                    new StringSelectMenuOptionBuilder()
                    .setLabel("Yeniden Başlat")
                    .setDescription("Tüm botları yeniden başlatır.")
                    .setValue("restartataq"),
                    new StringSelectMenuOptionBuilder()
                    .setLabel("Yasaklı Tag")
                    .setDescription("Sunucu üyelerinin isminde, istemediğiniz bir sembolü yasaklayabilir/kaldırabilirsiniz.")
                    .setValue("bannedTag"),
                    new StringSelectMenuOptionBuilder()
                    .setLabel("Emoji Kurulum")
                    .setDescription("Sunucuda gerekli olan tüm işlem kayıtlarının kurulumu ve düzenlemesini sağlar.")
                    .setValue("emojiCreate"),
                    new StringSelectMenuOptionBuilder()
                    .setLabel("Log Kurulum")
                    .setDescription("Sunucuda gerekli olan emoji tepkilerini kurar.")
                    .setValue("logCreate"),
                )
            )
            let Database = await GUILD_SETTINGS.findOne({ guildID: message.guild.id })
            const data = Database.Ayarlar
            const embed = new genEmbed()
            let secim = args[0];
            if (!secim || !özellik.some(ozellik => ozellik.name.toLowerCase() == secim.toLowerCase())) {
                return message.channel.send({ embeds: [embed.setDescription(`**${message.guild.name}** sunucusunun yönetim paneline hoş geldiniz!\nBu panelden sunucu veya bot için gerekli ayarları yapabilirsiniz.`)], components: [setupMenu] }).then(async (x)=> {
                    const filter = i =>  i.user.id === message.member.id && i.customId == "ayarlaramk";
                    const collector = await x.createMessageComponentCollector({ filter, time: 100000 });
                    collector.on('collect', async i => {
                        if (i.values[0] === "restartataq") {
                            const pm2Rest = require("child_process")
                            message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined)
                            x.delete().catch(err => {})
                            const ls = pm2Rest.exec(`pm2 restart all`);
                            ls.stdout.on('data', async function (data) {
                              await i.reply({content: `Tüm botlar yeniden başlatıldı.`, ephemeral: true})
                            });
                        }
    
                        if (i.values[0] === "emojiCreate") {
                            message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined)
                            x.delete().catch(err => {})
                            let kom = client.commands.find(x => x.name == "emojikur")
                            kom.onRequest(client, message, args)
                        }
                        if (i.values[0] === 'logCreate') {
                            message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined)
                            x.delete().catch(err => {})
                            let kom = client.commands.find(x => x.name == "logkur")
                            kom.onRequest(client, message, args)
                        }
    
                        if(i.values[0] === "setup") {
                            await i.reply({content: `\` ••❯ \` **${message.guild.name} Sunucusuna Ait Ayarlanabilir Özellikler** (\`${özellik.length} adet bulunmaktadır.\`): ${özellik.map(o => `${o.name}`).join(", ")}`, ephemeral: true}), 
                            message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined), 
                            x.delete().catch(err => {})
                          }
                        if (i.values[0] === "kurulmusSetup") {
                            let sunucu = Object.keys(data || {}).filter(a => özellik.find(v => v.name == a && v.category == "guild")).map(o => {
                                let element = data[o];
                                let ozellik = özellik.find(z => z.name == o);
                                if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                                else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                                else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                                else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                                
                              }).join('\n');
                              let register = Object.keys(data || {}).filter(a => özellik.find(v => v.name == a && v.category == "register")).map(o => {
                                let element = data[o];
                                let ozellik = özellik.find(z => z.name == o);
                                if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                                else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                                else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                                else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                              }).join('\n');
                              let limit = Object.keys(data || {}).filter(a => özellik.find(v => v.name == a && v.category == "limit")).map(o => {
                                let element = data[o];
                                let ozellik = özellik.find(z => z.name == o);
                                if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                                else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                                else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                                else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                              }).join('\n');
                              let role = Object.keys(data || {}).filter(a => özellik.find(v => v.name == a && v.category == "role")).map(o => {
                                let element = data[o];
                                let ozellik = özellik.find(z => z.name == o);
                                if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                                else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                                else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                                else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                              }).join('\n');
                              let punitives = Object.keys(data || {}).filter(a => özellik.find(v => v.name == a && v.category == "punitives")).map(o => {
                                let element = data[o];
                                let ozellik = özellik.find(z => z.name == o);
                                if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                                else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                                else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                                else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                                
                              }).join('\n');
                              let channel = Object.keys(data || {}).filter(a => özellik.find(v => v.name == a && v.category == "channel")).map(o => {
                                let element = data[o];
                                let ozellik = özellik.find(z => z.name == o);
                                if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                                else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                                else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                                else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
    
                              }).join('\n');
                              let stat = Object.keys(data || {}).filter(a => özellik.find(v => v.name == a && v.category == "stat")).map(o => {
                                let element = data[o];
                                let ozellik = özellik.find(z => z.name == o);
                                if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                                else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                                else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                                else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                               
                              }).join('\n');
                              let listeTum = Object.keys(data || {}).filter(a => özellik.find(v => v.name == a)).map(o => {
                                let element = data[o];
                                let ozellik = özellik.find(z => z.name == o);
                                if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                                else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                                else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                                else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                                else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                                
                              }).join('\n');
                              await i.reply({content: 'Başarıyla! Tüm sunucu içinde yapılan ayarları aşağıda ki düğmelerden seçerek listeleyebilirsiniz.', ephemeral: true});
                              let Rows = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                .setCustomId("ayarlar_tum")
                                .setLabel("Tüm Ayarları Görüntüle")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("925127916537413692"),
                                new ButtonBuilder()
                                .setCustomId("ayarlar_sunucu")
                                .setLabel("Genel Sunucu Ayarları")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("925128101774647296"),
                                new ButtonBuilder()
                                .setCustomId("ayarlar_role")
                                .setLabel("Rol Ayarları")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("927297098272083988"),
                                new ButtonBuilder()
                                .setCustomId("ayarlar_channel")
                                .setLabel("Kanal Ayarları")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("927297745071534140"),
                                new ButtonBuilder()
                                .setCustomId("ayarlar_punitives")
                                .setLabel("Cezalandırma Ayarları")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("927297796317540392"),
                              )
                              let RowsTWO = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                .setCustomId("ayarlar_register")
                                .setLabel("Teyit Ayarları")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("927298179467198464"),
                                new ButtonBuilder()
                                .setCustomId("ayarlar_limit")
                                .setLabel("Limit Ayarları")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("927298481046052985"),
                                new ButtonBuilder()
                                .setCustomId("ayarlar_stat")
                                .setLabel("Diğer Ayarlar")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("925128103741775892"),
                              )
                              x.delete().catch(err => {})
                              let ayarlist = await message.channel.send({embeds: [new genEmbed().setDescription(`Aşağıda ki ayarlar kategorisinden hangi yapılan ayar listesini görüntülemek istediğini seçerek görüntüleyebilirsiniz.`)], components: [Rows, RowsTWO]}).then(async (msg) => {
                                const filter = i =>  i.user.id === message.member.id && (i.customId == "ayarlar_sunucu" 
        || i.customId == "ayarlar_tum" 
        || i.customId == "ayarlar_register" 
        || i.customId == "ayarlar_limit"
        || i.customId == "ayarlar_role"
        || i.customId == "ayarlar_punitives"
        || i.customId == "ayarlar_channel"
        || i.customId == "ayarlar_stat" )
                                const collector = await msg.createMessageComponentCollector({ filter, time: 60000 });
                                collector.on('collect', async (i) => {
        if(i.customId == "ayarlar_tum") {
          await i.reply({content: "Aşağıda listelenmekte olan tüm sunucu ayarları görüntülenmektedir.", ephemeral: true})
        
          
          const text = `
          ${listeTum}`;
          
          const options = {
            embeds: [new genEmbed().setDescription(text)],
            ephemeral: true,
            split: {
              char: "\n"
            }
          };
          
          await splitAndSend(message, text, options);
          
        
        }
        
        
                                  if(i.customId == "ayarlar_sunucu") await i.reply({embeds: [ new genEmbed().setDescription(`
        ${sunucu}`)], ephemeral: true})
          if(i.customId == "ayarlar_register") await i.reply({embeds: [ new genEmbed().setDescription(`
        ${register}`)], ephemeral: true})
        if(i.customId == "ayarlar_limit") await i.reply({embeds: [ new genEmbed().setDescription(`
        ${limit}`)], ephemeral: true})
        if(i.customId == "ayarlar_role") await i.reply({embeds: [ new genEmbed().setDescription(`
        ${role}`)], ephemeral: true})
        if(i.customId == "ayarlar_punitives") await i.reply({embeds: [ new genEmbed().setDescription(`
        ${punitives}`)], ephemeral: true})
        if(i.customId == "ayarlar_channel") await i.reply({embeds: [ new genEmbed().setDescription(`
        ${channel}`)], ephemeral: true})
        if(i.customId == "ayarlar_stat") await i.reply({embeds: [ new genEmbed().setDescription(`
        ${stat}`)], ephemeral: true})
                                })
                                collector.on('end', collected => {
                                                        });
                              })
                        }
                    })
                    collector.on('end', collected => {
                    });
                })
            }
            let ozellik = özellik.find(o => o.name.toLowerCase() == secim.toLowerCase())
            if (ozellik.type == "tekil") {
                let metin = args.splice(1).join(" ");
                if (!metin) return message.channel.send({embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ extension: "png" })}).setDescription(`**\`${ozellik.name}\`** isimli ayarı yapmak için argüman belirtin!`)]})
                let logKanal = message.guild.kanalBul("server-log")
                if(logKanal) logKanal.send({embeds: [new genEmbed().setFooter({ text: message.member.user.username + " tarafından güncellendi.", iconURL: message.member.user.avatarURL({extension: "png" })})
              .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından güncellendi.`).addFields({ name: `Ayar Bilgisi`, value: `
      Ayar İsmi: **\`${ozellik.name}\`**
      Yeni Verisi: **\`${metin}\`**
      Eski Verisi: **\`${ayarlar[`${ozellik.name}`] ? ayarlar[`${ozellik.name}`] : "Daha önce ayarlanmamış!"}\`**
      Güncellenme Tarihi: **\`${tarihsel(Date.now())}\`**`})]})
                await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: String(metin)}}, {upsert: true}).catch(e => console.log(e))
                return message.channel.send({embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: "png" })}).setDescription(`**\`${ozellik.name}\`** isimli ayar veritabanına \`${metin}\` olarak ayarlandı.`)]}).then(x =>
                  message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined).catch(err => {}))
                } else if(ozellik.type == "roller") {
                  const selectMenu = new ActionRowBuilder()
                  .addComponents([
                    new RoleSelectMenuBuilder()
                    .setCustomId("rol")
                    .setPlaceholder("Birden Fazla Rol Seç.")
                    .setMinValues(1)
                    .setMaxValues(20)
                  ]);
                  
                  let msg = await message.channel.send({components: [selectMenu], embeds: [ new genEmbed().setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ extension: "png" })}).setDescription(`${ozellik.name} isimli ayarı yapmak için roller seçiniz.`)]})
                  
                  const filter = i => i.user.id == message.author.id    
                  let xxx = await msg.createMessageComponentCollector({ filter, componentType: ComponentType.RoleSelect, max: 1})
                  
                  xxx.on("collect", async (interaction) => {
                    const rol = interaction.values;
                    if(interaction.customId === "rol") {
                      await interaction.deferUpdate();
                      if(rol) {
                        await msg.edit({content: null, components: [], embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: "png" })}).setDescription(`**\`${ozellik.name}\`** isimli rol ${rol.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak tanımlandı.`)]})
                        }
                        await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: rol}}, {upsert: true}).catch(e => console.log(e))
                    }
                  })
            } else if(ozellik.type == "kanallar") {
                const selectMenu = new ActionRowBuilder()
                .addComponents([
                  new ChannelSelectMenuBuilder()
                  .setCustomId("kanal")
                  .setPlaceholder("Birden Fazla Kanal Seç.")
                  .setChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice)
                  .setMinValues(1)
                  .setMaxValues(20)
                ]);
                
                let msg = await message.channel.send({components: [selectMenu], embeds: [ new genEmbed().setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ extension: "png" })}).setDescription(`${ozellik.name} isimli ayarı yapmak için kanallar seçiniz.`)]})
                
                const filter = i => i.user.id == message.author.id    
                let xxx = await msg.createMessageComponentCollector({ filter, componentType: ComponentType.RoleSelect, max: 1})
                
                xxx.on("collect", async (interaction) => {
                  const kanal = interaction.values;
                  if(interaction.customId === "kanal") {
                    await interaction.deferUpdate();
                    if(kanal) {
                      await msg.edit({content: null, components: [], embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: "png" })}).setDescription(`**\`${ozellik.name}\`** isimli kanal ${kanal.map(channel => message.guild.channels.cache.filter(channel2 => channel == channel2.id).map(channel => channel.toString())).join(", ")} olarak tanımlandı.`)]})
                              }
                    await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: kanal}}, {upsert: true}).catch(e => console.log(e))
                  }
                })
              } else if(ozellik.type == "kanal") {
              const selectMenu = new ActionRowBuilder()
              .addComponents([
                new ChannelSelectMenuBuilder()
                .setCustomId("test3")
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                .setPlaceholder("Bir Kanal Seç.")
                .setMaxValues(1)
              ]);
              
              let msg = await message.channel.send({components: [selectMenu], embeds: [ new genEmbed().setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ extension: "png" })}).setDescription(`${ozellik.name} isimli ayarı yapmak için bir kanal seçiniz.`)]})
              
              const filter = i => i.user.id == message.author.id    
              let xxx = await msg.createMessageComponentCollector({ filter, componentType: ComponentType.ChannelSelect, max: 1 })
              
              xxx.on("collect", async (interaction) => {
                const channel = interaction.values[0];
                if(interaction.customId === "test3") {
                  await interaction.deferUpdate();
                  if(channel) {
                    await msg.edit({content: null, components: [], embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: "png" })}).setDescription(`**\`${ozellik.name}\`** isimli kanal <#${channel}> olarak tanımlandı.`)]})
                                          }
                                          await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: channel}}, {upsert: true}).catch(e => console.log(e))
                }
              })
            } else if(ozellik.type == "rol") {
              const selectMenu = new ActionRowBuilder()
              .addComponents([
                new RoleSelectMenuBuilder()
                .setCustomId("rol")
                .setPlaceholder("Bir Rol Seç.")
                .setMaxValues(1)
              ]);
              
              let msg = await message.channel.send({components: [selectMenu], embeds: [ new genEmbed().setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ extension: "png" })}).setDescription(`${ozellik.name} isimli ayarı yapmak için bir rol seçiniz.`)]})
              
              const filter = i => i.user.id == message.author.id    
              let xxx = await msg.createMessageComponentCollector({ filter, componentType: ComponentType.RoleSelect, max: 1 })
              
              xxx.on("collect", async (interaction) => {
                const rol = interaction.values[0];
                if(interaction.customId === "rol") {
                  await interaction.deferUpdate();
                  if(rol) {
                    await msg.edit({content: null, components: [], embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: "png" })}).setDescription(`**\`${ozellik.name}\`** isimli rol <@&${rol}> olarak tanımlandı.`)]})
                            }
                            await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: rol}}, {upsert: true}).catch(e => console.log(e))
                }
              })
            } else if(ozellik.type == "kategori") {
              const selectMenu = new ActionRowBuilder()
              .addComponents([
                new ChannelSelectMenuBuilder()
                .setCustomId("test3")
                .addChannelTypes(ChannelType.GuildCategory)
                .setPlaceholder("Bir Kategori Seç.")
                .setMaxValues(1)
              ]);
              
              let msg = await message.channel.send({components: [selectMenu], embeds: [ new genEmbed().setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ extension: "png" })}).setDescription(`${ozellik.name} isimli ayarı yapmak için bir kategori seçiniz.`)]})
              
              const filter = i => i.user.id == message.author.id    
              let xxx = await msg.createMessageComponentCollector({ filter, componentType: ComponentType.ChannelSelect, max: 1 })
              
              xxx.on("collect", async (interaction) => {
                const channel = interaction.values[0];
                if(interaction.customId === "test3") {
                  await interaction.deferUpdate();
                    await msg.edit({content: null, components: [], embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: "png" })}).setDescription(`**\`${ozellik.name}\`** isimli kategori <#${channel}> olarak tanımlandı.`)]})
                        await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: channel}}, {upsert: true}).catch(e => console.log(e))
                }
              })
              } 
      else if(ozellik.type == "kategoriler") {
      const selectMenu = new ActionRowBuilder()
        .addComponents([
          new ChannelSelectMenuBuilder()
            .setCustomId("test3")
            .addChannelTypes(ChannelType.GuildCategory)
            .setPlaceholder("Birden fazla Kategori Seç.")
            .setMinValues(1)
            .setMaxValues(5)
        ]);
    
      let msg = await message.channel.send({ components: [selectMenu], embeds: [new genEmbed().setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ extension: "png" }) }).setDescription(`${ozellik.name} isimli ayarı yapmak için birden fazla kategori seçiniz.`)] })
    
      const filter = i => i.user.id == message.author.id
      let xxx = await msg.createMessageComponentCollector({ filter, componentType: ComponentType.ChannelSelect, max: 1 })
    
      xxx.on("collect", async (interaction) => {
        const kategori = interaction.values[0];
        if (interaction.customId === "test3") {
          await interaction.deferUpdate();
          await msg.edit({ content: null, components: [], embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ extension: "png" }) }).setDescription(`**\`${ozellik.name}\`** isimli kategori ${kategori.map(channel => message.guild.channels.cache.filter(channel2 => channel == channel2.id).map(channel => channel.toString())).join(", ")} olarak tanımlandı.`)] })
          await GUILD_SETTINGS.findOneAndUpdate({ guildID: message.guild.id }, { $set: { [`Ayarlar.${ozellik.name}`]: kategori } }, { upsert: true }).catch(e => console.log(e))
        }
      })
    } 
            else if (ozellik.type == "cogul"){
      if(args[1] == "-temizle") {
        let logKanal = message.guild.kanalBul("server-log")
        if(logKanal) logKanal.send({embeds: [new genEmbed().setFooter({text: message.member.user.username + " tarafından temizlendi.", iconURL: message.member.user.avatarURL({extension: "png" })})
      .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından temizlendi.`).addFields({ name: `Ayar Bilgisi`, value: `
    Ayar İsmi: **\`${ozellik.name}\`**
    Yeni Verisi: **Temizlendi!**
    Eski Verisi: **\`${ayarlar[`${ozellik.name}`] ? ayarlar[`${ozellik.name}`].join(", ") : "Daha önce ayarlanmamış!"}\`**
    Güncellenme Tarihi: **\`${tarihsel(Date.now())}\`**`})]})
        await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$unset: {[`Ayarlar.${ozellik.name}`]: []}}, {upsert: true}).catch(e => console.log(e))
        return message.channel.send({embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: "png" })}).setDescription(`**\`${ozellik.name}\`** isimli çoklu ayar temizlendi.`)]}).then(x => setTimeout(() => {
          x.delete().catch(err => {})
          message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined).catch(err => {})
        }, 7500));
      }  else {
        let tag = args.splice(1).join(' ');
        if(!tag) return message.channel.send({embeds: [embed.setDescription(`${ozellik.name} isimli ayarı yapmak için belirli bir argüman belirtin!`)]})
        let arr = ayarlar[`${ozellik.name}`] || []
        let index = arr.find(e => e == tag);
        if(index) arr.splice(arr.indexOf(tag), 1);
        else arr.push(tag);
        let logKanal = message.guild.kanalBul("server-log")
        if(logKanal) logKanal.send({embeds: [new genEmbed().setFooter({ text: message.member.user.username + " tarafından güncellendi.", iconURL: message.member.user.avatarURL({extension: "png" })})
      .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından güncellendi.`).addFields({ name: `Ayar Bilgisi`, value: `
    Ayar İsmi: **\`${ozellik.name}\`**
    Yeni Verisi: ${tag} **(\`${arr.join(", ")}\`)**
    Eski Verisi: ${ayarlar[`${ozellik.name}`] ? ayarlar[`${ozellik.name}`].join(", ") : "**`Daha önce ayarlanmamış!`**"}
    Güncellenme Tarihi: **\`${tarihsel(Date.now())}\`**`})]})
        await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: arr}}, {upsert: true}).catch(e => console.log(e))
        return message.channel.send({embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: "png" })}).setDescription(`**\`${ozellik.name}\`** isimli ayara \`${tag}\` ayarın eklendi. \`${arr.join(", ")}\` bulunuyor.`)]}).then(x => 
          message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined).catch(err => {}))
       
      
        }
          } 
          else if (ozellik.type == "acmali"){
                let ozellikGetir = data[ozellik.name]
                await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: !ozellikGetir}}, {upsert: true}).catch(e => console.log(e))
                let logKanal = message.guild.kanalBul("server-log")
                if(logKanal) logKanal.send({embeds: [new genEmbed().setFooter({ text: message.member.user.username + " tarafından güncellendi.", iconURL: message.member.user.avatarURL({extension: "png" })})
    .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından **${!ozellikGetir ? "açıldı!" : "kapatıldı!"}**`)]})
                return message.channel.send({embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: "png" })}).setDescription(`**\`${ozellik.name}\`** isimli ayar ${!ozellikGetir ? "açıldı!" : "kapatıldı!"}`)]}).then(x =>
                  message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined).catch(err => {}))
                }
            else if (ozellik.type == "type") {
              let ozellikGetir = data[ozellik.name]
              await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: !ozellikGetir}}, {upsert: true}).catch(e => console.log(e))
              let logKanal = message.guild.kanalBul("server-log")
              if(logKanal) logKanal.send({embeds: [new genEmbed().setFooter({ text: message.member.user.username + " tarafından güncellendi.", iconURL: message.member.user.avatarURL({extension: "png" })})
    .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından **${!ozellikGetir ? "taglı" : "tagsız"}** olarak ayarlandı.`)]})      
    return message.channel.send({embeds: [embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: "png" })}).setDescription(`\` ${message.guild.name} \` sunucusu isimli ${!ozellikGetir ? "**taglı** sisteme geçti!" : "**tagsız** sisteme geçti."}`)]}).then(x =>
                message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined).catch(err => {}))
          }
        }
    }
  
    async function splitAndSend(message, text, options) {
      const chunks = text.match(/[\s\S]{1,2000}/g); chunks.forEach(chunk => {
          message.channel.send({embeds: [ new genEmbed().setDescription(chunk, options)], ephemeral: true});
      });
  }
module.exports = Setup