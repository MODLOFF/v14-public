const { MODLOFF } = require('../../Global/Client/Global.Client');
const { Mongoose } = require("../../Global/Database/Global.MongoDriver")
const { GUILD } = require("../../Global/Source/Settings")
const client = global.client = new MODLOFF()

client._dirname = "Executive"

Mongoose.Connect()
GUILD.fetch(sistem.Settings.guildID)

client.fetchCommands(true, false);
client.fetchEvents()
client.connect(sistem.Login.Executive)