const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Meal = require('../models/Meal');

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-menu');
  const meals = await Meal.find({});
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  for (const meal of meals) {
    const mealUrl = `${frontendUrl}/menu?meal=${meal._id}`;
    const qrImage = await QRCode.toDataURL(mealUrl, { width: 600, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });
    meal.qrCode = qrImage;
    await meal.save();
    console.log(`Updated QR for: ${meal.name}`);
  }
  console.log(`Done — ${meals.length} meals updated`);
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
