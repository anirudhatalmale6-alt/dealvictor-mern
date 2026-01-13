const Category = require('../models/Category');
const Service = require('../models/Service');
const Product = require('../models/Product');
const Project = require('../models/Project');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const { type, parent, includeCount } = req.query;

    const query = {};
    if (type) query.type = type;
    if (parent) {
      query.parent = parent;
    } else if (parent === '') {
      query.parent = null; // Get only root categories
    }

    let categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort('order name');

    // Include item counts if requested
    if (includeCount === 'true') {
      categories = await Promise.all(
        categories.map(async (cat) => {
          const catObj = cat.toObject();

          if (cat.type === 'service' || cat.type === 'all') {
            catObj.serviceCount = await Service.countDocuments({
              category: cat._id,
              isActive: true
            });
          }
          if (cat.type === 'product' || cat.type === 'all') {
            catObj.productCount = await Product.countDocuments({
              category: cat._id,
              isActive: true
            });
          }
          if (cat.type === 'project' || cat.type === 'all') {
            catObj.projectCount = await Project.countDocuments({
              category: cat._id,
              status: 'open'
            });
          }

          return catObj;
        })
      );
    }

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// @desc    Get category tree (nested structure)
// @route   GET /api/categories/tree
// @access  Public
exports.getCategoryTree = async (req, res) => {
  try {
    const { type } = req.query;

    const query = { parent: null };
    if (type) query.type = type;

    const rootCategories = await Category.find(query).sort('order name');

    const buildTree = async (categories) => {
      return Promise.all(
        categories.map(async (cat) => {
          const children = await Category.find({ parent: cat._id }).sort('order name');
          const catObj = cat.toObject();
          catObj.children = children.length > 0 ? await buildTree(children) : [];
          return catObj;
        })
      );
    };

    const tree = await buildTree(rootCategories);

    res.json({
      success: true,
      data: tree
    });
  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category tree',
      error: error.message
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get subcategories
    const subcategories = await Category.find({ parent: category._id }).sort('order name');

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        subcategories
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const subcategories = await Category.find({ parent: category._id }).sort('order name');

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        subcategories
      }
    });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, description, type, parent, icon, image, order } = req.body;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check for duplicate slug
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      type: type || 'all',
      parent: parent || null,
      icon,
      image,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, type, parent, icon, image, order, isActive } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) updateData.description = description;
    if (type) updateData.type = type;
    if (parent !== undefined) updateData.parent = parent || null;
    if (icon !== undefined) updateData.icon = icon;
    if (image !== undefined) updateData.image = image;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check for subcategories
    const subcategories = await Category.countDocuments({ parent: category._id });
    if (subcategories > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Delete subcategories first.'
      });
    }

    // Check for items using this category
    const [serviceCount, productCount, projectCount] = await Promise.all([
      Service.countDocuments({ category: category._id }),
      Product.countDocuments({ category: category._id }),
      Project.countDocuments({ category: category._id })
    ]);

    if (serviceCount > 0 || productCount > 0 || projectCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with associated items. Reassign items first.',
        counts: { serviceCount, productCount, projectCount }
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

// @desc    Reorder categories
// @route   PUT /api/categories/reorder
// @access  Private/Admin
exports.reorderCategories = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    // Update order for each category
    await Promise.all(
      orderedIds.map((id, index) =>
        Category.findByIdAndUpdate(id, { order: index })
      )
    );

    res.json({
      success: true,
      message: 'Categories reordered successfully'
    });
  } catch (error) {
    console.error('Reorder categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering categories',
      error: error.message
    });
  }
};

// @desc    Get popular categories
// @route   GET /api/categories/popular
// @access  Public
exports.getPopularCategories = async (req, res) => {
  try {
    const { limit = 8, type } = req.query;

    const query = { parent: null, isActive: true };
    if (type) query.type = type;

    // Get categories with most items
    const categories = await Category.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: 'category',
          as: 'services'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $addFields: {
          itemCount: { $add: [{ $size: '$services' }, { $size: '$products' }] }
        }
      },
      { $sort: { itemCount: -1 } },
      { $limit: Number(limit) },
      {
        $project: {
          name: 1,
          slug: 1,
          icon: 1,
          image: 1,
          itemCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get popular categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular categories',
      error: error.message
    });
  }
};
