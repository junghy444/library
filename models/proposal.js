const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("proposal", ProposalSchema);
