const sayilariCevir = global.sayilariCevir = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const sayılıEmoji = global.sayılıEmoji = function(sayi) {
    var basamakbir = sayi.toString().replace(/ /g, "     ");
    var basamakiki = basamakbir.match(/([0-9])/g);
    basamakbir = basamakbir.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
    if (basamakiki) {
      if(ayarlar.sayılıEmoji) {
        basamakbir = basamakbir.replace(/([0-9])/g, d => {
          return {
                  "0": client.guilds.cache.get(global.sistem.Settings.guildID).emojiGöster(emojiler.Sayılar.Sıfır),
                  "1": client.guilds.cache.get(global.sistem.Settings.guildID).emojiGöster(emojiler.Sayılar.Bir),
                  "2": client.guilds.cache.get(global.sistem.Settings.guildID).emojiGöster(emojiler.Sayılar.İki),
                  "3": client.guilds.cache.get(global.sistem.Settings.guildID).emojiGöster(emojiler.Sayılar.Üç),
                  "4": client.guilds.cache.get(global.sistem.Settings.guildID).emojiGöster(emojiler.Sayılar.Dört),
                  "5": client.guilds.cache.get(global.sistem.Settings.guildID).emojiGöster(emojiler.Sayılar.Beş),
                  "6": client.guilds.cache.get(global.sistem.Settings.guildID).emojiGöster(emojiler.Sayılar.Altı),
                  "7": client.guilds.cache.get(global.sistem.Settings.guildID).emojiGöster(emojiler.Sayılar.Yedi),
                  "8": client.guilds.cache.get(global.sistem.Settings.guildID).emojiGöster(emojiler.Sayılar.Sekiz),
                  "9": client.guilds.cache.get(global.sistem.Settings.guildID).emojiGöster(emojiler.Sayılar.Dokuz)
          }[d];
      });
      } else {
        basamakbir = basamakbir.replace(/([0-9])/g, d => {
            return {
                "0": "0",
                "1": "1",
                "2": "2",
                "3": "3",
                "4": "4",
                "5": "5",
                "6": "6",
                "7": "7",
                "8": "8",
                "9": "9"
            }[d];
        });
      }
    }
    return basamakbir;
  }
  
  Array.prototype.chunk = function(chunk_size) {
    let myArray = Array.from(this);
    let tempArray = [];
    for (let index = 0; index < myArray.length; index += chunk_size) {
      let chunk = myArray.slice(index, index + chunk_size);
      tempArray.push(chunk);
    }
    return tempArray;
  };
  
  Array.prototype.shuffle = function () {
    let i = this.length;
    while (i) {
      let j = Math.floor(Math.random() * i);
      let t = this[--i];
      this[i] = this[j];
      this[j] = t;
    }
    return this;
  };