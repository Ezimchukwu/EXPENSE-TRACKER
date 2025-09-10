// Expense Tracker Application
class ExpenseTracker {
    constructor() {
        this.expenses = this.loadExpenses();
        this.initializeApp();
    }

    // Initialize the application
    initializeApp() {
        this.bindEvents();
        this.renderExpenses();
        this.updateSummary();
    }

    // Bind event listeners
    bindEvents() {
        const form = document.getElementById('expense-form');
        const categoryFilter = document.getElementById('category-filter');
        const dateFilter = document.getElementById('date-filter');

        // Form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Allow Enter key to submit form
        form.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                e.preventDefault();
                this.handleFormSubmit(e);
            }
        });

        // Filter events
        categoryFilter.addEventListener('change', () => this.applyFilters());
        dateFilter.addEventListener('change', () => this.applyFilters());
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('expense-name');
        const amountInput = document.getElementById('expense-amount');
        const categoryInput = document.getElementById('expense-category');

        // Validate inputs
        if (!this.validateInputs(nameInput.value, amountInput.value, categoryInput.value)) {
            return;
        }

        // Create new expense
        const expense = {
            id: Date.now().toString(),
            name: nameInput.value.trim(),
            amount: parseFloat(amountInput.value),
            category: categoryInput.value,
            date: new Date().toISOString()
        };

        // Add expense
        this.addExpense(expense);

        // Clear form
        this.clearForm();

        // Show success feedback
        this.showNotification('Expense added successfully!', 'success');
    }

    // Validate form inputs
    validateInputs(name, amount, category) {
        if (!name.trim()) {
            this.showNotification('Please enter an expense name', 'error');
            return false;
        }

        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            this.showNotification('Please enter a valid amount greater than 0', 'error');
            return false;
        }

        if (!category) {
            this.showNotification('Please select a category', 'error');
            return false;
        }

        return true;
    }

    // Add expense to the list
    addExpense(expense) {
        this.expenses.push(expense);
        this.saveExpenses();
        this.renderExpenses();
        this.updateSummary();
    }

    // Delete expense
    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.saveExpenses();
        this.renderExpenses();
        this.updateSummary();
        this.showNotification('Expense deleted successfully!', 'success');
    }

    // Clear form inputs
    clearForm() {
        document.getElementById('expense-form').reset();
    }

    // Render all expenses
    renderExpenses() {
        const expenseList = document.getElementById('expense-list');
        const filteredExpenses = this.getFilteredExpenses();

        if (filteredExpenses.length === 0) {
            expenseList.innerHTML = '<p class="no-expenses">No expenses found for the selected filters.</p>';
            return;
        }

        expenseList.innerHTML = filteredExpenses.map(expense => this.createExpenseHTML(expense)).join('');

        // Bind delete buttons
        expenseList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this expense?')) {
                    this.deleteExpense(id);
                }
            });
        });
    }

    // Create HTML for a single expense
    createExpenseHTML(expense) {
        const date = new Date(expense.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="expense-item">
                <div class="expense-details">
                    <div class="expense-name">${this.escapeHtml(expense.name)}</div>
                    <div class="expense-meta">
                        <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
                        <span class="expense-category category-${expense.category.toLowerCase()}">${expense.category}</span>
                        <span class="expense-date">${formattedDate}</span>
                    </div>
                </div>
                <button class="delete-btn" data-id="${expense.id}">Delete</button>
            </div>
        `;
    }

    // Get filtered expenses based on current filter settings
    getFilteredExpenses() {
        const categoryFilter = document.getElementById('category-filter').value;
        const dateFilter = document.getElementById('date-filter').value;

        let filtered = [...this.expenses];

        // Apply category filter
        if (categoryFilter) {
            filtered = filtered.filter(expense => expense.category === categoryFilter);
        }

        // Apply date filter
        if (dateFilter) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            filtered = filtered.filter(expense => {
                const expenseDate = new Date(expense.date);
                const expenseDay = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());

                switch (dateFilter) {
                    case 'today':
                        return expenseDay.getTime() === today.getTime();
                    case 'week':
                        const weekAgo = new Date(today);
                        weekAgo.setDate(today.getDate() - 7);
                        return expenseDay >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(today.getMonth() - 1);
                        return expenseDay >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Apply current filters
    applyFilters() {
        this.renderExpenses();
    }

    // Update summary section
    updateSummary() {
        const totalElement = document.getElementById('total-amount');
        const categoryElement = document.getElementById('category-summary');

        // Calculate total
        const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalElement.textContent = `$${total.toFixed(2)}`;

        // Calculate category breakdown
        const categoryTotals = this.calculateCategoryTotals();
        
        if (Object.keys(categoryTotals).length === 0) {
            categoryElement.innerHTML = '<p class="no-data">No expenses to show breakdown</p>';
            return;
        }

        categoryElement.innerHTML = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a) // Sort by amount descending
            .map(([category, amount]) => `
                <div class="category-item ${category.toLowerCase()}">
                    <span class="category-name">${category}</span>
                    <span class="category-amount">$${amount.toFixed(2)}</span>
                </div>
            `).join('');
    }

    // Calculate totals by category
    calculateCategoryTotals() {
        const totals = {};
        this.expenses.forEach(expense => {
            totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
        });
        return totals;
    }

    // Show notification to user
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            ${type === 'success' ? 'background: #38a169;' : ''}
            ${type === 'error' ? 'background: #e53e3e;' : ''}
            ${type === 'info' ? 'background: #3182ce;' : ''}
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Load expenses from localStorage
    loadExpenses() {
        try {
            const stored = localStorage.getItem('expenseTracker');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading expenses:', error);
            return [];
        }
    }

    // Save expenses to localStorage
    saveExpenses() {
        try {
            localStorage.setItem('expenseTracker', JSON.stringify(this.expenses));
        } catch (error) {
            console.error('Error saving expenses:', error);
            this.showNotification('Error saving data. Please try again.', 'error');
        }
    }

    // Export expenses as CSV
    exportToCSV() {
        if (this.expenses.length === 0) {
            this.showNotification('No expenses to export', 'error');
            return;
        }

        const csvContent = [
            ['Name', 'Amount', 'Category', 'Date'],
            ...this.expenses.map(expense => [
                expense.name,
                expense.amount.toFixed(2),
                expense.category,
                new Date(expense.date).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showNotification('Expenses exported successfully!', 'success');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.expenseTracker = new ExpenseTracker();

    // Add export functionality to a keyboard shortcut (Ctrl+E)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            window.expenseTracker.exportToCSV();
        }
    });
});

// Make the class available globally for debugging
window.ExpenseTracker = ExpenseTracker;