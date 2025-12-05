const express = require('express');
const router = express.Router();
const { databaseUtils } = require('../database');

// GET toutes les catégories
router.get('/', async (req, res) => {
  try {
    const categories = await databaseUtils.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ error: 'Erreur de lecture des catégories' });
  }
});

// GET une catégorie par ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const category = await databaseUtils.getCategoryById(id);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Catégorie non trouvée' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({ error: 'Erreur de lecture des catégories' });
  }
});

// POST créer une nouvelle catégorie
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Nom et description requis' });
    }

    const result = await databaseUtils.createCategory(name, description);
    const newCategory = {
      id: result.lastID,
      name,
      description
    };

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Une catégorie avec ce nom existe déjà' });
    } else {
      res.status(500).json({ error: 'Erreur de création de catégorie' });
    }
  }
});

// PUT mettre à jour une catégorie
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    // Vérifier si la catégorie existe
    const existingCategory = await databaseUtils.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    await databaseUtils.updateCategory(id, name || existingCategory.name, description || existingCategory.description);

    const updatedCategory = await databaseUtils.getCategoryById(id);
    res.json(updatedCategory);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Une catégorie avec ce nom existe déjà' });
    } else {
      res.status(500).json({ error: 'Erreur de mise à jour de catégorie' });
    }
  }
});

// DELETE supprimer une catégorie
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Vérifier si la catégorie existe
    const existingCategory = await databaseUtils.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    await databaseUtils.deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({ error: 'Erreur de suppression de catégorie' });
  }
});

module.exports = router;
