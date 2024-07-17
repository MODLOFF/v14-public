const { Command } = require("../../../../Global/Client/Structures/Default.Command");

class EmojisCreate extends Command {
    constructor(client) {
        super(client, {
            name: "emojikur",
            description: "Bot emojilerini kurma komutudur.",
            usage: "Bot için gerekli emojileri kurma komutudur.",
            category: "Yönetici",
            aliases: ["emokur","emojilerim"],
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

    onRequest (client, message, args) {
        const kurulumEmojis = [
            { name : "", url : "" }
        ]

        const kurulumSayı = [
            { name : "", url : "" }
        ]

        kurulumEmojis.forEach(async (x) => {
            if (message.guild.emojis.cache.find((e) => x.name === e.name)) return;
            const kurEmojis = message.guild.emojis.crate({ attachment: x.url, name: x.name });
            message.channel.send({ content: `\` ${x.name} \` isimli emoji oluşturuldu (${kurEmojis.toString()})`})
        })

        kurulumSayı.forEach(async (x) => {
            if (message.guild.emojis.cache.find((e) => x.name === e.name)) return;
            const kurSayı = message.guild.emojis.crate({ attachment: x.url, name: x.name });
            message.channel.send({ content: `\` ${x.name} \` isimli emoji oluşturuldu (${kurSayı.toString()})`})
        })
    }
}

module.exports = EmojisCreate
