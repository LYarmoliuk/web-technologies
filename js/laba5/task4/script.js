document.addEventListener('DOMContentLoaded', function() {
    // Основні структури даних
    const products = new Map(); // Зберігаємо продукти (ключ: ID, значення: об'єкт продукту)
    const categories = new Set(); // Зберігаємо унікальні категорії
    const productChanges = new WeakMap(); // Відстежуємо зміни продуктів (ключ: об'єкт продукту, значення: масив змін)
    const deletedProducts = new WeakSet(); // Зберігаємо видалені продукти
    
    // Допоміжні змінні
    let nextProductId = 1;
    let nextOrderId = 1;
    let currentOrder = new Map(); // Поточне замовлення (ключ: ID продукту, значення: {продукт, кількість})
    const orders = new Map(); // Історія замовлень (ключ: ID замовлення, значення: об'єкт замовлення)
    
    // Отримання елементів DOM
    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productQuantityInput = document.getElementById('product-quantity');
    const productCategoryInput = document.getElementById('product-category');
    const productList = document.getElementById('product-list');
    const cancelEditButton = document.getElementById('cancel-edit');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const orderProductSelect = document.getElementById('order-product');
    const orderQuantityInput = document.getElementById('order-quantity');
    const addToOrderButton = document.getElementById('add-to-order');
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    const submitOrderButton = document.getElementById('submit-order');
    const ordersHistory = document.getElementById('orders-history');
    
    // Функція для генерації часової мітки
    function getTimestamp() {
        const now = new Date();
        return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    }
    
    // Прототип продукту
    class Product {
        constructor(id, name, price, quantity, category = "") {
            this.id = id;
            this.name = name;
            this.price = parseFloat(price);
            this.quantity = parseInt(quantity);
            this.category = category;
            this.createdAt = getTimestamp();
            this.updatedAt = getTimestamp();
        }
        
        update(name, price, quantity, category) {
            // Створюємо запис про зміну
            const change = {
                timestamp: getTimestamp(),
                oldValues: {
                    name: this.name,
                    price: this.price,
                    quantity: this.quantity,
                    category: this.category
                },
                newValues: {
                    name: name || this.name,
                    price: parseFloat(price) || this.price,
                    quantity: parseInt(quantity) || this.quantity,
                    category: category || this.category
                }
            };
            
            // Оновлюємо значення
            this.name = name || this.name;
            this.price = parseFloat(price) || this.price;
            this.quantity = parseInt(quantity) || this.quantity;
            this.category = category || this.category;
            this.updatedAt = getTimestamp();
            
            // Записуємо зміну у WeakMap
            if (!productChanges.has(this)) {
                productChanges.set(this, []);
            }
            productChanges.get(this).push(change);
            
            // Оновлюємо категорії
            if (this.category) {
                categories.add(this.category);
            }
            
            return this;
        }
        
        reduceQuantity(amount) {
            if (amount > this.quantity) {
                throw new Error(`Недостатньо товару на складі. Доступно: ${this.quantity}`);
            }
            
            const change = {
                timestamp: getTimestamp(),
                oldValues: { quantity: this.quantity },
                newValues: { quantity: this.quantity - amount },
                reason: "Замовлення"
            };
            
            this.quantity -= amount;
            this.updatedAt = getTimestamp();
            
            if (!productChanges.has(this)) {
                productChanges.set(this, []);
            }
            productChanges.get(this).push(change);
            
            return this;
        }
    }
    
    // Функції для роботи з продуктами
    function addProduct(name, price, quantity, category = "") {
        const id = nextProductId++;
        const product = new Product(id, name, price, quantity, category);
        products.set(id, product);
        
        // Додаємо категорію до Set
        if (category) {
            categories.add(category);
        }
        
        refreshProductList();
        refreshOrderProductSelect();
        return product;
    }
    
    function updateProduct(id, name, price, quantity, category) {
        const product = products.get(parseInt(id));
        if (product) {
            product.update(name, price, quantity, category);
            refreshProductList();
            refreshOrderProductSelect();
        }
    }
    
    function deleteProduct(id) {
        const product = products.get(parseInt(id));
        if (product) {
            // Додаємо до WeakSet видалених продуктів
            deletedProducts.add(product);
            products.delete(parseInt(id));
            refreshProductList();
            refreshOrderProductSelect();
        }
    }
    
    function getProductChanges(product) {
        return productChanges.get(product) || [];
    }
    
    function searchProducts(query) {
        query = query.toLowerCase();
        const results = [];
        
        products.forEach(product => {
            if (product.name.toLowerCase().includes(query)) {
                results.push(product);
            }
        });
        
        return results;
    }
    
    // Функції рендерингу інтерфейсу
    function refreshProductList() {
        productList.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>${product.category}</td>
                <td>
                    <button class="edit" data-id="${product.id}">Редагувати</button>
                    <button class="delete" data-id="${product.id}">Видалити</button>
                </td>
            `;
            
            productList.appendChild(row);
        });
        
        // Додаємо обробники подій для кнопок
        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', handleEditProduct);
        });
        
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', handleDeleteProduct);
        });
    }
    
    function refreshOrderProductSelect() {
        orderProductSelect.innerHTML = '<option value="">Виберіть продукт</option>';
        
        products.forEach(product => {
            if (product.quantity > 0) {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} - ${product.price.toFixed(2)} грн (${product.quantity} шт.)`;
                orderProductSelect.appendChild(option);
            }
        });
    }
    
    function refreshCurrentOrder() {
        orderItems.innerHTML = '';
        let total = 0;
        
        currentOrder.forEach((item, productId) => {
            const product = item.product;
            const quantity = item.quantity;
            const subtotal = product.price * quantity;
            total += subtotal;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${quantity}</td>
                <td>${subtotal.toFixed(2)}</td>
                <td><button class="remove" data-id="${product.id}">Видалити</button></td>
            `;
            
            orderItems.appendChild(row);
        });
        
        orderTotal.textContent = total.toFixed(2);
        
        // Додаємо обробники подій для кнопок видалення
        document.querySelectorAll('.remove').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                currentOrder.delete(productId);
                refreshCurrentOrder();
            });
        });
    }
    
    function refreshOrdersHistory() {
        ordersHistory.innerHTML = '';
        
        // Сортуємо замовлення за номером (від найновіших до найстаріших)
        const sortedOrders = Array.from(orders).sort((a, b) => b[0] - a[0]);
        
        sortedOrders.forEach(([orderId, order]) => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            
            let orderContent = `
                <h4>Замовлення #${orderId}</h4>
                <p><strong>Дата:</strong> ${order.date}</p>
                <p><strong>Загальна сума:</strong> ${order.total.toFixed(2)} грн</p>
                <p><strong>Товари:</strong></p>
            `;
            
            order.items.forEach(item => {
                orderContent += `
                    <div class="order-item">
                        ${item.name} - ${item.price.toFixed(2)} грн x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} грн
                    </div>
                `;
            });
            
            orderCard.innerHTML = orderContent;
            ordersHistory.appendChild(orderCard);
        });
    }
    
    // Обробники подій
    function handleEditProduct() {
        const id = parseInt(this.getAttribute('data-id'));
        const product = products.get(id);
        
        if (product) {
            productIdInput.value = product.id;
            productNameInput.value = product.name;
            productPriceInput.value = product.price;
            productQuantityInput.value = product.quantity;
            productCategoryInput.value = product.category;
            
            cancelEditButton.style.display = 'block';
        }
    }
    
    function handleDeleteProduct() {
        const id = parseInt(this.getAttribute('data-id'));
        
        if (confirm(`Ви дійсно хочете видалити продукт з ID ${id}?`)) {
            deleteProduct(id);
        }
    }
    
    // Додавання обробників подій для форм
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = productIdInput.value;
        const name = productNameInput.value;
        const price = productPriceInput.value;
        const quantity = productQuantityInput.value;
        const category = productCategoryInput.value;
        
        if (id) {
            // Оновлення існуючого продукту
            updateProduct(id, name, price, quantity, category);
        } else {
            // Додавання нового продукту
            addProduct(name, price, quantity, category);
        }
        
        // Очищаємо форму
        productForm.reset();
        productIdInput.value = '';
        cancelEditButton.style.display = 'none';
    });
    
    cancelEditButton.addEventListener('click', function() {
        productForm.reset();
        productIdInput.value = '';
        cancelEditButton.style.display = 'none';
    });
    
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        
        if (query) {
            const results = searchProducts(query);
            
            if (results.length > 0) {
                let resultsHTML = '<h3>Результати пошуку:</h3><ul>';
                
                results.forEach(product => {
                    resultsHTML += `
                        <li>
                            <strong>${product.name}</strong> (ID: ${product.id})<br>
                            Ціна: ${product.price.toFixed(2)} грн, Кількість: ${product.quantity}, Категорія: ${product.category || 'Не вказано'}
                        </li>
                    `;
                });
                
                resultsHTML += '</ul>';
                searchResults.innerHTML = resultsHTML;
            } else {
                searchResults.innerHTML = '<p>Нічого не знайдено.</p>';
            }
            
            searchResults.classList.add('show');
        }
    });
    
    addToOrderButton.addEventListener('click', function() {
        const productId = parseInt(orderProductSelect.value);
        const quantity = parseInt(orderQuantityInput.value);
        
        if (!productId || isNaN(productId)) {
            alert('Будь ласка, виберіть продукт');
            return;
        }
        
        if (!quantity || quantity <= 0) {
            alert('Будь ласка, введіть коректну кількість');
            return;
        }
        
        const product = products.get(productId);
        
        if (product) {
            if (quantity > product.quantity) {
                alert(`Недостатньо товару на складі. Доступно: ${product.quantity}`);
                return;
            }
            
            // Додаємо або оновлюємо товар у замовленні
            if (currentOrder.has(productId)) {
                const currentItem = currentOrder.get(productId);
                const newQuantity = currentItem.quantity + quantity;
                
                if (newQuantity > product.quantity) {
                    alert(`Недостатньо товару на складі. Доступно: ${product.quantity}`);
                    return;
                }
                
                currentOrder.set(productId, { product, quantity: newQuantity });
            } else {
                currentOrder.set(productId, { product, quantity });
            }
            
            refreshCurrentOrder();
            orderQuantityInput.value = 1;
        }
    });
    
    submitOrderButton.addEventListener('click', function() {
        if (currentOrder.size === 0) {
            alert('Замовлення порожнє. Додайте товари до замовлення.');
            return;
        }
        
        try {
            // Створюємо об'єкт замовлення
            const orderItems = [];
            let orderTotal = 0;
            
            // Зменшуємо кількість товару на складі
            currentOrder.forEach((item, productId) => {
                const product = products.get(productId);
                const quantity = item.quantity;
                
                product.reduceQuantity(quantity);
                
                orderItems.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity
                });
                
                orderTotal += product.price * quantity;
            });
            
            // Зберігаємо замовлення в історії
            const order = {
                id: nextOrderId++,
                date: getTimestamp(),
                items: orderItems,
                total: orderTotal
            };
            
            orders.set(order.id, order);
            
            // Очищаємо поточне замовлення
            currentOrder.clear();
            
            // Оновлюємо інтерфейс
            refreshCurrentOrder();
            refreshProductList();
            refreshOrderProductSelect();
            refreshOrdersHistory();
            
            alert(`Замовлення #${order.id} успішно оформлено!`);
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Додавання тестових даних
    function addSampleData() {
        addProduct('Ноутбук Lenovo ThinkPad', 25999.99, 5, 'Електроніка');
        addProduct('Смартфон Samsung Galaxy S21', 21499.99, 10, 'Електроніка');
        addProduct('Навушники Sony WH-1000XM4', 8999.99, 15, 'Аудіо');
        addProduct('Клавіатура Logitech MX Keys', 3499.99, 8, 'Комп\'ютерні аксесуари');
        addProduct('Монітор Dell UltraSharp 27"', 12999.99, 3, 'Електроніка');
        addProduct('USB-кабель Type-C', 199.99, 50, 'Комп\'ютерні аксесуари');
        addProduct('Мишка Logitech MX Master 3', 2999.99, 12, 'Комп\'ютерні аксесуари');
    }
    
    // Функція для перевірки використання структур даних (для демонстрації)
    function demonstrateDataStructures() {
        console.log("Демонстрація структур даних:");
        
        // Map - продукти
        console.log("Map (products):");
        console.log(`Розмір: ${products.size}`);
        console.log("Ключі (ID продуктів):", Array.from(products.keys()));
        
        // Set - категорії
        console.log("Set (categories):");
        console.log(`Розмір: ${categories.size}`);
        console.log("Унікальні категорії:", Array.from(categories));
        
        // WeakMap - зміни продуктів
        console.log("WeakMap (productChanges):");
        let changesCount = 0;
        products.forEach(product => {
            const changes = productChanges.get(product);
            if (changes) changesCount += changes.length;
        });
        console.log(`Загальна кількість змін: ${changesCount}`);
        
        // WeakSet - видалені продукти
        console.log("WeakSet (deletedProducts):");
        console.log("Використано для тимчасового зберігання видалених продуктів");
    }
    
    // Додавання кнопки для демонстрації структур даних у консолі
    function addDemoButton() {
        const demoButton = document.createElement('button');
        demoButton.textContent = 'Показати структури даних у консолі';
        demoButton.style.margin = '20px 0';
        demoButton.addEventListener('click', demonstrateDataStructures);
        
        const infoSection = document.querySelector('.info-section');
        infoSection.appendChild(demoButton);
    }
    
    // Ініціалізація додатку
    function init() {
        refreshProductList();
        refreshOrderProductSelect();
        refreshCurrentOrder();
        addSampleData();
        addDemoButton();
        
        // Пояснення використання структур даних
        console.log("Структури даних у програмі:");
        console.log("- Map (products): Використовується для зберігання продуктів, де ключ - ID продукту, а значення - об'єкт продукту.");
        console.log("- Set (categories): Зберігає унікальні категорії продуктів.");
        console.log("- WeakMap (productChanges): Відстежує історію змін продуктів, де ключем є сам об'єкт продукту.");
        console.log("- WeakSet (deletedProducts): Зберігає посилання на видалені продукти для потенційного відновлення.");
    }
    
    // Запуск ініціалізації
    init();
});