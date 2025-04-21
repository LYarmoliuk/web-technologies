// Глобальний стан програми
const state = {
    products: [],
    filter: null,
    sortBy: null,
    sortDirection: 'asc',
    editingProduct: null
};

// Pure function для форматування дати
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Pure function для створення ID
const generateId = () => {
    return 'id_' + Math.random().toString(36).substr(2, 9);
};

// Pure function для створення об'єкта нового товару
const createProduct = (name, price, category, imageUrl) => {
    const now = new Date();
    return {
        id: generateId(),
        name,
        price: parseFloat(price),
        category,
        imageUrl,
        createdAt: now,
        updatedAt: now
    };
};

// Pure function для оновлення товару
const updateProduct = (product, updates) => {
    return {
        ...product,
        ...updates,
        updatedAt: new Date()
    };
};

// Pure function для обчислення загальної вартості товарів
const calculateTotalPrice = (products) => {
    return products.reduce((total, product) => total + product.price, 0).toFixed(2);
};

// Pure function для фільтрації товарів
const filterProducts = (products, category) => {
    if (!category) return products;
    return products.filter(product => product.category === category);
};

// Pure function для сортування товарів
const sortProducts = (products, sortBy, direction) => {
    if (!sortBy) return [...products];
    
    return [...products].sort((a, b) => {
        let comparison = 0;
        
        if (sortBy === 'price') {
            comparison = a.price - b.price;
        } else if (sortBy === 'createdAt') {
            comparison = new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortBy === 'updatedAt') {
            comparison = new Date(a.updatedAt) - new Date(b.updatedAt);
        }
        
        return direction === 'asc' ? comparison : -comparison;
    });
};

