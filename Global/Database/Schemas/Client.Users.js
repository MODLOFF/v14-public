const mongoose = require("mongoose")

const users = mongoose.model('User', new mongoose.Schema({
    _id: String,
    Name: String,
    Gender: String,
    Roles: { type: Array },
    Biography: String,
    Friends: { type: Array, default: [] },
    Follower: { type: Array, default: [] },
    FollowUp: { type: Array, default: []},
    Likes: {type: Array, default: []},
    Badges: { type: Object },
    Views: { type: Number, default: 0 },
    Coin: { type: Number, default: 250, min: 0 },
    Gold: { type: Number, default: 1, min: 0 },
    Daily: { type: Number, default: 0 },
    Transfers: { type: Object },
    Inventory: { type: Object },
    Voices: {type: Array},
    Records: { type: Object },
    Tagged: { type: Boolean, default: false },
    Taggeds: { type: Object },
    Staff: { type: Boolean, default: false },
    Registrant: String,
    Responsibilitys: {type: Object, default: {}},
    TaggedGiveAdmin: String,
    StaffGiveAdmin: String,
    Staffs: { type: Object },
    staffCriminalPoint: {type: Number, default: 200},
    Uses: { type: Object },
    Names: { type: Object },
    StaffLogs: { type: Object },
    Meetings: Object,
    Streaming: Object,
    Notes: { type: Object }
}))

module.exports = users