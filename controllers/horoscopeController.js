const horoscopes = require('../horoscopeData');
const HoroscopeHistory = require('../models/HoroscopeHistory');

const getTodayHoroscope = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Check if already served today
    let history = await HoroscopeHistory.findOne({ userId, date: today });
    if (history) {
      return res.json(history);
    }

    // Get user's zodiac and horoscope
    const user = await require('../models/User').findById(userId);
    const zodiacSign = user.zodiacSign;
    const horoscopeText = horoscopes[zodiacSign];

    // Save to history
    history = new HoroscopeHistory({ userId, date: today, zodiacSign, horoscope: horoscopeText });
    await history.save();

    res.json({ date: today, zodiacSign, horoscope: horoscopeText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const history = await HoroscopeHistory.find({
      userId,
      date: { $gte: sevenDaysAgo.toISOString().split('T')[0] }
    }).sort({ date: -1 }).limit(7);

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTodayHoroscope, getHistory };
