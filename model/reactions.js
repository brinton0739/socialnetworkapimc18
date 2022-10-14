const mongoose = require("mongoose");
const { Schema, SchemaTypes, Types } = mongoose;

const timeGetter = (timestamp) => {
  return timestamp.toISOString().replace("T", " ").substr(0, 19)
}

const reactionSchema = new Schema(
  {
    reactionId: {
      type: SchemaTypes.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
      get: timeGetter
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    toObject: {
      getters: true
    },
  }
);

module.exports = reactionSchema;
