import API_URL from './config.js';
import { customerMenuTemplate, userOrdersTemplate, restaurantOrdersTemplate, restaurantDashboardTemplate } from './templates.js';

let activeRestaurantId = null;

function showLoginPrompt(action = 'continue') {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in';

    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative transform transition-all duration-300 scale-100">
            <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
                <p class="text-gray-600 mb-6">Please log in to ${action}</p>
                <button id="login-now-btn" class="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
                    Login Now
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add fade-in animation
    requestAnimationFrame(() => {
        modal.querySelector('div > div').style.transform = 'scale(1.05)';
        setTimeout(() => {
            modal.querySelector('div > div').style.transform = 'scale(1)';
        }, 50);
    });

    // Handle login button click
    modal.querySelector('#login-now-btn').addEventListener('click', () => {
        modal.classList.add('animate-fade-out');
        setTimeout(() => {
            modal.remove();
            window.loadContent('login');
        }, 300);
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('animate-fade-out');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

async function createOrder(orderData) {
    const token = localStorage.getItem("token");
    if (!token) {
        showLoginPrompt('place an order');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Order created successfully! Order ID: ${data.orderId}`);
        } else {
            const errorData = await response.json();
            alert(`Order creation failed: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error("Error creating order:", error);
        alert("Network error during order creation. Check the console for details.");
    }
}

async function loadUserOrders() {
    const token = localStorage.getItem("token");
    if (!token) {
        showLoginPrompt('view your orders');
        loadContent('login');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/orders/user`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            let message = "Failed to load orders.";
            try {
                const clone = res.clone();
                const error = await clone.json();
                message = error.message || message;
            } catch (e) {
                const fallback = await res.text();
                console.warn("Non-JSON error response:", fallback);
            }
            throw new Error(message);
        }

        const orders = await res.json();
        const dynamicContent = document.getElementById('dynamic-content');
        dynamicContent.innerHTML = userOrdersTemplate(orders);

    } catch (err) {
        console.error("Error loading user orders:", err);
        alert("Something went wrong loading your orders.");
    }
}


async function selectRestaurant(restaurantId, restaurantName) {
    activeRestaurantId = restaurantId;

    try {
        // Get restaurant details (for banner, address, rating, etc.)
        const [menuRes, restaurantRes] = await Promise.all([
            fetch(`${API_URL}/menu/by-id/${restaurantId}`),
            fetch(`${API_URL}/restaurants/${restaurantId}`)
        ]);
        
        if (!menuRes.ok || !restaurantRes.ok) {
            const menuText = await menuRes.text();
            const restText = await restaurantRes.text();
            console.error("Failed responses:", { menuStatus: menuRes.status, menuText, restStatus: restaurantRes.status, restText });
            throw new Error("One or more API calls failed.");
        }
        
        const categories = await menuRes.json();
        const restaurant = await restaurantRes.json();

        // Normalize restaurant object to match what customerMenuTemplate expects
        console.log("Raw restaurant data:", restaurant);
        const normalizedRestaurant = {
            id: restaurant.id,
            RestaurantName: restaurant.restaurantName,
            Address: restaurant.address,
            Rating: restaurant.rating,
            PricingTier: restaurant.pricingTier,
            BannerIMG: restaurant.bannerIMG?.startsWith('/') ? restaurant.bannerIMG : `/${restaurant.bannerIMG || ''}`
        };
        console.log("Normalized restaurant data:", normalizedRestaurant);
  
        if (!Array.isArray(categories) || !restaurant) {
            console.error("Invalid restaurant or menu response:", { categories, restaurant });
            throw new Error('Menu or restaurant data is invalid');
        }

        const mapped = categories.map(cat => ({
            name: cat.category,
            displayOrder: cat.displayOrder,
            items: cat.items.map(i => ({
                id: i.id,
                name: i.name,
                description: i.description,
                price: i.price,
                displayOrder: i.displayOrder ?? 0,
                imageUrl: i.imageUrl,
                ingredients: i.ingredients || [],
                calories: i.calories,
                isVegan: i.isVegan,
                isAvailable: i.isAvailable
            }))
        }));

        // Remove any duplicate rating UI blocks first
        const dynamicContent = document.getElementById('dynamic-content');
        dynamicContent.innerHTML = ''; // Clear it

        // Render full menu template with restaurant info (for banner, etc.)
        dynamicContent.innerHTML = customerMenuTemplate(normalizedRestaurant, mapped); 
        
        // Apply the entrance animation to the page
        dynamicContent.classList.add('page-fade-in');

        // After animation finishes, remove the class
        setTimeout(() => {
            dynamicContent.classList.remove('page-fade-in');
        }, 600);

        // Apply pulse animation to menu items with a slight delay for each
        setTimeout(() => {
            const menuItems = document.querySelectorAll('.restaurant-menu-item');
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('pulse-animation');
                    // Remove the class after animation completes
                    setTimeout(() => {
                        item.classList.remove('pulse-animation');
                    }, 400);
                }, index * 100); // Stagger the animations by 100ms
            });
        }, 300);

        const token = localStorage.getItem("token");
        if (!token) {
            // If not logged in, disable order functionality and show login prompt
            document.querySelectorAll('.add-to-order').forEach(button => {
                button.addEventListener('click', () => {
                    showLoginPrompt('place an order');
                });
            });

            document.getElementById('place-order-btn')?.addEventListener('click', () => {
                showLoginPrompt('place an order');
            });

            document.getElementById('submit-rating-btn')?.addEventListener('click', () => {
                showLoginPrompt('rate this restaurant');
            });
        } else {
            // Handle star selection + submission for logged in users
            let selectedRating = 0;

            document.querySelectorAll('.rating-star').forEach(star => {
                star.addEventListener('click', () => {
                    selectedRating = parseInt(star.getAttribute('data-value'), 10);

                    document.querySelectorAll('.rating-star').forEach(s => {
                        s.classList.remove('text-yellow-400');
                        s.classList.add('text-gray-400');
                    });

                    for (let i = 0; i < selectedRating; i++) {
                        document.querySelectorAll('.rating-star')[i].classList.add('text-yellow-400');
                    }
                });
            });

            document.getElementById('submit-rating-btn')?.addEventListener('click', async () => {
                if (selectedRating === 0) {
                    alert("Please select a rating first.");
                    return;
                }

                try {
                    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/rate`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(selectedRating)
                    });

                    if (response.ok) {
                        document.getElementById('rating-feedback').classList.remove('hidden');
                    } else {
                        const result = await response.json();
                        alert(result.message || "Failed to submit rating.");
                    }
                } catch (err) {
                    console.error("Rating error:", err);
                    alert("Error submitting rating.");
                }
            });

            const orderItems = [];

            // Order item handling for logged in users
            document.querySelectorAll('.add-to-order').forEach(button => {
                button.addEventListener('click', () => {
                    const itemName = button.getAttribute('data-item-name');
                    const itemPrice = parseFloat(button.getAttribute('data-item-price'));

                    const existingItem = orderItems.find(item => item.name === itemName);
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        orderItems.push({
                            name: itemName,
                            quantity: 1,
                            price: itemPrice
                        });
                    }

                    updateOrderDisplay(orderItems);
                });
            });

            document.getElementById('place-order-btn')?.addEventListener('click', async () => {
                if (orderItems.length === 0) {
                    alert("Please add at least one item to your order.");
                    return;
                }

                const placeOrderBtn = document.getElementById('place-order-btn');
                placeOrderBtn.disabled = true;

                try {
                    const res = await fetch(`${API_URL}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (!res.ok) throw new Error("Failed to retrieve user info");

                    const user = await res.json();
                    const total = orderItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

                    // Show order confirmation modal
                    showOrderConfirmation(orderItems, total, user.address, user.credit, async (selectedAddress) => {
                        try {
                            const orderData = {
                                RestaurantId: activeRestaurantId,
                                Address: selectedAddress,
                                OrderItems: orderItems
                            };

                            console.log("Sending order data:", orderData);

                            const response = await fetch(`${API_URL}/orders`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(orderData)
                            });

                            const result = await response.json();
                            console.log("Order response:", result);

                            if (response.ok) {
                                const total = orderItems.reduce((sum, i) => sum + i.quantity * i.price, 0);
                                showOrderSuccess(total);
                                orderItems.length = 0;
                                updateOrderDisplay(orderItems);
                                document.querySelectorAll('.add-to-order').forEach(btn => {
                                    btn.disabled = false;
                                    btn.innerHTML = "Add to Order";
                                    btn.classList.remove("flex", "items-center", "space-x-2");
                                });
                                loadContent('my-orders');
                            } else {
                                alert(result.message || "Failed to place order. Please ensure you have sufficient credit and a valid delivery address.");
                            }
                        } catch (err) {
                            console.error("Order failed:", err);
                            alert("Error placing order. Please check your credit balance and delivery address.");
                        } finally {
                            placeOrderBtn.disabled = false;
                        }
                    });
                } catch (err) {
                    console.error("Failed to get user info:", err);
                    alert("Error retrieving user information. Please try again.");
                    placeOrderBtn.disabled = false;
                }
            });
        }

    } catch (error) {
        console.error("Error loading restaurant or menu:", error);
        alert("Something went wrong loading the restaurant or menu.");
    }
}

        async function loadRestaurantDashboard() {
            const restaurantId = localStorage.getItem("restaurantId");
            const token = localStorage.getItem("restaurantToken");
            const dynamicContent = document.getElementById("dynamic-content");

            if (!restaurantId || !token) {
                alert("Not authenticated.");
                loadContent("restaurant-login");
                return;
            }

            async function fetchAndRender() {
                try {
                    // Fetch orders AND rating in parallel
                    const [ordersRes, summaryRes] = await Promise.all([
                        fetch(`${API_URL}/orders/restaurant/${restaurantId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                        fetch(`${API_URL}/restaurants/${restaurantId}/summary`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    ]);

                    if (!ordersRes.ok || !summaryRes.ok) {
                        throw new Error("Failed to load orders or rating.");
                    }

                    const allOrders = await ordersRes.json();
                    const summary = await summaryRes.json();

                    // Filter today's orders (GMT)
                    const today = new Date().toISOString().split('T')[0];
                    const ordersToday = allOrders.filter(order =>
                        new Date(order.orderDate).toISOString().split('T')[0] === today
                    );

                    // Calculate revenue for today
                    const revenueToday = ordersToday.reduce((sum, o) => sum + o.totalAmount, 0);

                    // Get the most recent 5 orders
                    const recent = allOrders
                        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                        .slice(0, 5);

                    // Extract the rating from the summary
                    const averageRating = summary.rating || 0;
                    const ratingCount = summary.ratingCount || 0;  // Ensure ratingCount is also passed

                    // Pass all the data to the template
                    dynamicContent.innerHTML = restaurantDashboardTemplate(ordersToday, revenueToday, recent, averageRating, ratingCount);
                } catch (err) {
                    console.error("Error loading dashboard:", err);
                    alert("Failed to load dashboard.");
                }
            }

            // Initial fetch
            await fetchAndRender();
        }


        async function loadRestaurantOrders(activeStatus = "Pending") {
            const restaurantId = localStorage.getItem("restaurantId");
            const token = localStorage.getItem("restaurantToken");
        
            if (!restaurantId || !token) {
                alert("Restaurant not found or not logged in.");
                loadContent('restaurant-login');
                return;
            }
        
            try {
                const response = await fetch(`${API_URL}/orders/restaurant/${restaurantId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
        
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || "Failed to load orders.");
                }
        
                const allOrders = await response.json();
        
                // Filter by status (unless "All")
                const filtered = activeStatus === "All"
                    ? allOrders
                    : allOrders.filter(o => o.status === activeStatus);
        
                // Inject the filtered orders into the template
                const dynamicContent = document.getElementById('dynamic-content');
                dynamicContent.innerHTML = restaurantOrdersTemplate(filtered, activeStatus);
        
                // Tab switching
                document.querySelectorAll('.status-tab').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const status = btn.getAttribute('data-status');
                        loadRestaurantOrders(status);
                    });

                    // Highlight active
                    if (btn.getAttribute('data-status') === activeStatus) {
                        btn.classList.add('bg-green-500', 'text-white');
                        btn.classList.remove('bg-gray-200', 'text-gray-700');
                    } else {
                        btn.classList.remove('bg-green-500', 'text-white');
                        btn.classList.add('bg-gray-200', 'text-gray-700');
                    }
                });
        
                // Hook up status update buttons
                addStatusButtonListeners(filtered);
        
            } catch (err) {
                console.error("Error loading restaurant orders:", err);
                alert("Something went wrong loading orders.");
            }
        }
        
        // Update order status via API
        async function updateOrderStatus(orderId, newStatus) {
            const restaurantId = localStorage.getItem("restaurantId");
            const token = localStorage.getItem("restaurantToken");

            try {
                const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || "Failed to update order status.");
                }

                return await response.json();  // Return the result
            } catch (error) {
                throw new Error("Failed to update order status: " + error.message);
            }
        }

        function updateOrderDisplay(orderItems) {
            const container = document.getElementById('order-items');
            container.innerHTML = '';

            if (orderItems.length === 0) {
                container.innerHTML = '<p class="text-gray-600">No items added yet</p>';
                document.getElementById('order-total').textContent = '£0.00';
                return;
            }

            let total = 0;

            orderItems.forEach(item => {
                total += item.quantity * item.price;

                const itemHtml = `
                  <div class="flex justify-between items-center border rounded px-4 py-2 bg-white shadow">
                    <div>
                      <p class="font-semibold">${item.name}</p>
                      <p class="text-sm text-gray-500">£${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button class="decrease-btn px-2 py-1 bg-gray-300 rounded" data-item-name="${item.name}">-</button>
                      <span>${item.quantity}</span>
                      <button class="increase-btn px-2 py-1 bg-gray-300 rounded" data-item-name="${item.name}">+</button>
                    </div>
                  </div>
                `;
                container.insertAdjacentHTML('beforeend', itemHtml);
            });

            document.getElementById('order-total').textContent = `£${total.toFixed(2)}`;

            document.querySelectorAll('.increase-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const name = btn.getAttribute('data-item-name');
                    const item = orderItems.find(i => i.name === name);
                    if (item) {
                        item.quantity += 1;
                        updateOrderDisplay(orderItems);
                    }
                });
            });

            document.querySelectorAll('.decrease-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const name = btn.getAttribute('data-item-name');
                    const itemIndex = orderItems.findIndex(i => i.name === name);
                    if (itemIndex > -1) {
                        if (orderItems[itemIndex].quantity > 1) {
                            orderItems[itemIndex].quantity -= 1;
                        } else {
                            orderItems.splice(itemIndex, 1);
                            // Restore Add button
                            const addBtn = document.querySelector(`.add-to-order[data-item-name="${name}"]`);
                            if (addBtn) {
                                addBtn.innerHTML = "Add to Order";
                                addBtn.disabled = false;
                                addBtn.classList.remove("flex", "items-center", "space-x-2");
                            }
                        }
                        updateOrderDisplay(orderItems);
                    }
                });
            });
        }
        

        function showOrderConfirmation(orderItems, total, savedAddress, userCredit, onConfirm) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';
        
            modal.innerHTML = `
              <div class="bg-white p-6 rounded-lg shadow max-w-md w-full relative">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold">Confirm Your Order</h2>
                  <span class="text-sm text-gray-600">Credit: £${userCredit.toFixed(2)}</span>
                </div>
                <p class="mb-2">Total: <strong>£${total.toFixed(2)}</strong></p>
                
                ${savedAddress ? `
                  <label class="block mb-1 text-sm font-medium">Use saved address:</label>
                  <button id="use-saved-address" class="bg-green-100 text-left w-full border border-green-400 rounded px-3 py-2 mb-4 hover:bg-green-200">${savedAddress}</button>
                ` : ''}
        
                <div class="text-center text-gray-400 mb-3 text-sm">or</div>
        
                <button id="show-new-address-form" class="text-blue-600 text-sm underline mb-2">Enter new address</button>
        
                <div id="manual-address-fields" class="hidden">
                  <label class="block text-sm font-medium mb-1">Enter new address:</label>
                  <input type="text" id="door" class="input-field w-full mb-2" placeholder="Door Number">
                  <input type="text" id="street" class="input-field w-full mb-2" placeholder="Street">
                  <input type="text" id="city" class="input-field w-full mb-2" placeholder="City">
                  <input type="text" id="postcode" class="input-field w-full mb-4" placeholder="Postcode">
                </div>
        
                <div class="flex gap-4">
                  <button id="confirm-order" class="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">Confirm Order</button>
                  <button id="cancel-order" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                </div>
              </div>
            `;
        
            document.body.appendChild(modal);
        
            const manualFields = modal.querySelector('#manual-address-fields');
            const showNewAddressBtn = modal.querySelector('#show-new-address-form');
            const confirmBtn = modal.querySelector('#confirm-order');
            const useSavedAddressBtn = modal.querySelector('#use-saved-address');
        
            let selectedAddress = savedAddress || '';
        
            if (useSavedAddressBtn) {
                useSavedAddressBtn.addEventListener('click', () => {
                    manualFields.classList.add('hidden');
                    selectedAddress = savedAddress;
                    confirmBtn.disabled = false;
                });
            }
        
            showNewAddressBtn.addEventListener('click', () => {
                manualFields.classList.toggle('hidden');
                if (!manualFields.classList.contains('hidden')) {
                    selectedAddress = '';
                    confirmBtn.disabled = true;
                }
            });
        
            // Monitor manual address fields
            ['door', 'street', 'city', 'postcode'].forEach(id => {
                const input = modal.querySelector(`#${id}`);
                input?.addEventListener('input', () => {
                    const door = modal.querySelector('#door').value.trim();
                    const street = modal.querySelector('#street').value.trim();
                    const city = modal.querySelector('#city').value.trim();
                    const postcode = modal.querySelector('#postcode').value.trim();
        
                    if (door && street && city && postcode) {
                        selectedAddress = `${door}, ${street}, ${city}, ${postcode}`;
                        confirmBtn.disabled = false;
                    } else {
                        confirmBtn.disabled = true;
                    }
                });
            });
        
            confirmBtn.addEventListener('click', () => {
                if (!selectedAddress) {
                    alert('Please select or enter a delivery address');
                    return;
                }
        
                if (userCredit < total) {
                    alert(`Insufficient credit. Order total is £${total.toFixed(2)} but you have £${userCredit.toFixed(2)}`);
                    return;
                }
        
                onConfirm(selectedAddress);
                modal.remove();
            });
        
            modal.querySelector('#cancel-order').addEventListener('click', () => {
                modal.remove();
            });
        
            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }

        function showStatusUpdateSuccess(newStatus) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in';

            // Define status-specific colors and icons
            const statusConfig = {
                'Preparing': {
                    color: 'green',
                    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>'
                },
                'Ready': {
                    color: 'yellow',
                    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
                },
                'Completed': {
                    color: 'blue',
                    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
                }
            };

            const config = statusConfig[newStatus] || { color: 'green', icon: statusConfig['Completed'].icon };

            modal.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative transform transition-all duration-300 scale-100">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-${config.color}-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg class="w-8 h-8 text-${config.color}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                ${config.icon}
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">Order Status Updated!</h2>
                        <p class="text-gray-600 mb-4">Order is now: <span class="font-semibold">${newStatus}</span></p>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Add fade-in animation
            requestAnimationFrame(() => {
                modal.querySelector('div > div').style.transform = 'scale(1.05)';
                setTimeout(() => {
                    modal.querySelector('div > div').style.transform = 'scale(1)';
                }, 50);
            });

            // Auto dismiss after 2 seconds
            setTimeout(() => {
                modal.classList.add('animate-fade-out');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }, 2000);
        }

        function addStatusButtonListeners(orders) {
            orders.forEach(order => {
                const orderElement = document.querySelector(`[data-order-id="${order.id}"]`);
                if (orderElement) {
                    const buttons = orderElement.querySelectorAll('.order-status-btn');
                    buttons.forEach(button => {
                        button.addEventListener('click', async () => {
                            const newStatus = button.getAttribute('data-status');
                            try {
                                const result = await updateOrderStatus(order.id, newStatus);
                                if (result.success) {
                                    showStatusUpdateSuccess(newStatus);
                                    setTimeout(() => {
                                        loadRestaurantOrders(newStatus);
                                    }, 2300); // Wait for the popup to finish before refreshing
                                }
                            } catch (err) {
                                console.error("Status update failed:", err);
                                alert("Failed to update status.");
                            }
                        });
                    });
                }
            });
        }

        function showOrderSuccess(total) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in';

            modal.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative transform transition-all duration-300 scale-100">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                        <p class="text-gray-600 mb-4">Total paid: £${total.toFixed(2)}</p>
                        <p class="text-sm text-gray-500">Redirecting to your orders...</p>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Add fade-in animation
            requestAnimationFrame(() => {
                modal.querySelector('div > div').style.transform = 'scale(1.05)';
                setTimeout(() => {
                    modal.querySelector('div > div').style.transform = 'scale(1)';
                }, 50);
            });

            // Auto dismiss after 3 seconds
            setTimeout(() => {
                modal.classList.add('animate-fade-out');
                setTimeout(() => {
                    modal.remove();
                    loadContent('my-orders');
                }, 300);
            }, 3000);
        }

export { loadUserOrders, createOrder, selectRestaurant, updateOrderDisplay, loadRestaurantOrders, loadRestaurantDashboard };

  