const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const { genEmbed } = require('../../../../Global/Source/Embed');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            description: "Belirtilen üyenin profil resmini büyültür.",
            usage: ".avatar <@MODLOFF/ID>",
            category: "Kullanıcı",
            aliases: ["av","pp"],
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
        let embed = new genEmbed()
        let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
        let avatar = victim.avatarURL({ dynamic: true, size: 2048 });
        let urlButton = new ButtonBuilder()
        .setURL(`${avatar}`)
        .setLabel(`Resim Adresi`)
        .setStyle(ButtonStyle.Link)    
        let urlOptions = new ActionRowBuilder().addComponents(
            urlButton
        );
        embed
            .setAuthor({name:victim.tag, iconURL :avatar})
            .setImage(avatar)
        let uye = message.guild.members.cache.get(victim.id)
        if(uye) uye._views()
        message.reply({embeds: [embed], components: [urlOptions]});
    }
}

module.exports = Avatar
