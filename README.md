
## Description
API de catalogue de produits avec authentification.

## Installation
1. Assurez-vous d'avoir Node.js installé
2. Clonez le repository : https://github.com/abdoulaziz03/mini-api-catalogue.git
3. Installez les dépendances : `npm install`

## Lancement
- Pour démarrer en mode production : `npm start`
- Pour démarrer en mode développement (avec nodemon) : `npm run dev`
Le serveur démarrera sur http://localhost:3000

## Liste des Endpoints

### Authentification
- POST /login : Connexion (body: {username:admin, password:admin123})
- POST /logout : Déconnexion
- GET /check-auth : Vérifier l'état d'authentification

### API Catégories (protégées par authentification)
- GET /api/categories : Récupérer toutes les catégories
- GET /api/categories/:id : Récupérer une catégorie par ID
- POST /api/categories : Créer une nouvelle catégorie (body: {name, description})
- PUT /api/categories/:id : Mettre à jour une catégorie (body: {name?, description?})
- DELETE /api/categories/:id : Supprimer une catégorie

### API Produits (protégées par authentification)
- GET /api/products : Récupérer tous les produits
- GET /api/products/:id : Récupérer un produit par ID
- POST /api/products : Créer un nouveau produit (body: {name, price, categoryId, stock})
- PUT /api/products/:id : Mettre à jour un produit (body: {name?, price?, categoryId?, stock?})
- DELETE /api/products/:id : Supprimer un produit

### Frontend (protégées par authentification)
- GET /dashboard.html : Page du tableau de bord (nécessite connexion)
- GET /login.html : Page de connexion

### Autres
- GET / : Message de bienvenue

  
Sitayeb Ryma & Toure Abdoulaziz
