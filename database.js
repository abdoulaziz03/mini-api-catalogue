const fs = require('fs');
const path = require('path');

// Chemins des fichiers de données
const categoriesFile = path.join(__dirname, 'data', 'categories.json');
const productsFile = path.join(__dirname, 'data', 'products.json');

// Fonctions utilitaires pour lire/écrire les fichiers JSON
const readJSONFile = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
        return [];
    }
};

const writeJSONFile = (filePath, data) => {
    try {
        // Créer le répertoire data s'il n'existe pas
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Erreur lors de l'écriture du fichier ${filePath}:`, error);
        throw error;
    }
};

// Fonctions utilitaires pour les opérations de base de données
const databaseUtils = {
    // Categories
    getAllCategories: () => readJSONFile(categoriesFile),

    getCategoryById: (id) => {
        const categories = readJSONFile(categoriesFile);
        return categories.find(cat => cat.id === id);
    },

    createCategory: (name, description) => {
        const categories = readJSONFile(categoriesFile);
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        const newCategory = {
            id: newId,
            name,
            description
        };
        categories.push(newCategory);
        writeJSONFile(categoriesFile, categories);
        return { lastID: newId };
    },

    updateCategory: (id, name, description) => {
        const categories = readJSONFile(categoriesFile);
        const index = categories.findIndex(cat => cat.id === id);
        if (index !== -1) {
            categories[index].name = name;
            categories[index].description = description;
            writeJSONFile(categoriesFile, categories);
        }
    },

    deleteCategory: (id) => {
        const categories = readJSONFile(categoriesFile);
        const filteredCategories = categories.filter(cat => cat.id !== id);
        writeJSONFile(categoriesFile, filteredCategories);
    },

    getCategoryCount: () => {
        const categories = readJSONFile(categoriesFile);
        return { count: categories.length };
    },

    // Products
    getAllProducts: () => readJSONFile(productsFile),

    getProductById: (id) => {
        const products = readJSONFile(productsFile);
        return products.find(prod => prod.id === id);
    },

    createProduct: (name, price, categoryId, stock) => {
        const products = readJSONFile(productsFile);
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            name,
            price,
            categoryId,
            stock
        };
        products.push(newProduct);
        writeJSONFile(productsFile, products);
        return { lastID: newId };
    },

    updateProduct: (id, name, price, categoryId, stock) => {
        const products = readJSONFile(productsFile);
        const index = products.findIndex(prod => prod.id === id);
        if (index !== -1) {
            products[index].name = name;
            products[index].price = price;
            products[index].categoryId = categoryId;
            products[index].stock = stock;
            writeJSONFile(productsFile, products);
        }
    },

    deleteProduct: (id) => {
        const products = readJSONFile(productsFile);
        const filteredProducts = products.filter(prod => prod.id !== id);
        writeJSONFile(productsFile, filteredProducts);
    },

    getProductCount: () => {
        const products = readJSONFile(productsFile);
        return { count: products.length };
    },

    getProductsByCategory: (categoryId) => {
        const products = readJSONFile(productsFile);
        const count = products.filter(prod => prod.categoryId === categoryId).length;
        return { count };
    },

    checkCategoryExists: (id) => {
        const categories = readJSONFile(categoriesFile);
        return categories.some(cat => cat.id === id);
    }
};

// Initialiser la base de données (vérifier que les fichiers existent)
const initDatabase = async () => {
    try {
        // Créer les fichiers s'ils n'existent pas
        if (!fs.existsSync(categoriesFile)) {
            writeJSONFile(categoriesFile, []);
        }
        if (!fs.existsSync(productsFile)) {
            writeJSONFile(productsFile, []);
        }
        console.log('Base de données JSON initialisée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    }
};

module.exports = {
    databaseUtils,
    initDatabase
};
