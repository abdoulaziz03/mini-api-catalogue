const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { initDatabase } = require('./database');
const app = express();
const port = 3000;

// Middleware de session
app.use(session({
    secret: 'votre-secret-session', // À changer en production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Mettre true en HTTPS
}));

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques du dashboard
app.use(express.static('src'));

// Protéger l'accès au dashboard
app.get('/dashboard.html', (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
});

// Import des routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');

// Utilisation des routes API (protégées)
app.use('/api/categories', (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Non autorisé' });
    }
}, categoriesRoutes);

app.use('/api/products', (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Non autorisé' });
    }
}, productsRoutes);

// Routes d'authentification
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Utilisateur codé en dur (à remplacer par une vraie base de données)
    const adminUser = {
        username: 'admin',
        password: await bcrypt.hash('admin123', 10) // Mot de passe haché
    };

    if (username === adminUser.username && await bcrypt.compare(password, adminUser.password)) {
        req.session.user = { username: adminUser.username };
        res.json({ success: true, message: 'Connexion réussie' });
    } else {
        res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la déconnexion' });
        } else {
            res.json({ success: true, message: 'Déconnexion réussie' });
        }
    });
});

// Vérifier si l'utilisateur est connecté
app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
});

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
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(`API démarrée sur http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();
