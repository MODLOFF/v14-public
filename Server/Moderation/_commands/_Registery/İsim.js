const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const Users = require("../../../../Global/Database/Schemas/Client.Users")
const { genEmbed } = require('../../../../Global/Source/Embed');

class İsim extends Command {
    constructor(client) {
        super(client, {
            name: "isim",
            description: "Belirtilen üyenin ismini ve yaşını güncellemek için kullanılır.",
            usage: "isim <@sahane/ID> <İsim/Nick>",
            category: "Registery",
            aliases: ["i","nick"],
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
        if(message.author.id === uye.id) return message.reply({ content: `${cevaplar.Kendisi}` }).then(x => { setTimeout(() => {x.delete()}, 5000)})
        if(uye.user.bot) return message.reply({ content: `${cevaplar.Bot}` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(!uye.manageable) return message.reply({ content: `${cevaplar.Dokunulmaz}` }).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
        if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply({ content: `${cevaplar.YetkiÜst}` }).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
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
        let isimveri = await Users.findById(uye.id) || []
        let isimler = isimveri.Names ? isimveri.Names.length > 0 ? isimveri.Names.reverse().slice(0, 10).map((value, index) => `\`${value.Name}\` (${value.State}) ${value.Staff ? "(<@"+ value.Staff + ">)" : ""}`).join("\n") : "" : [] 
        uye.Rename(`${setName}`, message.member, "İsim Güncelleme")
        let isimLog = message.guild.kanalBul("isim-log")
        if(isimLog) isimLog.send({embeds: [embed.setDescription(`${uye} isimli üyenin ismi ${message.member} tarafından \`${tarihsel(Date.now())}\` tarihinde "${ayarlar.isimyas ? `${isim} | ${yas}` : `${isim}`}" olarak güncellendi.`)]})
        message.reply({embeds: [embed.setDescription(`${uye} üyesinin ismi "${setName}" olarak değiştirildi${isimveri.Names ? isimveri.Names.length > 0 ? 
`, bu üye daha önce bu isimlerle kayıt olmuş.\n\n${uye} üyesinin toplamda **${isimveri.Names.length}** isim kayıtı bulundu.
__Aşağıda son 10 işlem listelenmekte__
    
${isimler}\n\nÖnceki isimlerine \`.isimler <@MODLOFF/ID>\` komutuyla bakarak kayıt işlemini\n gerçekleştirmeniz önerilir.`
: "." : "."}`)]}).then(msg => {
            message.react(message.guild.emojiGöster(emojiler.Sunucu.Onay) ? message.guild.emojiGöster(emojiler.Sunucu.Onay).id : undefined);
        })
    }
}

module.exports = İsim
