const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const fs = require('fs')

const sistem = global.sistem = require('../Settings/_system.json');
const { GUILD } = require('../../Global/Source/Settings');

// SENKRON
const GUARD_SETTINGS = require('../../Global/Database/Schemas/Guards/Global.Guard.Settings');
const GUILD_SETTINGS = require('../../Global/Database/Schemas/Guild.Settings');
// SENKRON

// GUARD LİMİT
const ms = require('ms');
const dataLimit = new Map()
// GUARD LİMİT

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

    async checkMember(id, type, process = "İşlem Bulunamadı.") {
        let guild = this.guilds.cache.get(sistem.Settings.guildID)
        if(!guild) return false;
        let uye = guild.members.cache.get(id)
        if(!uye) return;
        let Whitelist = await GUARD_SETTINGS.findOne({guildID: sistem.Settings.guildID})
        let Sunucu = await GUILD_SETTINGS.findOne({guildID: sistem.Settings.guildID})
        if(!Sunucu) return false;
        if(!Whitelist) return false;
        let guildSettings = Sunucu.Ayarlar
        if(!guildSettings) return false;
        if(!Whitelist.guildProtection) return true;
        if(uye.id === this.user.id || uye.id === uye.guild.ownerId || Whitelist.unManageable.some(g => uye.id === g || uye.roles.cache.has(g)) || Whitelist.BOTS.some(g => uye.id === g || uye.roles.cache.has(g))|| guildSettings.staff.includes(uye.id)) return true; 
        if(!type) return false;
        switch (type) {
            case "guild": {
                if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.guildAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                return false;
            }
            case "emoji": {
                if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.emojiAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                return false;
            }
            case "bot": {
                if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.botAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                return false;
            }
            case "member": {
                if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.memberAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                return false;
            }
            case "channels": {
                if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.channelsAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                return false;
            }
            case "roles": {
                if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.rolesAcess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                return false;
            }
        }
        return false;
    }

    async checkProcessLimit(uye, limit, zaman, process) {
        let id = uye.id
        let limitController = dataLimit.get(id) || []
        let type = { _id: id, proc: process, date: Date.now() }
        let Whitelist = await GUARD_SETTINGS.findOne({guildID: sistem.Settings.guildID})
        if(!Whitelist.limit) return true;
        limitController.push(type)
        dataLimit.set(id, limitController)
        setTimeout(() => { if (dataLimit.has(id)) { dataLimit.delete(id) } }, ms(zaman))
        if (limitController.length >= limit) { 
            let loged = uye.guild.kanalBul("guard-log");
            let taslak = `${uye} (\`${uye.id}\`) isimli güvenli listesinde ki yönetici işlem sınırını aştığı için "__${process}__" zoruyla cezalandırıldı.
\`\`\`fix
Son Yapılan işlemleri;
${limitController.sort((a, b) => b.date - a.date).map((x, index) => `${index+1}. | ${x.proc} | ${tarihsel(x.date)}`).join("\n")}
            \`\`\``
            if(loged) loged.send(taslak);
            let taç = uye.guild.members.cache.get(uye.guild.ownerId)
            if(taç) taç.send(taslak).catch(err => {})
            return false 
        } else {
            return true
        }
    }    
    async processGuard(opt) {
        await GUARD_SETTINGS.updateOne({guildID: sistem.Settings.guildID}, {$push: {
            "Process": {
                date: Date.now(),
                type: opt.type,
                target: opt.target,
                member: opt.member ? opt.member : undefined,
            }
        }}, {upsert: true});
    }
    async queryManage(oldData, newData) {
        const guildSettings = require('../Database/Schemas/Guild.Settings');
        let veriData = await guildSettings.findOne({ guildID: sistem.Settings.guildID })
        let sunucuData = veriData.Ayarlar 
        if(sunucuData) {              
            if(oldData === sunucuData.tagRolü) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.tagRolü": newData}})
            }
            if(oldData === sunucuData.muteRolü) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.muteRolü": newData}})
            }
            if(oldData === sunucuData.jailRolü) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.jailRolü": newData}})
            }
            if(oldData === sunucuData.şüpheliRolü) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.şüpheliRolü": newData}})
            }
            if(oldData === sunucuData.yasaklıTagRolü) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.yasaklıTagRolü": newData}})
            }
            if(oldData === sunucuData.vipRolü) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.vipRolü": newData}})
            }
            if(oldData === sunucuData.Katıldı) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.Katıldı": newData}})
            }
            if(oldData === sunucuData.altilkyetki) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.altilkyetki": newData}})
            }
            if(oldData === sunucuData.etkinlikKatılımcısı) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.etkinlikKatılımcısı": newData}})
            }
            if(oldData === sunucuData.cekilisKatılımcısı) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.cekilisKatılımcısı": newData}})
            }
            if(oldData === sunucuData.TerfiLog) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.TerfiLog": newData}})
            }
            if(oldData === sunucuData.kurallarKanalı) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.kurallarKanalı": newData}})
            }
            if(oldData === sunucuData.hoşgeldinKanalı) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.hoşgeldinKanalı": newData}})
            }
            if(oldData === sunucuData.chatKanalı) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.chatKanalı": newData}})
            }
            if(oldData === sunucuData.toplantıKanalı) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.toplantıKanalı": newData}})
            }
            if(oldData === sunucuData.davetKanalı) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.davetKanalı": newData}})
            }
            if(oldData === sunucuData.publicKategorisi) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.publicKategorisi": newData}})
            }
            if(oldData === sunucuData.registerKategorisi) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.registerKategorisi": newData}})
            }
            if(oldData === sunucuData.streamerKategorisi) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.streamerKategorisi": newData}})
            }
            if(oldData === sunucuData.photoChatKanalı) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.photoChatKanalı": newData}})
            }
            if(oldData === sunucuData.sleepRoom) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.sleepRoom": newData}})
            }
            if(oldData === sunucuData.başlangıçYetki) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$set: {"Ayarlar.başlangıçYetki": newData}})
            }
            if(sunucuData.erkekRolleri.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.erkekRolleri": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.erkekRolleri": newData}})
            }
            if(sunucuData.kadınRolleri.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.kadınRolleri": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.kadınRolleri": newData}})
            }
            if(sunucuData.kayıtsızRolleri.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.kayıtsızRolleri": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.kayıtsızRolleri": newData}})
            }
            if(sunucuData.Yetkiler.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.Yetkiler": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.Yetkiler": newData}})
            }
            if(sunucuData.teyitciRolleri.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.teyitciRolleri": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.teyitciRolleri": newData}})
            }
            if(sunucuData.kurucuRolleri.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.kurucuRolleri": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.kurucuRolleri": newData}})
            }
            if(sunucuData.ayrıkKanallar.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.ayrıkKanallar": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.ayrıkKanallar": newData}})
            }
            if(sunucuData.izinliKanallar.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.izinliKanallar": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.izinliKanallar": newData}})
            }
            if(sunucuData.rolPanelRolleri.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.rolPanelRolleri": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.rolPanelRolleri": newData}})
            }
            if(sunucuData.üstYönetimRolleri.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.üstYönetimRolleri": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.üstYönetimRolleri": newData}})
            }
            if(sunucuData.altYönetimRolleri.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.altYönetimRolleri": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.altYönetimRolleri": newData}})
            }
            if(sunucuData.yönetimRolleri.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.yönetimRolleri": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.yönetimRolleri": newData}})
            }

            if(sunucuData.banHammer.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.banHammer": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.banHammer": newData}})
            }
            if(sunucuData.jailHammer.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.jailHammer": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.jailHammer": newData}})
            }
            if(sunucuData.voiceMuteHammer.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.voiceMuteHammer": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.voiceMuteHammer": newData}})
            }
            if(sunucuData.muteHammer.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.muteHammer": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.muteHammer": newData}})
            }

            if(sunucuData.warnHammer.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.warnHammer": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.warnHammer": newData}})
            }
            if(sunucuData.coinChat.includes(oldData)) {
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$pull: {"Ayarlar.coinChat": oldData}})
                await guildSettings.updateOne({guildID: sistem.Settings.guildID}, {$push: {"Ayarlar.coinChat": newData}})
            }       
        }
    }

   async punitivesAdd(id, type) {
        let guild = client.guilds.cache.get(sistem.Settings.guildID)
        if(!guild) return;
        let uye = guild.members.cache.get(id)
        if (!uye) return;
        if (type == "jail") { 
            if(uye.voice.channel) uye.voice.disconnect().catch(err => {})
            return uye.setRoles(roller.şüpheliRolü)
        }
        if (type == "ban") return uye.ban({ reason: "Guard tarafından sikildi!" }).catch(async (err) => {
      
        }) 
    };

    async allPermissionClose() {
        const Roles = require('../Database/Schemas/Guards/Guild.Protection.Roles.Backup');
        let sunucu = client.guilds.cache.get(sistem.Settings.guildID);
        if(!sunucu) return;
        
        const perms = [
            PermissionFlagsBits.Administrator, PermissionFlagsBits.ManageRoles, 
            PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageGuild, 
            PermissionFlagsBits.BanMembers, PermissionFlagsBits.KickMembers, 
            PermissionFlagsBits.ManageNicknames, PermissionFlagsBits.ManageWebhooks,
            PermissionFlagsBits.ManageGuildExpressions
        ];
        let roller = sunucu.roles.cache.filter(rol => rol.editable).filter(rol => perms.some(yetki => rol.permissions.has(yetki)))
        roller.forEach(async (rol) => {
            await Roles.updateOne({Role: rol.id}, {$set: {"guildID": sunucu.id, Reason: "Guard Tarafından Kapatıldı!", "Permissions": rol.permissions.bitfield }}, {upsert: true})
            await rol.setPermissions(0n)
        });
        if (roller) {
        let aclankapiyi = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setLabel("Rol İzinleri Aktif Et")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("proc_off")
            .setEmoji("943285259733184592")
        )
        let kanal = sunucu.kanalBul("guard-log")
        const owner = sunucu.members.cache.get(sunucu.ownerId)
        }
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