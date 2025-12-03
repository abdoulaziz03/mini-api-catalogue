const express = require('express');
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Import des routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');

// Utilisation des routes
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);

// Route par défaut
app.get('/', (req, res) => {
  res.json({ message: 'API de catalogue - Bienvenue !' });
});

// Middleware pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`API démarrée sur http://localhost:${port}`);
});