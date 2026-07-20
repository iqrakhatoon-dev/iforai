const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "Token is required"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const BlacklistTokenModel = mongoose.model(
  "BlacklistToken",
  blacklistTokenSchema,
);

module.exports = BlacklistTokenModel;