// Pure function для створення HTML-елемента товару
const createProductElement = (product) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.id = product.id;

    productCard.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x180?text=Немає+зображення'">
        <div class="product-info">
            <div class="product-id">ID: ${product.id}</div>
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${product.price.toFixed(2)} грн.</p>
            <div class="product-actions">
                <button class="edit-btn">Редагувати</button>
                <button class="delete-btn">Видалити</button>
            </div>
        </div>
    `;

    return productCard;
};

// Pure function для показу snackbar
const showSnackbar = (message) => {
    const snackbar = document.getElementById('snackbar');
    snackbar.textContent = message;
    snackbar.className = 'show';
    
    setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '');
    }, 3000);
};

// Function для рендерингу списку товарів
const renderProducts = () => {
    const productsList = document.getElementById('productsList');
    const emptyMessage = document.getElementById('emptyMessage');
    const totalPriceElement = document.getElementById('totalPrice');
    
    // Застосовуємо фільтр і сортування
    const filteredProducts = filterProducts(state.products, state.filter);
    const sortedProducts = sortProducts(filteredProducts, state.sortBy, state.sortDirection);
    
    // Очищаємо список
    productsList.innerHTML = '';
    
    // Показуємо повідомлення, якщо товарів немає
    if (state.products.length === 0) {
        productsList.appendChild(emptyMessage);
    } else {
        // Показуємо повідомлення, якщо після фільтрації немає товарів
        if (filteredProducts.length === 0) {
            const noFilteredProducts = document.createElement('p');
            noFilteredProducts.textContent = 'Немає товарів у цій категорії.';
            noFilteredProducts.style.gridColumn = '1 / -1';
            noFilteredProducts.style.textAlign = 'center';
            noFilteredProducts.style.padding = '20px';
            productsList.appendChild(noFilteredProducts);
        } else {
            // Додаємо всі товари
            sortedProducts.forEach(product => {
                const productElement = createProductElement(product);
                productsList.appendChild(productElement);
            });
        }
    }
    
    // Оновлюємо загальну вартість
    totalPriceElement.textContent = calculateTotalPrice(state.products);
    
    // Підсвічуємо активну кнопку сортування
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.remove('active');
        
        if (btn.id === 'sortByPrice' && state.sortBy === 'price') {
            btn.classList.add('active');
        } else if (btn.id === 'sortByCreated' && state.sortBy === 'createdAt') {
            btn.classList.add('active');
        } else if (btn.id === 'sortByUpdated' && state.sortBy === 'updatedAt') {
            btn.classList.add('active');
        }
    });
};

// Function для відкриття модального вікна
const openModal = (product = null) => {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');
    
    // Заповнюємо форму, якщо редагуємо товар
    if (product) {
        modalTitle.textContent = 'Редагувати товар';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImage').value = product.imageUrl;
        state.editingProduct = product;
    } else {
        modalTitle.textContent = 'Додати новий товар';
        form.reset();
        document.getElementById('productId').value = '';
        state.editingProduct = null;
    }
    
    modal.style.display = 'block';
    // Фокус на першому полі форми
    document.getElementById('productName').focus();
};

// Function для закриття модального вікна
const closeModal = () => {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
};

// Function для додавання нового товару
const addProduct = (name, price, category, imageUrl) => {
    const newProduct = createProduct(name, price, category, imageUrl);
    state.products.push(newProduct);
    renderProducts();
    
    // Знаходимо новий товар у списку і додаємо анімацію
    setTimeout(() => {
        const productElement = document.querySelector(`.product-card[data-id="${newProduct.id}"]`);
        if (productElement) {
            productElement.classList.add('adding');
        }
    }, 100);
    
    showSnackbar(`Товар "${name}" успішно додано!`);
};

// Function для оновлення товару
const editProduct = (id, updates) => {
    const index = state.products.findIndex(product => product.id === id);
    if (index !== -1) {
        const updatedProduct = updateProduct(state.products[index], {
            name: updates.name,
            price: parseFloat(updates.price),
            category: updates.category,
            imageUrl: updates.imageUrl
        });
        state.products[index] = updatedProduct;
        renderProducts();
        showSnackbar(`Товар ID: ${id}, "${updates.name}" успішно оновлено!`);
    }
};

// Function для видалення товару
const deleteProduct = (id) => {
    const index = state.products.findIndex(product => product.id === id);
    if (index !== -1) {
        const deletedProduct = state.products[index];
        
        // Анімація видалення
        const productElement = document.querySelector(`.product-card[data-id="${id}"]`);
        if (productElement) {
            productElement.classList.add('removing');
            
            setTimeout(() => {
                // Видаляємо з масиву після завершення анімації
                state.products.splice(index, 1);
                renderProducts();
            }, 500);
        } else {
            state.products.splice(index, 1);
            renderProducts();
        }
        
        showSnackbar(`Товар "${deletedProduct.name}" успішно видалено!`);
    }
};

// Запис у локальне сховище
const saveToLocalStorage = () => {
    localStorage.setItem('products', JSON.stringify(state.products));
};

// Завантаження з локального сховища
const loadFromLocalStorage = () => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        try {
            const parsedProducts = JSON.parse(savedProducts);
            
            // Потрібно конвертувати рядки дат назад у об'єкти Date
            state.products = parsedProducts.map(product => ({
                ...product,
                createdAt: new Date(product.createdAt),
                updatedAt: new Date(product.updatedAt)
            }));
            
            renderProducts();
        } catch (error) {
            console.error('Помилка при завантаженні даних:', error);
        }
    }
};

// Обробники подій
document.addEventListener('DOMContentLoaded', () => {
    // Завантаження товарів з локального сховища
    loadFromLocalStorage();
    
    // Обробник подій для кнопки "Додати новий товар"
    document.getElementById('addProductBtn').addEventListener('click', () => {
        openModal();
    });
    
    // Обробник подій для закриття модального вікна
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Обробник подій для відправки форми товару
    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('productId').value;
        const name = document.getElementById('productName').value.trim();
        const price = document.getElementById('productPrice').value;
        const category = document.getElementById('productCategory').value;
        const imageUrl = document.getElementById('productImage').value.trim();
        
        if (!name || !price || !category || !imageUrl) {
            showSnackbar('Будь ласка, заповніть всі поля форми!');
            return;
        }
        
        if (state.editingProduct) {
            editProduct(id, { name, price, category, imageUrl });
        } else {
            addProduct(name, price, category, imageUrl);
        }
        
        closeModal();
        
        // Зберігаємо зміни в локальному сховищі
        saveToLocalStorage();
    });
    
    // Делегування подій для кнопок редагування і видалення
    document.getElementById('productsList').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const productCard = e.target.closest('.product-card');
            const productId = productCard.dataset.id;
            const product = state.products.find(p => p.id === productId);
            if (product) {
                openModal(product);
            }
        } else if (e.target.classList.contains('delete-btn')) {
            const productCard = e.target.closest('.product-card');
            const productId = productCard.dataset.id;
            deleteProduct(productId);
            
            // Зберігаємо зміни в локальному сховищі після затримки, щоб анімація завершилась
            setTimeout(() => {
                saveToLocalStorage();
            }, 500);
        }
    });
    
    // Обробники подій для фільтрації
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            state.filter = category;
            
            // Підсвічуємо активну кнопку
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            renderProducts();
        });
    });
    
    // Обробник подій для скидання фільтра
    document.getElementById('resetFilter').addEventListener('click', () => {
        state.filter = null;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        renderProducts();
    });
    
    // Обробники подій для сортування
    document.getElementById('sortByPrice').addEventListener('click', () => {
        if (state.sortBy === 'price') {
            state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            state.sortBy = 'price';
            state.sortDirection = 'asc';
        }
        renderProducts();
    });
    
    document.getElementById('sortByCreated').addEventListener('click', () => {
        if (state.sortBy === 'createdAt') {
            state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            state.sortBy = 'createdAt';
            state.sortDirection = 'asc';
        }
        renderProducts();
    });
    
    document.getElementById('sortByUpdated').addEventListener('click', () => {
        if (state.sortBy === 'updatedAt') {
            state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            state.sortBy = 'updatedAt';
            state.sortDirection = 'asc';
        }
        renderProducts();
    });
    
    // Обробник подій для скидання сортування
    document.getElementById('resetSort').addEventListener('click', () => {
        state.sortBy = null;
        state.sortDirection = 'asc';
        renderProducts();
    });
    
    // Клацання поза модальним вікном закриває його
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('productModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Клавіша Escape закриває модальне вікно
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});