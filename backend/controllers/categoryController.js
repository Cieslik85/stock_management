const categoryModel = require('../models/categoryModel');

exports.getAll = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description = '' } = req.body;
    const newCategory = await categoryModel.createCategory(name, description);

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedCategory = await categoryModel.updateCategory(req.params.id, name);
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await categoryModel.deleteCategory(req.params.id);
    res.status(200).json({ message: 'Category deleted' }); // ✅ instead of 204
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

