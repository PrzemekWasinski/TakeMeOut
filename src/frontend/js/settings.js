import API_URL from './config.js';
import { logout } from './auth.js';

let dangerZoneAudio;

//Function to load setting spage
function loadSettingsPage() {
    //Load danger zone audio
    dangerZoneAudio = new Audio('music/danger_zone.mp3');
    dangerZoneAudio.load();
    dangerZoneAudio.volume = 0.3;
    
    const isRestaurant = localStorage.getItem("isRestaurant") === "true";
    //Create settings HTML
    document.getElementById("dynamic-content").innerHTML = `
        <div class="max-w-2xl mx-auto px-8 pt-20 pb-16 slide-up">
            <div class="bg-white shadow-md rounded-lg p-8">
                <h1 class="text-2xl font-bold mb-8">Settings</h1>
                
                <!-- Balance Management Section -->
                <div class="mb-12">
                    <h2 class="text-lg font-semibold mb-4">Available Balance</h2>
                    <div class="flex items-center gap-4 mb-6">
                        <div class="bg-gray-100 px-4 py-2 rounded-md">
                            <span class="text-gray-600">Current Balance:</span>
                            <span id="current-balance" class="font-semibold ml-2">£0.00</span>
                        </div>
                    </div>
                    
                    ${isRestaurant ? `
                        <div class="space-y-4">
                            <h3 class="text-md font-medium">Withdraw Funds</h3>
                            <div class="bg-white border-2 border-gray-200 rounded-md p-4 mb-4">
                                <div class="mb-4">
                                    <label for="bank-account" class="block text-sm font-medium text-gray-700 mb-2">Bank Account Details</label>
                                    <input type="text" id="bank-account" 
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter bank account number">
                                </div>
                                <div class="mb-4">
                                    <label for="sort-code" class="block text-sm font-medium text-gray-700 mb-2">Sort Code</label>
                                    <input type="text" id="sort-code" 
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter sort code">
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <button class="withdraw-btn bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors" data-amount="50">
                                    £50
                                </button>
                                <button class="withdraw-btn bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors" data-amount="100">
                                    £100
                                </button>
                                <button class="withdraw-btn bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors" data-amount="200">
                                    £200
                                </button>
                            </div>
                            <div class="flex items-center gap-4 mt-4">
                                <div class="relative flex-1">
                                    <input type="number" id="custom-amount" min="1" step="1" 
                                        class="w-full pl-6 pr-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:ring-0"
                                        placeholder="Enter custom amount">
                                    <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                                </div>
                                <button id="custom-withdraw" 
                                    class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors">
                                    Withdraw
                                </button>
                            </div>
                            <p class="text-sm text-gray-500 mt-2">Note: Withdrawals are typically processed within 1-3 business days.</p>
                        </div>
                    ` : `
                        <div class="space-y-4">
                            <h3 class="text-md font-medium">Top Up Credit</h3>
                            <div class="grid grid-cols-3 gap-4">
                                <button class="top-up-btn bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors" data-amount="10">
                                    £10
                                </button>
                                <button class="top-up-btn bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors" data-amount="20">
                                    £20
                                </button>
                                <button class="top-up-btn bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors" data-amount="50">
                                    £50
                                </button>
                            </div>
                            <div class="flex items-center gap-4 mt-4">
                                <div class="relative flex-1">
                                    <input type="number" id="custom-amount" min="1" step="1" 
                                        class="w-full pl-6 pr-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:ring-0"
                                        placeholder="Enter custom amount">
                                    <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                                </div>
                                <button id="custom-top-up" 
                                    class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors">
                                    Top Up
                                </button>
                            </div>
                        </div>
                    `}
                </div>

                <!-- Account Management Section -->
                <div class="border-t pt-8">
                    <h2 class="text-lg font-semibold mb-4 text-red-600" id="danger-zone-heading">Danger Zone</h2>
                    <div class="bg-red-50 border border-red-200 rounded-md p-4" id="danger-zone-box">
                        <h3 class="text-md font-medium text-red-800 mb-2">Delete Account</h3>
                        <p class="text-red-600 text-sm mb-4">
                            Warning: This action cannot be undone. All your data, including ${isRestaurant ? 'menu items, orders, and earnings' : 'order history and saved addresses'}, will be permanently deleted.
                        </p>
                        <button id="delete-account" 
                            class="bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium py-2 px-4 rounded-md transition-colors">
                            Delete My Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    //Load details and setup audio
    loadUserCredit();
    setupEventListeners();
    setupDangerZoneAudio();
}

//Function to fetch the user's current balance
async function loadUserCredit() {
    try {
        //If a restaurant is logged in
        const isRestaurant = localStorage.getItem("isRestaurant") === "true";
        let token, restaurantId;
        
        if (isRestaurant) {
            token = localStorage.getItem("restaurantToken");
            restaurantId = localStorage.getItem("restaurantId");
            if (!token || !restaurantId) {
                console.error('Restaurant credentials not found');
                return;
            }

            // Get revenue from the dashboard endpoint
            const response = await fetch(`${API_URL}/orders/restaurant/${restaurantId}/dashboard`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            if (!response.ok) throw new Error('Failed to fetch balance');

            const data = await response.json();
            const balance = data.revenueToday || 0;
            document.getElementById("current-balance").textContent = `£${balance.toFixed(2)}`;
        } else {
            token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            if (!response.ok) throw new Error('Failed to fetch balance');

            const data = await response.json();
            const balance = data.credit || 0;
            document.getElementById("current-balance").textContent = `£${balance.toFixed(2)}`;
        }
    } catch (error) {
        console.error('Error loading balance:', error);
        document.getElementById("current-balance").textContent = `£0.00`;
    }
}

async function withdrawCredit(amount) {
    try {
        const token = localStorage.getItem("restaurantToken");
        const restaurantId = localStorage.getItem("restaurantId");
        if (!token || !restaurantId) {
            showErrorModal("Please log in to withdraw funds");
            return;
        }

        const bankAccount = document.getElementById('bank-account').value;
        const sortCode = document.getElementById('sort-code').value;

        if (!bankAccount || !sortCode) {
            showErrorModal("Please enter both bank account number and sort code");
            return;
        }

        if (!amount || amount <= 0) {
            showErrorModal("Please enter a valid withdrawal amount");
            return;
        }

        const currentBalance = parseFloat(document.getElementById("current-balance").textContent.replace('£', ''));
        if (amount > currentBalance) {
            showErrorModal(`Insufficient funds. Available balance is £${currentBalance.toFixed(2)}`);
            return;
        }

        const response = await fetch(`${API_URL}/orders/restaurant/${restaurantId}/withdraw`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                amount,
                bankAccount,
                sortCode
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to process withdrawal');
        }

        // Fetch updated balance from dashboard
        const dashboardResponse = await fetch(`${API_URL}/orders/restaurant/${restaurantId}/dashboard`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!dashboardResponse.ok) {
            throw new Error('Failed to fetch updated balance');
        }

        const dashboardData = await dashboardResponse.json();
        document.getElementById("current-balance").textContent = `£${(dashboardData.revenueToday || 0).toFixed(2)}`;
        
        // Clear the input fields
        document.getElementById('bank-account').value = '';
        document.getElementById('sort-code').value = '';
        document.getElementById('custom-amount').value = '';
        
        showSuccessModal(`Withdrawal of £${amount.toFixed(2)} has been initiated. It will be processed within 1-3 business days.`);
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        showErrorModal(error.message || 'Failed to process withdrawal. Please try again.');
    }
}

function showErrorModal(message) {
    const modalHTML = `
        <div id="error-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-6">
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-red-600 mb-2">Error</h3>
                    <p class="text-gray-600">${message}</p>
                </div>
                <div class="flex justify-end">
                    <button id="close-error" 
                        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('error-modal');
    const closeButton = document.getElementById('close-error');

    const closeModal = () => {
        modal.remove();
    };

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function showSuccessModal(message) {
    const modalHTML = `
        <div id="success-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-6">
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-green-600 mb-2">Success</h3>
                    <p class="text-gray-600">${message}</p>
                </div>
                <div class="flex justify-end">
                    <button id="close-success" 
                        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('success-modal');
    const closeButton = document.getElementById('close-success');

    const closeModal = () => {
        modal.remove();
    };

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

async function topUpCredit(amount) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            showErrorModal("Please log in to top up credit");
            return;
        }

        const response = await fetch(`${API_URL}/auth/topup`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount })
        });

        if (!response.ok) throw new Error('Failed to top up credit');

        const data = await response.json();
        document.getElementById("current-balance").textContent = `£${(data.newBalance || 0).toFixed(2)}`;
        showSuccessModal(`Successfully added £${amount.toFixed(2)} to your balance! Your new balance is £${(data.newBalance || 0).toFixed(2)}.`);
    } catch (error) {
        console.error('Error topping up credit:', error);
        showErrorModal('Failed to top up credit. Please try again.');
    }
}

async function deleteAccount() {
    // Create and show the confirmation modal
    const modalHTML = `
        <div id="delete-account-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-6">
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
                    <p class="text-gray-600">Are you absolutely sure you want to delete your account? This action cannot be undone.</p>
                </div>
                <div class="mb-6">
                    <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">Please enter your password to confirm:</label>
                    <input type="password" id="confirm-password" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your password">
                    <p id="password-error" class="mt-1 text-sm text-red-600 hidden"></p>
                </div>
                <div class="flex justify-end space-x-4">
                    <button id="cancel-delete" 
                        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">
                        Cancel
                    </button>
                    <button id="confirm-delete" 
                        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>`;

    // Add modal to the page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('delete-account-modal');
    const cancelButton = document.getElementById('cancel-delete');
    const confirmButton = document.getElementById('confirm-delete');
    const passwordInput = document.getElementById('confirm-password');
    const passwordError = document.getElementById('password-error');

    // Handle modal close
    const closeModal = () => {
        modal.remove();
    };

    // Setup event listeners
    cancelButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Handle confirmation
    confirmButton.addEventListener('click', async () => {
        const password = passwordInput.value;
        if (!password) {
            passwordError.textContent = 'Password is required';
            passwordError.classList.remove('hidden');
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in first");
                closeModal();
                return;
            }

            confirmButton.disabled = true;
            confirmButton.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...`;

            const response = await fetch(`${API_URL}/auth/delete-account`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    passwordError.textContent = 'Incorrect password';
                    passwordError.classList.remove('hidden');
                    confirmButton.disabled = false;
                    confirmButton.textContent = 'Delete Account';
                    return;
                }
                throw new Error(`Failed to delete account. Status: ${response.status}`);
            }

            closeModal();
            alert('Your account has been successfully deleted.');
            logout();
            window.location.href = '/';
        } catch (error) {
            console.error("Error deleting account:", error);
            passwordError.textContent = 'An error occurred while deleting your account. Please try again.';
            passwordError.classList.remove('hidden');
            confirmButton.disabled = false;
            confirmButton.textContent = 'Delete Account';
        }
    });
}

