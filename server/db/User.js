const mongoose = require("mongoose");

let schema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        fname: {
            type: String,
            required: true,
        },
        lname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        registerDate: {
            type: Date,
            default: Date.now,
        }
    },
    { collation: { locale: "en" } }
);

module.exports = mongoose.model("user", schema);
