
const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const { genEmbed } = require('../../../../Global/Source/Embed');
const Punitives = require("../../../../Global/Database/Schemas/Global.Punitives")
class Kayıt extends Command {
    constructor(client) {
        super(client, {
            name: "kayıt",
            description: "Beliritlen kişiyi kayıt eder.",
            usage: "kayıt @MODLOFF/ID İsim Yaş",
            category: "Registery",
            aliases: ["k","kayit"],
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
        if (!roller.teyitciRolleri.some(rolebakaq => message.member.roles.cache.has(rolebakaq)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${cevaplar.YetkinYetmiyor}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if (!uye) return message.reply({ content: `${cevaplar.ÜyeYok}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let uyarısıVar = await Punitives.findOne({Member: uye.id, Type: "Uyarılma"})
        if(message.author.id === uye.id) return message.reply({ content: `${cevaplar.Kendisi}` }).then(x => { setTimeout(() => {x.delete()}, 5000)})
        if(uye.user.bot) return message.reply({ content: `${cevaplar.Bot}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(!uye.manageable) return message.reply({ content: `${cevaplar.Dokunulmaz}` }).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
        if(roller.erkekRolleri.some(x => uye.roles.cache.has(x))) return message.reply({ content: `${cevaplar.Kayıtlı}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(roller.kadınRolleri.some(x => uye.roles.cache.has(x))) return message.reply({ content: `${cevaplar.Kayıtlı}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply({ content: `${cevaplar.YetkiÜst}` }).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
        if(ayarlar.taglıalım && ayarlar.taglıalım != false && !uye.user.displayName.includes(ayarlar.tag) && !uye.roles.cache.has(roller.boosterRolü) && !uye.roles.cache.has(roller.vipRolü) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply({ content: `${cevaplar.TaglıAlım}` }).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
        if(ayarlar.teyitZorunlu && !uye.voice.channel && !uye.roles.cache.has(roller.boosterRolü) && !uye.roles.cache.has(roller.vipRolü) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Sunucu.Iptal)} **${message.guild.name}** sunucusunda **Ses Teyit** zorunluluğu bulunduğundan dolayı ${uye} isimli üyenin kayıt işlemi \`${tarihsel(Date.now())}\` tarihinde iptal edildi.`).setFooter({ text:`Belirtilen üyenin seste bulunmasıyla, tekrardan teyit alınabilir.` })]}).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Sunucu.Iptal) ? message.guild.emojiGöster(emojiler.Sunucu.Iptal).id : undefined).catch(err => {})
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 15000);
        })
        if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7 && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.yenihesap).then(x => { setTimeout(() => {x.delete()}, 5000)})
        if(uye.roles.cache.has(roller.şüpheliRolü) && uye.roles.cache.has(roller.jailRolü) && uye.roles.cache.has(roller.underworldRolü) &&  uye.roles.cache.has(roller.yasaklıTagRolü) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.cezaliüye).then(x => x.delete({timeout: 5000}))   
        args = args.filter(a => a !== "" && a !== " ").splice(1);
        let setName;
        let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
        if(!isim) return message.reply({ content: `${cevaplar.Argüman}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
        if(!yaş) return message.reply({ content: `${cevaplar.Argüman}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if (yaş < ayarlar.minYaş) return message.reply({ content: `${cevaplar.YetersizYaş}` }).then(x => { setTimeout(() => {x.delete()}, 5000)})
        if(!yaş) {
            setName = `${uye.user.displayName.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${isim}`;
        } else {
            setName = `${uye.user.displayName.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${isim} | ${yaş}`;
        }
        uye.setNickname(`${setName}`).catch(err => message.reply({ content:`İsim çok uzun.` }))
        let cezaPuanı = await uye.cezaPuan()
        if(cezaPuanı >= 100 && !message.member.permissions.has(PermissionsBitField.Flags.Administrator) && (roller.sorunÇözmeciler && !roller.sorunÇözmeciler.some(x => message.member.roles.cache.has(x))) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply({
            embeds: [embed.setDescription(`Belirlenen ${uye} isimli üyenin ceza puanı 100'ün üzerinde olduğu için kayıt işlemi alınamıyor.
Bir itirazınız var ise ${roller.sorunÇözmeciler ? roller.sorunÇözmeciler.filter(x => message.guild.roles.cache.has(x)).map(x => message.guild.roles.cache.get(x)).join(", ") : roller.altYönetimRolleri.filter(x => message.guild.roles.cache.has(x)).map(x => message.guild.roles.cache.get(x)).join(", ")} rolü ve üstündeki rollerden herhangi bir yetkiliye ulaşınız ve durumu onlara da anlatınız.`)]
        }).then(x => { 
            message.react(message.guild.emojiGöster(emojiler.Sunucu.Iptal) ? message.guild.emojiGöster(emojiler.Sunucu.Iptal).id : undefined).catch(err => {})
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 15000)
        })
        if (uyarısıVar) {
            embed.setDescription(`${uye} kişisinin ismi \` ${setName} \` olarak değiştirildi. \n Bu üyenin birden fazla cezası veya uyarısı vardır!`)
        } else {
            embed.setDescription(`${uye} kişisinin ismi \` ${setName} \` olarak değiştirildi.`)
        }
        const cinsiyetseç = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`erkekyaaa`).setLabel(`Erkek`).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`karimdakarim`).setLabel(`Kadın`).setStyle(ButtonStyle.Danger)
        )
        let regPanel = await message.reply({ embeds: [embed], components: [cinsiyetseç], ephemeral: true })
        var filter = i => i.user.id === message.author.id ;
        let collector = await regPanel.createMessageComponentCollector({ filter, time: 30000 })
        collector.on("collect", async i => {
            if (i.customId === "erkekyaaa") {
                await regPanel.edit({ 
                    embeds: [
                        embed.setDescription(`${uye} kişisinin ismi \` ${setName} \` olarak değiştirildi. \n\n **ERKEK** olarak kayıt edildi!`)
                    ],
                    components: []
                })
                uye.Register(`${setName}`, "Erkek", message.member);
                //client.Upstaffs.addPoint(message.member.id,_statSystem.points.record, "Kayıt")
                message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined)
            }
            if (i.customId === "karimdakarim") {
                await regPanel.edit({ 
                    embeds: [
                        embed.setDescription(`${uye} kişisinin ismi \` ${setName} \` olarak değiştirildi. \n\n **KADIN** olarak kayıt edildi!`)
                    ],
                    components: []
                })
                uye.Register(`${setName}`, "Kadın", message.member);
                message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined)
            }
        })
    }
}

module.exports = Kayıt
