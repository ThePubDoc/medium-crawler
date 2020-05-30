const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    tag : String,
});

module.exports = History = mongoose.model("history", historySchema);