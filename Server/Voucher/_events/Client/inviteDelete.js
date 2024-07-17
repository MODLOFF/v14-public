const { Event } = require("../../../../Global/Client/Structures/Default.Event");

class inviteDelete extends Event {
    constructor(client) {
        super(client, {
            name: "inviteDelete",
            enabled: true,
        });    
    }

    /**
    * @param {Invite} invite
    * @returns {Promise<void>}
    */

    async onLoad(invite) {
        const invites = await invite.guild.invites.fetch();
        if (!invites) return;
      
        invites.delete(invite.code);
        client.invites.delete(invite.guild.id, invites);
    }
}    

module.exports = inviteDelete;