const express = require('express');
const router = express.Router();
const { databaseUtils } = require('../database');

// GET tous les produits
router.get('/', async (req, res) => {
  try {
    const products = databaseUtils.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des produits' });
  }
});

// GET un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = databaseUtils.getProductById(id);

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
    const categoryExists = databaseUtils.checkCategoryExists(categoryId);

    if (!categoryExists) {
      return res.status(400).json({ error: 'Catégorie inexistante' });
    }

    const result = databaseUtils.createProduct(name, parseFloat(price), parseInt(categoryId), parseInt(stock));
    const newProduct = {
      id: result.lastID,
      name,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
      stock: parseInt(stock)
    };

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

    // Vérifier si le produit existe
    const existingProduct = databaseUtils.getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Vérifier si la catégorie existe si elle est modifiée
    if (categoryId) {
      const categoryExists = databaseUtils.checkCategoryExists(categoryId);

      if (!categoryExists) {
        return res.status(400).json({ error: 'Catégorie inexistante' });
      }
    }

    databaseUtils.updateProduct(id, name || existingProduct.name, price !== undefined ? parseFloat(price) : existingProduct.price, categoryId ? parseInt(categoryId) : existingProduct.categoryId, stock !== undefined ? parseInt(stock) : existingProduct.stock);

    const updatedProduct = databaseUtils.getProductById(id);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de mise à jour de produit' });
  }
});

// DELETE supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Vérifier si le produit existe
    const existingProduct = databaseUtils.getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    databaseUtils.deleteProduct(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur de suppression de produit' });
  }
});

module.exports = router;