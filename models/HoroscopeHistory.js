const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  zodiacSign: { type: String, required: true },
  horoscope: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('HoroscopeHistory', historySchema);
