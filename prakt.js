// Основной массив для хранения расходов
let expenses = [];

// Функция для генерации уникального ID
function generateId() {
    return expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
}

// 1. Функция добавления расхода
function addExpense(title, amount, category) {
    // Проверка на некорректный ввод
    if (!title || typeof title !== 'string' || title.trim() === '') {
        console.log('Ошибка: название расхода должно быть непустой строкой');
        return false;
    }
    
    if (!amount || isNaN(amount) || amount <= 0) {
        console.log('Ошибка: сумма должна быть положительным числом');
        return false;
    }
    
    if (!category || typeof category !== 'string' || category.trim() === '') {
        console.log('Ошибка: категория должна быть непустой строкой');
        return false;
    }
    
    const newExpense = {
        id: generateId(),
        title: title.trim(),
        amount: Number(amount),
        category: category.trim()
    };
    
    expenses.push(newExpense);
    console.log(`Расход "${title}" на сумму ${amount} руб. добавлен в категорию "${category}"`);
    return true;
}

// 2. Функция вывода всех расходов
function printAllExpenses() {
    if (expenses.length === 0) {
        console.log('📭 Список расходов пуст');
        return;
    }
    
    console.log('\n все расходы:');
    console.log('─'.repeat(50));
    
    expenses.forEach(expense => {
        console.log(`ID: ${expense.id}`);
        console.log(`Название: ${expense.title}`);
        console.log(`Сумма: ${expense.amount} руб.`);
        console.log(`Категория: ${expense.category}`);
        console.log('─'.repeat(50));
    });
    
    console.log(`Всего записей: ${expenses.length}`);
    console.log(`Общая сумма: ${getTotalAmount()} руб.\n`);
}

