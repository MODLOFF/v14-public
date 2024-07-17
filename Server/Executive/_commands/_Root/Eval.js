const { Command } = require("../../../../Global/Client/Structures/Default.Command");

class Eval extends Command {
    constructor(client) {
        super(client, {
            name: "heval",
            description: "Botda komut denememizi sağlayan komutudur.",
            usage: "Bot için komut denememizi sağlayan komutdur.",
            category: "Root",
            aliases: ["hewal"],
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

    async onRequest (client, message, args) {
        if (!args[0]) return;
        let code = args.join(" ");
    
        try {
          var result = clean(await eval(code));
          if (result.includes(client.token))
            return message.channel.send({ content: "Tokeni yarramın başını yersen alırsın orospu evladı"});
            message.channel.send({ content: `\`\`\`js\n${result}\n\`\`\``});
        } catch (e) {
                return message.channel.send({ content: `\`\`\`js\n${e}\n\`\`\`` });
            }
    }
}

function clean(text) {
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 0 });
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
    return text;
  }

module.exports = Eval
