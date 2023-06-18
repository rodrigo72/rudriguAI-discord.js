const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ({
	userID: {
		type: String,
		required: true,
        unique: true
	},
    tag: {
        type: String,
        required: true
    },
    usageCount: {
        type: [Number],
        default: [0, 0, 0]
    },
    lastUpdated: {
        type: [Date],
        default: function() {
            return [new Date(), new Date(), new Date()];
        },
    },
    roles: {
        User: {
			type: Number,
			default: 1111,
		},
		LimitlessAI: {
            type: Number,
            default: 0
        },
		Admin: {
            type: Number,
            default: 0
        }
    }
});

module.exports = mongoose.model("User", userSchema);