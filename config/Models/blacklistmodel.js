const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blacklistModel = new Schema({
    word: {
        type: String,
        required: true
    },
    modid: {
        type: String,
        required: true
    },
    kindofcheck: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Blword = mongoose.model('Blword', blacklistModel);

module.exports = Blword;