const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const { genEmbed } = require('../../../../Global/Source/Embed');
const client = global.client;
class Aktivite extends Command {
    constructor(client) {
        super(client, {
            name: "aktivite",
            description: "Ses kanallarında oyun oynamınızı sağlar.",
            usage: ".aktivite <>",
            category: "Kullanıcı",
            aliases: ["together"],
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
        if (!message.member.voice.channel) return message.reply({ content: `Herhangi bir ses kanalı bağlı değilsin, Üzgünüm!` }).then(s => { 
            message.react(message.guild.emojiGöster(emojiler.Sunucu.Iptal))
            setTimeout(() => s.delete().catch(err => {}), 5000)
        });
        const oyunSeç = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId("oyunlar")
            .setPlaceholder("Aktiviteni seç!")
        )

    }
}

module.exports = Aktivite
