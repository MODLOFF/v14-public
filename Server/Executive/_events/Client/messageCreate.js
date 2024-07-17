const { Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Event } = require("../../../../Global/Client/Structures/Default.Event");
const cooldown = new Collection();
const ms = require('ms');
const { genEmbed } = require("../../../../Global/Source/Embed")
class messageCreate extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            enabled: true,
        });
    }
    
    onLoad(message) {
        if (message.author.bot || !global.sistem.Settings.prefix.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type != 0) return;
        let args = message.content.substring(global.sistem.Settings.prefix.some(x => x.length)).split(" ");
        let _find = args[0].toLocaleLowerCase()
        args = args.splice(1);
        let command = client.commands.get(_find) || client.aliases.get(_find);
        let embed = new EmbedBuilder().setColor("Random").setAuthor({
            name: message.member.user.tag,
            iconURL: message.member.user.avatarURL({ dynamic: true, size: 1024 })
        })
        if(message.member.roles.cache.has(roller.jailRolü) || message.member.roles.cache.has(roller.şüpheliRolü) || message.member.roles.cache.has(roller.underworldRolü) || message.member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => message.member.roles.cache.has(rol)))) return;

        if(command) {
            if(command.permissions && command.permissions.length > 0) {
                if((command.permissions.includes("GUILD_OWNER") && message.guild.ownerId != message.author.id) 
                && (command.permissions.includes("BOT_OWNER") && !global.sistem.Settings.root.includes(message.author.id)) &&
                (!command.permissions.filter(x => x != "GUILD_OWNER" && x != "BOT_OWNER" ).some(perm => message.member.permissions.has(perm) || message.member.roles.cache.has(perm) || message.author.id == perm))) return message.reply({embeds: [embed.setDescription(`Bu komutu kullanabilmek için yeterli bir yetkiye sahip değilsin.`)]}).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch(err => {})
                    }, 5000)
                });
            }
            
            if(command.cooldown && cooldown.has(`${command.name}${message.author.id}`)) return message.reply({embeds: [embed.setDescription(`Bu komutu <t:${String(cooldown.get(`${command.name}${message.author.id}`)).slice(0, 10)}:R> kullanabilirsiniz.`)]}).then(msg => {
                setTimeout(() => {
                    msg.delete().catch(err => {})
                }, 5000)
            });
        
            command.onRequest(client, message, args)
            if(message.guild.ownerId != message.author.id && !global.sistem.Settings.root.includes(message.author.id) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
                setTimeout(() => {
                    cooldown.delete(`${command.name}${message.author.id}`)
                }, command.cooldown);
            }
        }
        
    }
}

module.exports = messageCreate