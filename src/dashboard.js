// Vérifier l'authentification au chargement
async function checkAuth() {
    try {
        const response = await fetch('/check-auth');
        const data = await response.json();

        if (!data.authenticated) {
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        window.location.href = '/login.html';
    }
}

// Variables globales pour les données
let allCategories = [];
let allProducts = [];

// Gestionnaire de déconnexion
async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST'
        });

        if (response.ok) {
            window.location.href = '/login.html';
        } else {
            alert('Erreur lors de la déconnexion');
        }
    } catch (error) {
        alert('Erreur lors de la déconnexion');
    }
}

// Fonction pour charger les statistiques
async function loadStats() {
    try {
        const categoriesResponse = await fetch('/api/categories');
        const categories = await categoriesResponse.json();
        const productsResponse = await fetch('/api/products');
        const products = await productsResponse.json();

        document.getElementById('total-categories').textContent = categories.length;
        document.getElementById('total-products').textContent = products.length;

        const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
        document.getElementById('total-value').textContent = totalValue.toFixed(2) + ' €';
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

// Fonction pour charger les catégories avec boutons d'action
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        allCategories = await response.json();
        const productsResponse = await fetch('/api/products');
        allProducts = await productsResponse.json();

        displayCategories(allCategories);
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
    }
}

// Fonction pour afficher les catégories (avec filtrage)
function displayCategories(categories) {
    const tbody = document.getElementById('categories-body');
    tbody.innerHTML = '';

    categories.forEach(category => {
        const productCount = allProducts.filter(p => p.categoryId === category.id).length;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.description}</td>
            <td>${productCount}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${category.id}">Modifier</button>
                <button class="action-btn delete-btn" data-id="${category.id}">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fonction pour charger les produits avec boutons d'action
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        const categoriesResponse = await fetch('/api/categories');
        allCategories = await categoriesResponse.json();

        // Populate category filter
        populateCategoryFilter();

        displayProducts(allProducts);
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
    }
}

// Fonction pour afficher les produits (avec filtrage)
function displayProducts(products) {
    const tbody = document.getElementById('products-body');
    tbody.innerHTML = '';

    products.forEach(product => {
        const category = allCategories.find(c => c.id === product.categoryId);
        const categoryName = category ? category.name : 'Inconnue';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price} €</td>
            <td>${product.stock}</td>
            <td>${categoryName}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${product.id}">Modifier</button>
                <button class="action-btn delete-btn" data-id="${product.id}">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fonction pour remplir le filtre de catégories
function populateCategoryFilter() {
    const select = document.getElementById('category-filter');
    select.innerHTML = '<option value="">Toutes les catégories</option>';
    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// Fonctions pour gérer les modals
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Fonctions CRUD pour les catégories
async function createCategory(category) {
    const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la catégorie');
    return response.json();
}

async function updateCategory(id, category) {
    const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la catégorie');
    return response.json();
}

async function deleteCategory(id) {
    const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la catégorie');
}

// Fonctions CRUD pour les produits
async function createProduct(product) {
    const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Erreur lors de la création du produit');
    return response.json();
}

async function updateProduct(id, product) {
    const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du produit');
    return response.json();
}

async function deleteProduct(id) {
    const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression du produit');
}

// Fonction pour charger les catégories dans le select du modal produit
async function loadCategoriesForSelect() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        const select = document.getElementById('product-category');
        select.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des catégories pour le select:', error);
    }
}

// Variables pour stocker les instances des graphiques
let categoriesChart = null;
let productsChart = null;

// Fonctions pour les visualisations
function createCategoriesChart(categories, products) {
    const ctx = document.getElementById('categories-chart').getContext('2d');

    // Détruire le graphique existant s'il y en a un
    if (categoriesChart) {
        categoriesChart.destroy();
    }

    const categoryData = categories.map(category => {
        const count = products.filter(p => p.categoryId === category.id).length;
        return { name: category.name, count };
    });

    categoriesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categoryData.map(d => d.name),
            datasets: [{
                data: categoryData.map(d => d.count),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Répartition des Produits par Catégorie'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createProductsChart(products) {
    const ctx = document.getElementById('products-chart').getContext('2d');

    // Détruire le graphique existant s'il y en a un
    if (productsChart) {
        productsChart.destroy();
    }

    const sortedProducts = products.sort((a, b) => b.stock - a.stock).slice(0, 10);

    productsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedProducts.map(p => p.name),
            datasets: [{
                label: 'Stock Disponible',
                data: sortedProducts.map(p => p.stock),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Top 10 Produits par Stock'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantité en Stock'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Produits'
                    }
                }
            }
        }
    });
}

// Fonction pour charger les visualisations
async function loadVisualizations() {
    try {
        const categoriesResponse = await fetch('/api/categories');
        const categories = await categoriesResponse.json();
        const productsResponse = await fetch('/api/products');
        const products = await productsResponse.json();

        createCategoriesChart(categories, products);
        createProductsChart(products);
    } catch (error) {
        console.error('Erreur lors du chargement des visualisations:', error);
    }
}

