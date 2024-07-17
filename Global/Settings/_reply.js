const red = `${client.guilds.cache.get(global.sistem.Settings.guildID).emojiGöster(emojiler.Sunucu.Iptal)}`

module.exports = {
    YetkinYetmiyor: `${red} Bu komutu kullanabilmek için herhangi bir yetkiye sahip değilsin!`,
    ÜyeYok: `${red} Belirtilen kişiyi sunucuda bulamadım.`,
    Kendisi: `${red} Belirtilen kişi kendisi olduğu için işlemi gerçekleştirmiyorum.`,
    Bot : `${red} Belirtilen kişi bot olduğu için işlemi gerçekleştirmiyorum.`,
    Kendisi: `${red} Belirtilen kişinin yetkisi benden üstün olduğu için işlemi gerçekleştiremiyorum.`,
    Kayıtlı: `${red} Belirtilen kişi zaten kayıtlı olduğu için işlemi iptal ediyorum.`,
    YetkiÜst: `${red} Belirtilen kişi seninle aynı yetkide veya senden üstün olduğu için işlemi gerçekleştiremiyorum.`,
    TaglıAlım: `${red} Belirtilen kişinin adında \`${ayarlar.tag}\` bulunmadığı için işlemi iptal ediyorum.`,
    Argüman: `${red} Belirtilen argümanlar geçersiz olduğu için devam edilemiyor.`,
    YetersizYaş: `${red} Belirtilen kullanıcının yaşı ${ayarlar ? ayarlar.minYaş : 0}'den küçük olduğu için kayıt işlemi yapılamıyor. `,
    HakBitti : `${red} Kullanım hakkınız dolduğu için işleminiz iptal edildi.`,
    Sebep: `${red} İşlemi devam ettirmek için sebep belirtiniz.`,
    Kayıtsız: `${red} Bu kullanıcı zaten kayıtsızda o yüzden işlemi iptal ediyorum.`,

}