const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const CompanySetting = require('../models/CompanySetting');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Seed Super Admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.');
      process.exit(1);
    }

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'Super Admin'
      });
      console.log(`Super Admin created (${adminEmail})`);
    } else {
      console.log('Super Admin already exists.');
    }

    // Seed Company Settings
    const settingsExist = await CompanySetting.findOne();
    if (!settingsExist) {
      await CompanySetting.create({
        companyName: 'Spheronix Technology pvt. ltd.',
        email: 'hr@spheronixtechnology.com',
        phone: '+1 234 567 8900',
        website: 'https://www.spheronixtechnology.com',
        themeColor: '#3b82f6'
      });
      console.log('Default Company Settings created.');
    } else {
      console.log('Company Settings already exist.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