function setupEventListeners() {
    const isRestaurant = localStorage.getItem("isRestaurant") === "true";
    
    if (isRestaurant) {
        // Set up withdrawal button listeners
        document.querySelectorAll('.withdraw-btn').forEach(button => {
            button.addEventListener('click', () => {
                const amount = parseFloat(button.dataset.amount);
                withdrawCredit(amount);
            });
        });

        // Set up custom withdrawal button listener
        document.getElementById('custom-withdraw').addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('custom-amount').value);
            if (isNaN(amount) || amount <= 0) {
                showErrorModal('Please enter a valid amount');
                return;
            }
            withdrawCredit(amount);
        });
    } else {
        // Set up top-up button listeners
        document.querySelectorAll('.top-up-btn').forEach(button => {
            button.addEventListener('click', () => {
                const amount = parseFloat(button.dataset.amount);
                topUpCredit(amount);
            });
        });

        // Set up custom top-up button listener
        document.getElementById('custom-top-up').addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('custom-amount').value);
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }
            topUpCredit(amount);
        });
    }

    // Set up delete account button listener
    document.getElementById('delete-account').addEventListener('click', deleteAccount);
}

function setupDangerZoneAudio() {
    const dangerZoneBox = document.getElementById('danger-zone-box');

    dangerZoneBox.addEventListener('mouseenter', () => {
        if (dangerZoneAudio.paused) {
            dangerZoneAudio.currentTime = 0;
            dangerZoneAudio.play();
        }
    });

    dangerZoneBox.addEventListener('mouseleave', () => {
        dangerZoneAudio.pause();
    });
}

export { loadSettingsPage }; 