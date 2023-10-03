const mongoose = require("mongoose");

let schema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            default: Date.now,
        },
        email: {
            type: String,
            require: true,
        }
    },
    { collation: { locale: "en" } }
);

module.exports = mongoose.model("list", schema);
