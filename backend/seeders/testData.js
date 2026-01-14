const mongoose = require('mongoose');
const Category = require('../models/Category');
const User = require('../models/User');
const Project = require('../models/Project');
const Service = require('../models/Service');

const seedTestData = async () => {
  try {
    console.log('Seeding test data...');

    // Create categories
    const categories = [
      { name: 'Web Development', slug: 'web-development', type: 'project', icon: 'code', featured: true },
      { name: 'Mobile Development', slug: 'mobile-development', type: 'project', icon: 'smartphone', featured: true },
      { name: 'Design', slug: 'design', type: 'service', icon: 'palette', featured: true },
      { name: 'Writing', slug: 'writing', type: 'service', icon: 'edit', featured: true },
      { name: 'Marketing', slug: 'marketing', type: 'all', icon: 'trending-up', featured: true }
    ];

    const categoryDocs = [];
    for (const cat of categories) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        const doc = await Category.create(cat);
        categoryDocs.push(doc);
        console.log(`Created category: ${cat.name}`);
      } else {
        categoryDocs.push(existing);
        console.log(`Category exists: ${cat.name}`);
      }
    }

    // Create admin user
    let adminUser = await User.findOne({ email: 'admin@dealvictor.com' });
    if (!adminUser) {
      adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'DealVictor',
        email: 'admin@dealvictor.com',
        password: 'Admin123!',
        username: 'admin',
        role: 'admin',
        roles: ['admin', 'buyer', 'freelancer'],
        isVerified: true,
        isActive: true
      });
      console.log('Created admin user: admin@dealvictor.com');
    }

    // Create test buyer
    let buyerUser = await User.findOne({ email: 'buyer@dealvictor.com' });
    if (!buyerUser) {
      buyerUser = await User.create({
        firstName: 'John',
        lastName: 'Buyer',
        email: 'buyer@dealvictor.com',
        password: 'Buyer123!',
        username: 'johnbuyer',
        role: 'buyer',
        roles: ['buyer'],
        isVerified: true,
        isActive: true
      });
      console.log('Created buyer user: buyer@dealvictor.com');
    }

    // Create test freelancer
    let freelancerUser = await User.findOne({ email: 'freelancer@dealvictor.com' });
    if (!freelancerUser) {
      freelancerUser = await User.create({
        firstName: 'Sarah',
        lastName: 'Developer',
        email: 'freelancer@dealvictor.com',
        password: 'Freelancer123!',
        username: 'sarahdev',
        role: 'freelancer',
        roles: ['freelancer'],
        isVerified: true,
        isActive: true,
        freelancerProfile: {
          title: 'Full Stack Developer',
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'],
          hourlyRate: 50,
          bio: 'Experienced full stack developer with 5+ years of experience.',
          languages: ['English'],
          availability: 'full-time'
        }
      });
      console.log('Created freelancer user: freelancer@dealvictor.com');
    }

    // Create sample projects
    const webDevCat = categoryDocs.find(c => c.slug === 'web-development') || categoryDocs[0];

    const sampleProjects = [
      {
        title: 'E-commerce Website Development',
        description: 'Need a complete e-commerce website with shopping cart, payment integration, and admin panel.',
        category: webDevCat._id,
        skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        budget: { type: 'fixed', min: 1000, max: 3000, currency: 'USD' },
        duration: '2_4_weeks',
        experienceLevel: 'expert',
        buyer: buyerUser._id,
        status: 'open',
        approvalStatus: 'approved'
      },
      {
        title: 'Mobile App UI/UX Redesign',
        description: 'Looking for a designer to redesign our mobile app interface for better user experience.',
        category: webDevCat._id,
        skills: ['Figma', 'UI/UX', 'Mobile Design'],
        budget: { type: 'fixed', min: 500, max: 1500, currency: 'USD' },
        duration: '1_2_weeks',
        experienceLevel: 'intermediate',
        buyer: buyerUser._id,
        status: 'open',
        approvalStatus: 'approved'
      },
      {
        title: 'WordPress Blog Setup',
        description: 'Need help setting up a WordPress blog with custom theme.',
        category: webDevCat._id,
        skills: ['WordPress', 'PHP', 'CSS'],
        budget: { type: 'fixed', min: 200, max: 500, currency: 'USD' },
        duration: 'less_than_week',
        experienceLevel: 'entry',
        buyer: buyerUser._id,
        status: 'pending',
        approvalStatus: 'pending'
      }
    ];

    for (const proj of sampleProjects) {
      const existing = await Project.findOne({ title: proj.title });
      if (!existing) {
        await Project.create(proj);
        console.log(`Created project: ${proj.title}`);
      }
    }

    // Create sample services
    const designCat = categoryDocs.find(c => c.slug === 'design') || categoryDocs[0];

    const sampleServices = [
      {
        title: 'Professional Logo Design',
        description: 'I will create a unique and professional logo for your business.',
        freelancer: freelancerUser._id,
        category: designCat._id,
        packages: [
          { name: 'basic', title: 'Basic', description: '1 logo concept', price: 50, deliveryTime: { value: 3, unit: 'days' }, revisions: 1, features: ['1 concept', 'PNG file'] },
          { name: 'standard', title: 'Standard', description: '3 logo concepts', price: 100, deliveryTime: { value: 5, unit: 'days' }, revisions: 3, features: ['3 concepts', 'PNG + SVG', 'Source files'] },
          { name: 'premium', title: 'Premium', description: '5 logo concepts + brand kit', price: 200, deliveryTime: { value: 7, unit: 'days' }, revisions: 5, features: ['5 concepts', 'All formats', 'Brand guidelines', 'Social media kit'] }
        ],
        tags: ['logo', 'branding', 'design'],
        status: 'active',
        approvalStatus: 'approved'
      },
      {
        title: 'React Web Application Development',
        description: 'I will build a modern React web application with Node.js backend.',
        freelancer: freelancerUser._id,
        category: webDevCat._id,
        packages: [
          { name: 'basic', title: 'Basic', description: 'Simple single page app', price: 300, deliveryTime: { value: 7, unit: 'days' }, revisions: 2, features: ['Single page', 'Responsive design', 'Basic functionality'] },
          { name: 'standard', title: 'Standard', description: 'Multi-page application', price: 700, deliveryTime: { value: 14, unit: 'days' }, revisions: 3, features: ['5 pages', 'API integration', 'User authentication'] },
          { name: 'premium', title: 'Premium', description: 'Full-stack application', price: 1500, deliveryTime: { value: 30, unit: 'days' }, revisions: 5, features: ['Unlimited pages', 'Database', 'Admin panel', 'Deployment'] }
        ],
        tags: ['react', 'nodejs', 'web development'],
        status: 'pending',
        approvalStatus: 'pending'
      }
    ];

    for (const serv of sampleServices) {
      const existing = await Service.findOne({ title: serv.title });
      if (!existing) {
        await Service.create(serv);
        console.log(`Created service: ${serv.title}`);
      }
    }

    console.log('Test data seeding complete!');
    return { adminUser, buyerUser, freelancerUser, categories: categoryDocs };
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
};

module.exports = seedTestData;
