const { EmbedBuilder } = require('discord.js')
const sistem = require("../Settings/_system.json")

class genEmbed extends EmbedBuilder {
    constructor(option) {
        super(option)
        let guild = client.guilds.cache.get(sistem.Settings.guildID)
        if(guild) {
            this.setAuthor({name: guild.name, iconURL: guild.iconURL({dynamic: true, size: 2048})})
            this.setColor("Random")
        } else {
            this.setColor("Random")
        }
    }

}

module.exports = { genEmbed }