// Gestionnaires d'événements
document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    loadStats();
    await loadCategories();
    await loadProducts();
    loadVisualizations();

    // Boutons d'ajout
    document.getElementById('add-category-btn').addEventListener('click', () => {
        document.getElementById('category-modal-title').textContent = 'Ajouter Catégorie';
        document.getElementById('category-form').reset();
        document.getElementById('category-id').value = '';
        openModal('category-modal');
    });

    document.getElementById('add-product-btn').addEventListener('click', async () => {
        document.getElementById('product-modal-title').textContent = 'Ajouter Produit';
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        await loadCategoriesForSelect();
        openModal('product-modal');
    });

    // Fermeture des modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeModal('category-modal');
            closeModal('product-modal');
        });
    });

    // Soumission du formulaire catégorie
    document.getElementById('category-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('category-id').value;
        const category = {
            name: document.getElementById('category-name').value,
            description: document.getElementById('category-description').value
        };

        try {
            if (id) {
                await updateCategory(id, category);
            } else {
                await createCategory(category);
            }
            closeModal('category-modal');
            loadCategories();
            loadStats();
            loadVisualizations();
        } catch (error) {
            alert(error.message);
        }
    });

    // Soumission du formulaire produit
    document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('product-id').value;
        const product = {
            name: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            categoryId: parseInt(document.getElementById('product-category').value)
        };

        try {
            if (id) {
                await updateProduct(id, product);
            } else {
                await createProduct(product);
            }
            closeModal('product-modal');
            loadProducts();
            loadCategories();
            loadStats();
            loadVisualizations();
        } catch (error) {
            alert(error.message);
        }
    });

    // Gestion des boutons d'action (délégation d'événements)
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            const type = e.target.closest('tbody').id.includes('categories') ? 'category' : 'product';

            if (type === 'category') {
                try {
                    const response = await fetch(`/api/categories/${id}`);
                    const category = await response.json();
                    document.getElementById('category-modal-title').textContent = 'Modifier Catégorie';
                    document.getElementById('category-id').value = category.id;
                    document.getElementById('category-name').value = category.name;
                    document.getElementById('category-description').value = category.description;
                    openModal('category-modal');
                } catch (error) {
                    alert('Erreur lors du chargement de la catégorie');
                }
            } else {
                try {
                    const response = await fetch(`/api/products/${id}`);
                    const product = await response.json();
                    document.getElementById('product-modal-title').textContent = 'Modifier Produit';
                    document.getElementById('product-id').value = product.id;
                    document.getElementById('product-name').value = product.name;
                    document.getElementById('product-price').value = product.price;
                    document.getElementById('product-stock').value = product.stock;
                    await loadCategoriesForSelect();
                    document.getElementById('product-category').value = product.categoryId;
                    openModal('product-modal');
                } catch (error) {
                    alert('Erreur lors du chargement du produit');
                }
            }
        } else if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            const type = e.target.closest('tbody').id.includes('categories') ? 'category' : 'product';

            if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
                try {
                    if (type === 'category') {
                        await deleteCategory(id);
                    } else {
                        await deleteProduct(id);
                    }
                    if (type === 'category') {
                        loadCategories();
                    } else {
                        loadProducts();
                    }
                    loadStats();
                    loadVisualizations();
                } catch (error) {
                    alert(error.message);
                }
            }
        }
    });

    // Bouton de déconnexion
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Bouton d'actualisation des graphiques
    document.getElementById('refresh-charts-btn').addEventListener('click', async () => {
        const btn = document.getElementById('refresh-charts-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Actualisation...';
        btn.disabled = true;

        try {
            await loadVisualizations();
            btn.textContent = 'Actualisé !';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('Erreur lors de l\'actualisation des graphiques:', error);
            btn.textContent = 'Erreur';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        }
    });

    // Recherche et filtrage pour les catégories
    document.getElementById('category-search').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCategories = allCategories.filter(category =>
            category.name.toLowerCase().includes(searchTerm) ||
            category.description.toLowerCase().includes(searchTerm)
        );
        displayCategories(filteredCategories);
    });

    // Recherche et filtrage pour les produits
    document.getElementById('product-search').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const categoryFilter = document.getElementById('category-filter').value;

        let filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.price.toString().includes(searchTerm) ||
            product.stock.toString().includes(searchTerm) ||
            (allCategories.find(c => c.id === product.categoryId)?.name.toLowerCase().includes(searchTerm))
        );

        if (categoryFilter) {
            filteredProducts = filteredProducts.filter(product =>
                product.categoryId === parseInt(categoryFilter)
            );
        }

        displayProducts(filteredProducts);
    });

    // Filtrage par catégorie pour les produits
    document.getElementById('category-filter').addEventListener('change', (e) => {
        const categoryFilter = e.target.value;
        const searchTerm = document.getElementById('product-search').value.toLowerCase();

        let filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );

        if (categoryFilter) {
            filteredProducts = filteredProducts.filter(product =>
                product.categoryId === parseInt(categoryFilter)
            );
        }

        displayProducts(filteredProducts);
    });

    // Dark mode toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = document.querySelector('#theme-toggle i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('#theme-toggle i').className = 'fas fa-sun';
    }
});
