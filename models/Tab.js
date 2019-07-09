let mongoose = require('mongoose');

let TabSchema = new mongoose.Schema({
  artist: String,
  song: String,
  tab: String,
  created: { type: Date, default: Date.now }
});

mongoose.model('Tab', TabSchema);