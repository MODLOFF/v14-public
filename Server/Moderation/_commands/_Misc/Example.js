const { Command } = require("../../../../Global/Client/Structures/Default.Command");
const { genEmbed } = require('../../../../Global/Source/Embed');

class Adver extends Command {
    constructor(client) {
        super(client, {
            name: "example",
            description: "",
            usage: "",
            category: "",
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
    
    }

    async onRequest (client, message, args) {

    }
}

module.exports = Adver
