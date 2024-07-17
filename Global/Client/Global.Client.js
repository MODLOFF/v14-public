const { Client, GatewayIntentBits, Partials, Collection, ApplicationCommandType } = require("discord.js")
const { GUILD } = require('../Source/Settings');
const { black } = require("chalk");
global.sistem = global.system = require('../Settings/_system.json');
const fs = require('fs');
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

class MODLOFF extends Client {
    constructor(options) {
        /**
        * 
        * @param {Object} options
        * @returns {Promise<Client>}
        * 
        */
        super({
            options,
            intents: Object.keys(GatewayIntentBits),
            partials: Object.keys(Partials)
        })
        
        this._logger = require("../Functions/Logger")
        require("../Functions/Dates")
        this.genEmbed = global.genEmbed = require("../Source/Embed")
        this.sistem = this.system = require("../Settings/_system.json")
        GUILD.fetch(this.sistem.Settings.guildID)
        this.commands = new Collection()
        this.aliases = new Collection()
        this.slashcommands = new Collection()
        this._dirname;
        this.prefix = ["."]
        this.on("disconnect", () => this._logger.log("Bot is disconnecting...", "disconnecting"))
        .on("reconnecting", () => this._logger.log("Bot reconnecting...", "reconnecting"))
        .on("error", (e) => this._logger.log(e, "error"))
        .on("warn", (info) => this._logger.log(info, "warn"));

       // process.on("unhandledRejection", (err) => { this._logger.log(err, "caution") });
        process.on("warning", (warn) => { this._logger.log(warn, "varn") });
      
        process.on("uncaughtException", err => {
            const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
            console.error("Beklenmedik Hata: ", hata);
        });

        require("../Functions/Numbers")
        require("../Prototypes/_function")
        require('../Prototypes/_user');
    }
    async fetchCommands(active = true, slash = false) {
        if(slash) {
            const slashcommands = await globPromise(`../../Server/${this._dirname}/_slashcommands/*/*.js`);
            const arrSlash = [];
            slashcommands.map((value) => {
                const file = require(value);
                if (!file?.name) return;
                this.slashcommands.set(file.name, file);
        
                if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
                arrSlash.push(file);
                
            });
            this.on("ready", async () => {
                client.guilds.cache.map(async (x) => {
                    x.commands.set(arrSlash);
                })
                this._logger.log(`${arrSlash.length} Slash Command(s) loaded.`, "ready")
            })
        }
        if(!active) return;
        let dirs = fs.readdirSync(`./_commands`, { encoding: "utf8" });
        this._logger.log(`${black.bgHex('#D9A384') (this._dirname.toUpperCase())} ${dirs.length} category in client loaded.`, "category");
        dirs.forEach(dir => {
            let files = fs.readdirSync(`../../Server/${this._dirname}/_commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            this._logger.log(`${black.bgHex('#D9A384') (this._dirname.toUpperCase())} ${files.length} commands loaded in ${dir} category.`, "load");
            files.forEach(file => {
                const cmd = new (require(`../../Server/${this._dirname}/_commands/${dir}/${file}`))(client);
                if(cmd) cmd.on()
            });
        });
    }

    async fetchEvents(active = true) {
        if(!active) return;
        let dirs = fs.readdirSync('./_events', { encoding: "utf8" });
        dirs.forEach(dir => {
            let files = fs.readdirSync(`../../Server/${this._dirname}/_events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            files.forEach(file => {
                const events = new (require(`../../Server/${this._dirname}/_events/${dir}/${file}`))(client);
                if(events) events.on();
            });
        });
    }
    async connect(token) {
     
        if(!token) {
            this._logger.log(`${black.bgHex('#D9A384')(this._dirname.toUpperCase())} Tokeni girilmediğinden dolayı bot kapanıyor...`,"error");
            process.exit()
            return;
        }
                await this.login(token)
                .then(a => {
                 
                }).catch(err => {
                    this._logger.log(`${black.bgHex('#D9A384')(this._dirname.toUpperCase())} Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir...`,"reconnecting")
                    setTimeout(() => {
                        this.login().catch(acar => {
                            this._logger.log(`${black.bgHex('#D9A384')(this._dirname.toUpperCase())} => Bot tokeni tamamiyle doğrulanamadı.. Bot kapanıyor...`,"error")
                            process.exit()
                        })
                    }, 5000)
                }).catch(err => {
                this._logger.log("MongoDB Bağlantısı Başarısız.", "error")
                process.exit();
            })
        
    }
}

module.exports = { MODLOFF }