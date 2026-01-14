const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../models/User');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Sample Users (from old DealVictor data)
const users = [
  {
    firstName: 'Admin',
    lastName: 'DealVictor',
    email: 'admin@dealvictor.com',
    password: 'admin123',
    phone: '9999999999',
    role: 'admin',
    roles: ['admin', 'buyer', 'freelancer', 'seller'],
    isVerified: true,
    isActive: true,
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    stats: { totalProjects: 50, completedProjects: 45, avgRating: 4.9, totalReviews: 120 }
  },
  {
    firstName: 'Sunil',
    lastName: 'Sharma',
    email: 'sunilsharmaftp@gmail.com',
    password: 'password123',
    phone: '9654732413',
    role: 'freelancer',
    roles: ['freelancer', 'buyer'],
    isVerified: true,
    isActive: true,
    freelancerProfile: {
      title: 'Full Stack Web Developer',
      description: 'Expert in React, Node.js, MongoDB, and modern web technologies',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'PHP', 'Laravel'],
      hourlyRate: 25,
      experience: '5+ years'
    },
    location: { city: 'Delhi', state: 'Delhi', country: 'India' },
    stats: { totalProjects: 35, completedProjects: 32, avgRating: 4.8, totalReviews: 28 }
  },
  {
    firstName: 'Pallavi',
    lastName: 'Sharma',
    email: 'pallavisharmaftp@gmail.com',
    password: 'password123',
    phone: '9266885960',
    role: 'freelancer',
    roles: ['freelancer', 'seller'],
    isVerified: true,
    isActive: true,
    freelancerProfile: {
      title: 'Graphic Designer & UI/UX Expert',
      description: 'Creative designer with expertise in brand identity and web design',
      skills: ['Photoshop', 'Illustrator', 'Figma', 'UI/UX', 'Branding'],
      hourlyRate: 20,
      experience: '4 years'
    },
    location: { city: 'Noida', state: 'Uttar Pradesh', country: 'India' },
    stats: { totalProjects: 22, completedProjects: 20, avgRating: 4.7, totalReviews: 18 }
  },
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    password: 'password123',
    phone: '1234567890',
    role: 'buyer',
    roles: ['buyer'],
    isVerified: true,
    isActive: true,
    location: { city: 'New York', state: 'NY', country: 'USA' },
    stats: { totalProjects: 15, totalSpent: 5000 }
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    phone: '0987654321',
    role: 'seller',
    roles: ['seller', 'buyer'],
    isVerified: true,
    isActive: true,
    sellerProfile: {
      shopName: 'TechGadgets Store',
      shopDescription: 'Premium electronics and gadgets at best prices'
    },
    location: { city: 'London', country: 'UK' },
    stats: { totalSales: 150, avgRating: 4.6 }
  }
];

