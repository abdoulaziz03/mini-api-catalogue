cat > routes/categories.js << 'EOF'
const express = require('express');
const router = express.Router();

// Données temporaires (seront remplacées par le fichier JSON plus tard)
let categories = [
  {
    id: 1,
    name: "Électronique",
    description: "Appareils électroniques et gadgets"
  },
  {
    id: 2,
    name: "Vêtements",
    description: "Vêtements pour hommes, femmes et enfants"
  },
  {
    id: 3,
    name: "Livres",
    description: "Livres de toutes catégories"
  }
];

// GET toutes les catégories
router.get('/', (req, res) => {
  res.json(categories);
});

// GET une catégorie par ID
router.get('/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = categories.find(cat => cat.id === categoryId);
  
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: 'Catégorie non trouvée' });
  }
});

module.exports = router;
EOF