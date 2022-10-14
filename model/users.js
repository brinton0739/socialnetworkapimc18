const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
const Thoughts = require('./thoughts');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  thoughts: [
    {
      type: SchemaTypes.ObjectId,
      ref: "Thought",
    },
  ],
  friends: [
    {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
  ],
},
{
    toJSON: {
        virtuals: true,
    }
});

userSchema
.virtual('friendCount')
.get(function() {
    if (this.friends) {
      return this.friends.length
    }
    return 0
})

userSchema
.pre('findOneAndDelete', function(next) {
  Thoughts.deleteMany(this, next);
});

const User = mongoose.model('user', userSchema);

module.exports = User;