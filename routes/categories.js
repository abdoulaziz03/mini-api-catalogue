const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const categoriesPath = path.join(__dirname, '../data/categories.json');

// GET toutes les catégories
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(categoriesPath, 'utf8');
    const categories = JSON.parse(data);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des catégories' });
  }
});

// GET une catégorie par ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(categoriesPath, 'utf8');
    const categories = JSON.parse(data);
    const category = categories.find(c => c.id === id);
    
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Catégorie non trouvée' });
    }
  } catch (error) {
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
    
    const data = await fs.readFile(categoriesPath, 'utf8');
    const categories = JSON.parse(data);
    
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    const newCategory = {
      id: newId,
      name,
      description
    };
    
    categories.push(newCategory);
    await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2));
    
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de création de catégorie' });
  }
});

// PUT mettre à jour une catégorie
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    
    const data = await fs.readFile(categoriesPath, 'utf8');
    let categories = JSON.parse(data);
    const categoryIndex = categories.findIndex(c => c.id === id);
    
    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    
    if (name) categories[categoryIndex].name = name;
    if (description) categories[categoryIndex].description = description;
    
    await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2));
    
    res.json(categories[categoryIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de mise à jour de catégorie' });
  }
});

// DELETE supprimer une catégorie
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const data = await fs.readFile(categoriesPath, 'utf8');
    let categories = JSON.parse(data);
    const initialLength = categories.length;
    
    categories = categories.filter(c => c.id !== id);
    
    if (categories.length === initialLength) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    
    await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2));
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur de suppression de catégorie' });
  }
});

module.exports = router;