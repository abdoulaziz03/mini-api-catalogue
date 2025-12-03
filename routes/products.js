cat > routes/products.js << 'EOF'
const express = require('express');
const router = express.Router();

// Données temporaires
let products = [
  {
    id: 1,
    name: "Smartphone X",
    description: "Smartphone haut de gamme",
    price: 999.99,
    categoryId: 1,
    stock: 50
  },
  {
    id: 2,
    name: "Laptop Pro",
    description: "Ordinateur portable professionnel",
    price: 1499.99,
    categoryId: 1,
    stock: 25
  },
  {
    id: 3,
    name: "T-Shirt Coton",
    description: "T-shirt en coton 100%",
    price: 19.99,
    categoryId: 2,
    stock: 100
  },
  {
    id: 4,
    name: "Roman Best-Seller",
    description: "Le roman le plus vendu de l'année",
    price: 14.99,
    categoryId: 3,
    stock: 75
  }
];

// GET tous les produits (avec filtres optionnels)
router.get('/', (req, res) => {
  let filteredProducts = [...products];
  
  // Filtre par catégorie
  if (req.query.categoryId) {
    const categoryId = parseInt(req.query.categoryId);
    filteredProducts = filteredProducts.filter(product => product.categoryId === categoryId);
  }
  
  // Filtre par prix maximum
  if (req.query.maxPrice) {
    const maxPrice = parseFloat(req.query.maxPrice);
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
  }
  
  // Filtre par stock minimum
  if (req.query.minStock) {
    const minStock = parseInt(req.query.minStock);
    filteredProducts = filteredProducts.filter(product => product.stock >= minStock);
  }
  
  res.json(filteredProducts);
});

// GET un produit par ID
router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(prod => prod.id === productId);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Produit non trouvé' });
  }
});

module.exports = router;
EOF