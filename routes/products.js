const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');
const categoriesPath = path.join(__dirname, '../data/categories.json');

// GET tous les produits
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(productsPath, 'utf8');
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des produits' });
  }
});

// GET un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(productsPath, 'utf8');
    const products = JSON.parse(data);
    const product = products.find(p => p.id === id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Produit non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des produits' });
  }
});

// POST créer un nouveau produit
router.post('/', async (req, res) => {
  try {
    const { name, price, categoryId, stock } = req.body;
    
    // Validation
    if (!name || price === undefined || !categoryId || stock === undefined) {
      return res.status(400).json({ 
        error: 'Tous les champs sont requis: name, price, categoryId, stock' 
      });
    }
    
    // Vérifier si la catégorie existe
    const categoriesData = await fs.readFile(categoriesPath, 'utf8');
    const categories = JSON.parse(categoriesData);
    const categoryExists = categories.some(c => c.id === categoryId);
    
    if (!categoryExists) {
      return res.status(400).json({ error: 'Catégorie inexistante' });
    }
    
    const data = await fs.readFile(productsPath, 'utf8');
    const products = JSON.parse(data);
    
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
      stock: parseInt(stock)
    };
    
    products.push(newProduct);
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de création de produit' });
  }
});

// PUT mettre à jour un produit
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, price, categoryId, stock } = req.body;
    
    const data = await fs.readFile(productsPath, 'utf8');
    let products = JSON.parse(data);
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Vérifier si la catégorie existe si elle est modifiée
    if (categoryId) {
      const categoriesData = await fs.readFile(categoriesPath, 'utf8');
      const categories = JSON.parse(categoriesData);
      const categoryExists = categories.some(c => c.id === categoryId);
      
      if (!categoryExists) {
        return res.status(400).json({ error: 'Catégorie inexistante' });
      }
      products[productIndex].categoryId = parseInt(categoryId);
    }
    
    if (name) products[productIndex].name = name;
    if (price !== undefined) products[productIndex].price = parseFloat(price);
    if (stock !== undefined) products[productIndex].stock = parseInt(stock);
    
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
    
    res.json(products[productIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de mise à jour de produit' });
  }
});

// DELETE supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const data = await fs.readFile(productsPath, 'utf8');
    let products = JSON.parse(data);
    const initialLength = products.length;
    
    products = products.filter(p => p.id !== id);
    
    if (products.length === initialLength) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur de suppression de produit' });
  }
});

module.exports = router;