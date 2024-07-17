const { MODLOFF } = require('../../Global/Client/Global.Client');
const { Mongoose } = require("../../Global/Database/Global.MongoDriver")
const { GUILD } = require("../../Global/Source/Settings")
const client = global.client = new MODLOFF()
const Marsy = require('marsy.js');
const marsy = global.marsy = new Marsy.Client({
    license: "=mgDELeCGqBVXaLideTIrM726YlPRdnkC"
  });
  
client._dirname = "Moderation"

marsy.on('ready', async () => {
    console.log("Marsy.Live API sistemi başlatıldı.");
  })

Mongoose.Connect()
GUILD.fetch(sistem.Settings.guildID)

client.fetchCommands(true, true);
client.fetchEvents()
client.connect(sistem.Login.Moderation)


