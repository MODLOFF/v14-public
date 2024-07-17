
const { PermissionsBitField } = require('discord.js');
const { Command } = require("../../../../Global/Client/Structures/Default.Command");

class Example extends Command {
    constructor(client) {
        super(client, {
            name: "example",
            description: "Bu bir deneme komutdur.",
            usage: "Kullanımı çok basittir bence denemelisin.",
            category: "Others",
            aliases: ["ex","exa"],
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

    onRequest (client, message, args) {
       message.reply({content: `Ben bir denemeyim. ${args && args.length > 0 ? `Bana verilen argümanlar: ${args.map(x => x).join(", ")}`: "Argüman eklememişsin."}`})
       .then(x => {
            setTimeout(() => {
                x.delete().catch(err => {}) 
            }, 7500)
        })
    }
}

module.exports = Example
