let mongoose = require('mongoose'), Schema = mongoose.Schema;

let TabSchema = new mongoose.Schema({
  artist: String,
  song: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  tab: String,
  created: { type: Date, default: Date.now }
});

mongoose.model('Tab', TabSchema);