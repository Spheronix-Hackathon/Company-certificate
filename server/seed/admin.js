const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const CompanySetting = require('../models/CompanySetting');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Seed Super Admin
    const adminExists = await User.findOne({ email: 'admin@company.com' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@company.com',
        password: 'password123',
        role: 'Super Admin'
      });
      console.log('Super Admin created (admin@company.com / password123)');
    } else {
      console.log('Super Admin already exists.');
    }

    // Seed Company Settings
    const settingsExist = await CompanySetting.findOne();
    if (!settingsExist) {
      await CompanySetting.create({
        companyName: 'Tech Innovators Inc.',
        email: 'contact@techinnovators.com',
        phone: '+1 234 567 8900',
        website: 'https://techinnovators.com',
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