// 3. Функция подсчёта общего баланса
function getTotalAmount() {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

function showTotalAmount() {
    const total = getTotalAmount();
    console.log(` Общая сумма расходов: ${total} руб.`);
    return total;
}

// 4. Функция фильтрации по категории
function getExpensesByCategory(category) {
    if (!category || typeof category !== 'string') {
        console.log('Ошибка: укажите категорию для фильтрации');
        return [];
    }
    
    const filteredExpenses = expenses.filter(expense => 
        expense.category.toLowerCase() === category.toLowerCase()
    );
    
    if (filteredExpenses.length === 0) {
        console.log(` Расходы в категории "${category}" не найдены`);
        return [];
    }
    
    const categoryTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    console.log(`\n Расходы в категории "${category}":`);
    console.log('─'.repeat(50));
    
    filteredExpenses.forEach(expense => {
        console.log(`${expense.title}: ${expense.amount} руб.`);
    });
    
    console.log('─'.repeat(50));
    console.log(` Всего потрачено в категории "${category}": ${categoryTotal} руб.\n`);
    
    return filteredExpenses;
}

// 5. Функция поиска расхода по названию
function findExpenseByTitle(searchString) {
    if (!searchString || typeof searchString !== 'string' || searchString.trim() === '') {
        console.log('Ошибка: введите строку для поиска');
        return null;
    }
    
    const found = expenses.find(expense => 
        expense.title.toLowerCase().includes(searchString.toLowerCase())
    );
    
    if (found) {
        console.log('\n Найден расход:');
        console.log('─'.repeat(50));
        console.log(`ID: ${found.id}`);
        console.log(`Название: ${found.title}`);
        console.log(`Сумма: ${found.amount} руб.`);
        console.log(`Категория: ${found.category}`);
        console.log('─'.repeat(50));
        
        // Возможность добавить дополнительную строку к расходу
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        readline.question('\nХотите добавить комментарий к расходу? (да/нет): ', (answer) => {
            if (answer.toLowerCase() === 'да') {
                readline.question('Введите комментарий: ', (comment) => {
                    found.comment = comment;
                    console.log(' Комментарий добавлен');
                    console.log('Обновленный расход:', found);
                    readline.close();
                });
            } else {
                readline.close();
            }
        });
        
        return found;
    } else {
        console.log(` Расход, содержащий "${searchString}", не найден`);
        return null;
    }
}

// 6. Объект управления приложением
const expenseTracker = {
    expenses: expenses,
    currentIndex: 0,
    
    // Методы объекта
    addExpense: function(title, amount, category) {
        const result = addExpense(title, amount, category);
        this.expenses = expenses; // Обновляем ссылку на массив
        return result;
    },
    
    getTotalAmount: function() {
        return showTotalAmount();
    },
    
    getExpensesByCategory: function(category) {
        return getExpensesByCategory(category);
    },
    
    findExpenseByTitle: function(searchString) {
        return findExpenseByTitle(searchString);
    },
    
    // Навигация по расходам
    next: function() {
        if (this.expenses.length === 0) {
            console.log('Список расходов пуст');
            return null;
        }
        
        this.currentIndex = (this.currentIndex + 1) % this.expenses.length;
        console.log('\n текущий расход:');
        console.log(this.expenses[this.currentIndex]);
        return this.expenses[this.currentIndex];
    },
    
    prev: function() {
        if (this.expenses.length === 0) {
            console.log('Список расходов пуст');
            return null;
        }
        
        this.currentIndex = (this.currentIndex - 1 + this.expenses.length) % this.expenses.length;
        console.log('\n текущий расход:');
        console.log(this.expenses[this.currentIndex]);
        return this.expenses[this.currentIndex];
    },
    
    current: function() {
        if (this.expenses.length === 0) {
            console.log('Список расходов пуст');
            return null;
        }
        
        console.log('\n текущий расход:');
        console.log(this.expenses[this.currentIndex]);
        return this.expenses[this.currentIndex];
    },
    
    // 7. Дополнительный функционал
    removeExpenseById: function(id) {
        const index = this.expenses.findIndex(expense => expense.id === id);
        
        if (index === -1) {
            console.log(`Расход с ID ${id} не найден`);
            return false;
        }
        
        const removed = this.expenses[index];
        this.expenses.splice(index, 1);
        
        // Корректируем текущий индекс
        if (this.expenses.length === 0) {
            this.currentIndex = 0;
        } else if (this.currentIndex >= this.expenses.length) {
            this.currentIndex = this.expenses.length - 1;
        }
        
        console.log(` Расход "${removed.title}" удален`);
        return true;
    },
    
    getCategoryStats: function() {
        if (this.expenses.length === 0) {
            console.log('Нет данных для статистики');
            return {};
        }
        
        const stats = {};
        
        this.expenses.forEach(expense => {
            if (!stats[expense.category]) {
                stats[expense.category] = {
                    count: 0,
                    total: 0,
                    items: []
                };
            }
            
            stats[expense.category].count++;
            stats[expense.category].total += expense.amount;
            stats[expense.category].items.push(expense.title);
        });
        
        console.log('\n статистика по категориям:');
        console.log('═'.repeat(60));
        
        // Сортируем категории по общей сумме (по убыванию)
        const sortedCategories = Object.entries(stats).sort((a, b) => b[1].total - a[1].total);
        
        sortedCategories.forEach(([category, data]) => {
            const percentage = ((data.total / getTotalAmount()) * 100).toFixed(1);
            console.log(`\n папка ${category}:`);
            console.log(`   Количество расходов: ${data.count}`);
            console.log(`   Общая сумма: ${data.total} руб. (${percentage}%)`);
            console.log(`   Расходы: ${data.items.join(', ')}`);
        });
        
        console.log('\n' + '═'.repeat(60));
        
        return stats;
    }
};

// Инициализация тестовыми данными
function initializeTestData() {
    addExpense('Продукты', 4000, 'Еда');
    addExpense('Обед в ресторанчике', 1500, 'Еда');
    addExpense('Трамвайчик', 75, 'Транспорт');
    addExpense('Кино', 800, 'Развлечения');
    addExpense('Бензин', 2000, 'Транспорт');
    addExpense('Пицца', 900, 'Еда');
    addExpense('Учебники', 899, 'Образование');
    console.log('\n Тестовые данные загружены\n');
}

// Функция для демонстрации работы
function demonstrateTracker() {
    console.log('запуск трекера расходов\n');
    
    // Инициализируем тестовые данные
    initializeTestData();
    
    // Демонстрация работы методов
    console.log('='.repeat(60));
    printAllExpenses();
    
    console.log('='.repeat(60));
    expenseTracker.getTotalAmount();
    
    console.log('='.repeat(60));
    expenseTracker.getExpensesByCategory('Еда');
    
    console.log('='.repeat(60));
    expenseTracker.getCategoryStats();
    
    console.log('='.repeat(60));
    expenseTracker.findExpenseByTitle('Такси');
    
    console.log('='.repeat(60));
    console.log('\n Навигация по расходам:');
    expenseTracker.current();
    expenseTracker.next();
    expenseTracker.next();
    expenseTracker.prev();
    
    console.log('='.repeat(60));
    console.log('\n🗑️ Тест удаления:');
    if (expenseTracker.expenses.length > 0) {
        const idToRemove = expenseTracker.expenses[0].id;
        expenseTracker.removeExpenseById(idToRemove);
        console.log('Осталось расходов:', expenseTracker.expenses.length);
    }
    
    console.log('\n Все методы протестированы');
}

// Запускаем демонстрацию
demonstrateTracker();

// Экспортируем для использования в других модулях (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { expenseTracker, expenses, addExpense };
}