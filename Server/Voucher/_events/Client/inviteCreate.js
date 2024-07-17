const { Event } = require("../../../../Global/Client/Structures/Default.Event");

class inviteCreate extends Event {
    constructor(client) {
        super(client, {
            name: "inviteCreate",
            enabled: true,
        });    
    }

    /**
    * @param {Invite} invite
    * @returns {Promise<void>}
    */

    async onLoad(invite) {
        const invites = await invite.guild.invites.fetch();

        const codeUses = new Map();
        invites.each(inv => codeUses.set(inv.code, inv.uses));
      
        client.invites.set(invite.guild.id, codeUses);
    }
}    

module.exports = inviteCreate;