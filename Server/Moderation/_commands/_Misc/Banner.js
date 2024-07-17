const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const { genEmbed } = require('../../../../Global/Source/Embed');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const axios = require('axios');
class Banner extends Command {
    constructor(client) {
        super(client, {
            name: "banner",
            description: "Belirtilen üyenin afişini büyültür.",
            usage: ".avatar <@MODLOFF/ID>",
            category: "Kullanıcı",
            aliases: ["arkaplan","arkap"],
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
        let üye =  args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author
        async function bannerXd(user, client) {
            const response = await axios.get(`https://discord.com/api/v10/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
            if(!response.data.banner) return `https://media.discordapp.net/attachments/938786568175513660/972982817359274024/Banner_bulunmamakta.png`
            if(response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
            else return(`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)
          
          }
          let banner = await bannerXd(üye.id, client)
        embed
            .setAuthor({name: üye.displayName ,iconURL : üye.displayAvatarURL({ dynamic: true, size: 4096 })})
            .setImage(banner)
          let urlButton = new ButtonBuilder()
        .setURL(`${banner}`)
        .setLabel(`Resim Adresi`)
        .setStyle(ButtonStyle.Link)    
        let urlOptions = new ActionRowBuilder().addComponents(
            urlButton
        );
        let uye = message.guild.members.cache.get(üye.id)
        if(uye) uye._views()
        message.reply({embeds: [embed], components: [urlOptions]});
    }
}

module.exports = Banner
