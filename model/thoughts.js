const mongoose = require("mongoose");
const { Schema, SchemaTypes, Types } = mongoose;
const reactionSchema = require('./reactions');

const timeGetter = (timestamp) => {
  return timestamp.toISOString().replace("T", " ").substr(0, 19)
}

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
      get: timeGetter
    },
    username: {
      type: String,
    },
    reactions: [reactionSchema],
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

thoughtSchema.virtual("reactionCount").get(function() {
  if (this.reactions) {
    return this.reactions.length;
  }
  return 0;
});

const Thought = mongoose.model("thought", thoughtSchema);

module.exports = Thought;
