cat > server.js << 'EOF'
const express = require('express');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Catalogue',
    endpoints: {
      categories: '/api/categories',
      products: '/api/products',
      documentation: 'Voir README.md pour plus d\'informations'
    }
  });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    availableRoutes: ['/', '/api/categories', '/api/products']
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Documentation: http://localhost:${PORT}/`);
});
EOF