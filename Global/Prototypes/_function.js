const { Client, Guild, Collection } = require("discord.js")

Guild.prototype.rolBul = function(content) {
    
    let rol = this.roles.cache.find(r => r.name === content) || this.roles.cache.find(r => r.id === content)
    if(!rol) return client._logger.log(`${content} rolünü ${this.name} sunucusun da aradım fakat bulamadım.`,"error");
    return rol;
}

Guild.prototype.kanalBul = function(content) {
    let kanal = this.channels.cache.find(k => k.name === content) || this.channels.cache.find(k => k.id === content) || this.client.channels.cache.find(e => e.id === content) || this.client.channels.cache.find(e => e.name === content)
    if(!kanal) return client._logger.log(`${content} kanalını ${this.name} sunucusun da aradım fakat bulamadım.`,"error");
    return kanal;

}

Guild.prototype.emojiGöster = function(content) {
    let emoji = this.emojis.cache.find(e => e.name === content) || this.emojis.cache.find(e => e.id === content) 
    if(!emoji) {
        if(this.client.emojis.cache.find(e => e.id === content) || this.client.emojis.cache.find(e => e.name === content)) {
            let emojicik = this.client.emojis.cache.find(e => e.id === content) || this.client.emojis.cache.find(e => e.name === content)
            if(!emojicik) return '#EmojiBulunamadı';
            if(emojicik.animated) return `<a:${emojicik.name}:${emojicik.id}>`;
            return `<:${emojicik.name}:${emojicik.id}>`;
        }
    }
    return emoji;
}

Collection.prototype.array = function () {
    return [...this.values()]
  }

Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.listRoles = function () {
    return this.length > 1 ? this.slice(0, -1).map((x) => `${x}`).join(", ") + " ve " + this.map((x) => `${x}`).slice(-1) : this.map((x) => `${x}`).join("");
};