// Categories (from old DealVictor)
const categories = [
  { name: 'Web Development', slug: 'web-development', type: 'service', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400', description: 'Website and web application development services' },
  { name: 'Mobile Development', slug: 'mobile-development', type: 'service', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', description: 'iOS and Android app development' },
  { name: 'Graphic Design', slug: 'graphic-design', type: 'service', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400', description: 'Logo, branding, and visual design services' },
  { name: 'Digital Marketing', slug: 'digital-marketing', type: 'service', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', description: 'SEO, social media, and online marketing' },
  { name: 'Writing & Content', slug: 'writing-content', type: 'service', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400', description: 'Content writing, copywriting, and translation' },
  { name: 'Video & Animation', slug: 'video-animation', type: 'service', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400', description: 'Video editing, animation, and motion graphics' },
  { name: 'Data Entry', slug: 'data-entry', type: 'service', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400', description: 'Data processing and virtual assistant services' },
  { name: 'Electronics', slug: 'electronics', type: 'product', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', description: 'Electronics and gadgets' },
  { name: 'Fashion', slug: 'fashion', type: 'product', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', description: 'Clothing and accessories' },
  { name: 'Home & Garden', slug: 'home-garden', type: 'product', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', description: 'Home decor and garden items' }
];

// Services (from old DealVictor data)
const services = [
  {
    title: 'Professional Website Development',
    description: 'I will create a professional, responsive website for your business using modern technologies like React, Node.js, and MongoDB. Includes SEO optimization and mobile-friendly design.',
    category: 'Web Development',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'],
    packages: {
      basic: { name: 'Basic', price: 150, deliveryDays: 7, description: 'Single page website', features: ['1 Page', 'Responsive Design', 'Contact Form', '1 Revision'] },
      standard: { name: 'Standard', price: 350, deliveryDays: 14, description: 'Multi-page website', features: ['5 Pages', 'Responsive Design', 'Contact Form', 'SEO', '3 Revisions'] },
      premium: { name: 'Premium', price: 750, deliveryDays: 21, description: 'Full business website', features: ['10+ Pages', 'CMS', 'E-commerce Ready', 'SEO', 'Unlimited Revisions'] }
    },
    rating: 4.8,
    reviewCount: 45,
    ordersCompleted: 52,
    tags: ['website', 'react', 'nodejs', 'responsive', 'seo']
  },
  {
    title: 'Mobile App Development - iOS & Android',
    description: 'Expert mobile app development for both iOS and Android platforms using React Native. Fast delivery, clean code, and ongoing support.',
    category: 'Mobile Development',
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600'],
    packages: {
      basic: { name: 'Basic', price: 500, deliveryDays: 14, description: 'Simple app', features: ['3 Screens', 'Basic Features', 'Android OR iOS', '2 Revisions'] },
      standard: { name: 'Standard', price: 1500, deliveryDays: 30, description: 'Standard app', features: ['10 Screens', 'API Integration', 'Both Platforms', '5 Revisions'] },
      premium: { name: 'Premium', price: 3500, deliveryDays: 45, description: 'Complex app', features: ['Unlimited Screens', 'Full Backend', 'Both Platforms', 'Source Code', 'Support'] }
    },
    rating: 4.9,
    reviewCount: 28,
    ordersCompleted: 35,
    tags: ['mobile', 'ios', 'android', 'react-native', 'app']
  },
  {
    title: 'Logo Design & Brand Identity',
    description: 'Creative logo design and complete brand identity package. I will create a unique, memorable logo that represents your business perfectly.',
    category: 'Graphic Design',
    images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600'],
    packages: {
      basic: { name: 'Basic', price: 50, deliveryDays: 3, description: '2 Logo concepts', features: ['2 Concepts', 'PNG/JPG', '2 Revisions'] },
      standard: { name: 'Standard', price: 150, deliveryDays: 5, description: '5 Logo concepts', features: ['5 Concepts', 'All Formats', 'Source Files', '5 Revisions'] },
      premium: { name: 'Premium', price: 350, deliveryDays: 7, description: 'Full branding', features: ['Brand Guide', 'Business Cards', 'Social Kit', 'Unlimited Revisions'] }
    },
    rating: 4.7,
    reviewCount: 89,
    ordersCompleted: 120,
    tags: ['logo', 'branding', 'design', 'identity', 'creative']
  },
  {
    title: 'SEO & Digital Marketing Expert',
    description: 'Boost your online presence with proven SEO strategies and digital marketing campaigns. Increase traffic, leads, and conversions.',
    category: 'Digital Marketing',
    images: ['https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600'],
    packages: {
      basic: { name: 'Basic', price: 100, deliveryDays: 7, description: 'SEO Audit', features: ['Site Audit', 'Keyword Research', '5 Keywords', 'Report'] },
      standard: { name: 'Standard', price: 300, deliveryDays: 30, description: 'Monthly SEO', features: ['On-page SEO', '15 Keywords', 'Link Building', 'Monthly Report'] },
      premium: { name: 'Premium', price: 750, deliveryDays: 30, description: 'Full marketing', features: ['SEO + PPC', 'Social Media', 'Content Strategy', 'Weekly Reports'] }
    },
    rating: 4.6,
    reviewCount: 34,
    ordersCompleted: 45,
    tags: ['seo', 'marketing', 'google', 'traffic', 'leads']
  },
  {
    title: 'Professional Content Writing',
    description: 'High-quality content writing for blogs, websites, and marketing materials. SEO-optimized and engaging content that converts.',
    category: 'Writing & Content',
    images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600'],
    packages: {
      basic: { name: 'Basic', price: 25, deliveryDays: 2, description: '500 words', features: ['500 Words', 'SEO Optimized', '1 Revision'] },
      standard: { name: 'Standard', price: 75, deliveryDays: 4, description: '1500 words', features: ['1500 Words', 'SEO + Research', '3 Revisions'] },
      premium: { name: 'Premium', price: 200, deliveryDays: 7, description: '5000 words', features: ['5000 Words', 'Deep Research', 'Images', 'Unlimited Revisions'] }
    },
    rating: 4.8,
    reviewCount: 67,
    ordersCompleted: 85,
    tags: ['writing', 'content', 'blog', 'seo', 'articles']
  }
];

// Projects (from old DealVictor data)
const projects = [
  {
    title: 'E-commerce Website Development',
    description: 'Looking for an experienced developer to build a full-featured e-commerce website with payment integration, inventory management, and admin dashboard. Must have experience with React and Node.js.',
    type: 'fixed',
    budget: { min: 500, max: 1500 },
    skills: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
    category: 'Web Development',
    status: 'open'
  },
  {
    title: 'Mobile App for Food Delivery',
    description: 'Need a food delivery app for Android and iOS. Should include user app, restaurant app, and delivery driver app. Real-time tracking required.',
    type: 'fixed',
    budget: { min: 2000, max: 5000 },
    skills: ['React Native', 'Firebase', 'Google Maps API'],
    category: 'Mobile Development',
    status: 'open'
  },
  {
    title: 'Logo Design for Tech Startup',
    description: 'New AI startup needs a modern, clean logo. Must convey innovation and technology. Please share portfolio with similar work.',
    type: 'fixed',
    budget: { min: 100, max: 300 },
    skills: ['Logo Design', 'Adobe Illustrator', 'Branding'],
    category: 'Graphic Design',
    status: 'open'
  },
  {
    title: 'SEO for Dental Clinic Website',
    description: 'Need ongoing SEO services for a local dental clinic. Goal is to rank #1 for local dental keywords. Monthly reporting required.',
    type: 'hourly',
    budget: { min: 15, max: 30 },
    skills: ['SEO', 'Local SEO', 'Google My Business'],
    category: 'Digital Marketing',
    status: 'open'
  },
  {
    title: 'Blog Content Writer Needed',
    description: 'Looking for a content writer to produce 10 blog posts per month on technology topics. Must have excellent English and research skills.',
    type: 'hourly',
    budget: { min: 10, max: 25 },
    skills: ['Content Writing', 'SEO Writing', 'Research'],
    category: 'Writing & Content',
    status: 'open'
  }
];

// Products
const products = [
  {
    title: 'Wireless Bluetooth Headphones Pro',
    description: 'Premium noise-cancelling wireless headphones with 40-hour battery life. Crystal clear audio quality.',
    price: 79.99,
    originalPrice: 129.99,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    stock: 50,
    rating: 4.5,
    reviewCount: 328,
    freeShipping: true
  },
  {
    title: 'Smart Watch Series X',
    description: 'Advanced fitness tracking, heart rate monitor, GPS enabled. Water resistant up to 50m.',
    price: 199.99,
    originalPrice: 249.99,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    stock: 25,
    rating: 4.8,
    reviewCount: 542,
    freeShipping: true
  },
  {
    title: 'Premium Laptop Stand - Aluminum',
    description: 'Ergonomic design, adjustable height, helps with heat dissipation. Perfect for remote work.',
    price: 49.99,
    originalPrice: 69.99,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'],
    stock: 100,
    rating: 4.6,
    reviewCount: 189,
    freeShipping: false
  },
  {
    title: 'Mechanical Gaming Keyboard RGB',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches. Programmable keys and macros.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600'],
    stock: 30,
    rating: 4.7,
    reviewCount: 412,
    freeShipping: true
  },
  {
    title: 'Portable Power Bank 20000mAh',
    description: 'Fast charging power bank with USB-C and 3 output ports. LED display shows remaining charge.',
    price: 29.99,
    originalPrice: 39.99,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600'],
    stock: 200,
    rating: 4.3,
    reviewCount: 876,
    freeShipping: false
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/dealvictor';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await Project.deleteMany({});
    await Product.deleteMany({});

    // Create users
    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`  Created user: ${user.email}`);
    }

    // Create categories
    console.log('Creating categories...');
    const createdCategories = [];
    for (const catData of categories) {
      const category = new Category(catData);
      await category.save();
      createdCategories.push(category);
      console.log(`  Created category: ${category.name}`);
    }

    // Create services
    console.log('Creating services...');
    const freelancer = createdUsers.find(u => u.role === 'freelancer');
    for (const serviceData of services) {
      const category = createdCategories.find(c => c.name === serviceData.category);
      const service = new Service({
        ...serviceData,
        seller: freelancer._id,
        category: category ? category._id : null
      });
      await service.save();
      console.log(`  Created service: ${service.title}`);
    }

    // Create projects
    console.log('Creating projects...');
    const buyer = createdUsers.find(u => u.role === 'buyer');
    for (const projectData of projects) {
      const category = createdCategories.find(c => c.name === projectData.category);
      const project = new Project({
        ...projectData,
        client: buyer._id,
        category: category ? category._id : null
      });
      await project.save();
      console.log(`  Created project: ${project.title}`);
    }

    // Create products
    console.log('Creating products...');
    const seller = createdUsers.find(u => u.role === 'seller');
    for (const productData of products) {
      const category = createdCategories.find(c => c.name === productData.category);
      const product = new Product({
        ...productData,
        seller: seller._id,
        category: category ? category._id : null
      });
      await product.save();
      console.log(`  Created product: ${product.title}`);
    }

    console.log('\n========================================');
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log('========================================');
    console.log('\nAdmin Login:');
    console.log('  Email: admin@dealvictor.com');
    console.log('  Password: admin123');
    console.log('\nTest User Login:');
    console.log('  Email: john@example.com');
    console.log('  Password: password123');
    console.log('\nFreelancer Login:');
    console.log('  Email: sunilsharmaftp@gmail.com');
    console.log('  Password: password123');
    console.log('========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDatabase();
