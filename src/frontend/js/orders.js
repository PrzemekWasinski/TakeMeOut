import API_URL from './config.js';
import { customerMenuTemplate, userOrdersTemplate, restaurantOrdersTemplate, restaurantDashboardTemplate } from './templates.js';

let activeRestaurantId = null;

//Function to show a login prompt modal when user tries to access a restricted action
function showLoginPrompt(action = 'continue') {
    //Create the popup container element
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in';

    //Set the popup's inner HTML with login prompt content
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative transform transition-all duration-300 scale-100">
            <div class="text-center">
                <!-- Icon container -->
                <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <!-- Text content -->
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
                <p class="text-gray-600 mb-6">Please log in to ${action}</p>
                <!-- Login button -->
                <button id="login-now-btn" class="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
                    Login Now
                </button>
            </div>
        </div>
    `;

    //Append the popup to the body of the document
    document.body.appendChild(modal);

    //Start zoom in animation
    requestAnimationFrame(() => {
        modal.querySelector('div > div').style.transform = 'scale(1.05)';
        setTimeout(() => {
            modal.querySelector('div > div').style.transform = 'scale(1)';
        }, 50);
    });

    //Handle the login button click
    modal.querySelector('#login-now-btn').addEventListener('click', () => {
        //Start fade-out animation
        modal.classList.add('animate-fade-out');
        setTimeout(() => {
            modal.remove(); // Remove popup 
            window.loadContent('login'); //Navigate user to login page
        }, 300);
    });

    //Allow popup to close if the user clicks outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('animate-fade-out');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

//Function to create orders
async function createOrder(orderData) {
    const token = localStorage.getItem("token");
    if (!token) {
        showLoginPrompt('place an order');
        return;
    }
    //Send order to server
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        //If order was successful
        if (response.ok) {
            const data = await response.json();
            alert(`Order created successfully! Order ID: ${data.orderId}`);
        //If order failed
        } else {
            const errorData = await response.json();
            alert(`Order creation failed: ${errorData.message || response.statusText}`);
        }
    //Catch errors
    } catch (error) {
        console.error("Error creating order:", error);
        alert("Network error during order creation. Check the console for details.");
    }
}

//Function to load the user's orders
async function loadUserOrders() {
    //Check if user is logged in
    const token = localStorage.getItem("token");
    //If not logged in
    if (!token) {
        showLoginPrompt('view your orders');
        loadContent('login');
        return;
    }
    //Fetch orders
    try {
        const res = await fetch(`${API_URL}/orders/user`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        //If fetching orders failed
        if (!res.ok) {
            let message = "Failed to load orders.";
            try {
                const clone = res.clone();
                const error = await clone.json();
                message = error.message || message;
            //Catch errors
            } catch (e) {
                const fallback = await res.text();
                console.warn("Non-JSON error response:", fallback);
            }
            throw new Error(message);
        }

        const orders = await res.json();
        const dynamicContent = document.getElementById('dynamic-content');
        dynamicContent.innerHTML = userOrdersTemplate(orders);
    //Catch errors
    } catch (err) {
        console.error("Error loading user orders:", err);
        alert("Something went wrong loading your orders.");
    }
}

//Function to load selected restauran tdata
async function selectRestaurant(restaurantId, restaurantName) {
    activeRestaurantId = restaurantId;

    try {
        //Get restauran tdetails
        const [menuRes, restaurantRes] = await Promise.all([
            fetch(`${API_URL}/menu/by-id/${restaurantId}`),
            fetch(`${API_URL}/restaurants/${restaurantId}`)
        ]);
        //If one of the responses wasnt successful
        if (!menuRes.ok || !restaurantRes.ok) {
            const menuText = await menuRes.text();
            const restText = await restaurantRes.text();
            console.error("Failed responses:", { menuStatus: menuRes.status, menuText, restStatus: restaurantRes.status, restText });
            throw new Error("One or more API calls failed.");
        }
        
        const categories = await menuRes.json();
        const restaurant = await restaurantRes.json();

        //Match the template
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
        //Restaurant information
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

        //Remove duplicate ratings
        const dynamicContent = document.getElementById('dynamic-content');
        dynamicContent.innerHTML = '';

        //Show menu
        dynamicContent.innerHTML = customerMenuTemplate(normalizedRestaurant, mapped); 
        
        //Start animation
        dynamicContent.classList.add('page-fade-in');

        //After animation ends remove class
        setTimeout(() => {
            dynamicContent.classList.remove('page-fade-in');
        }, 600);

        //Animation for menu items
        setTimeout(() => {
            const menuItems = document.querySelectorAll('.restaurant-menu-item');
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('pulse-animation');
                    //Remove class after animation completes
                    setTimeout(() => {
                        item.classList.remove('pulse-animation');
                    }, 400);
                }, index * 100); 
            });
        }, 300);

        const token = localStorage.getItem("token");
        if (!token) {
            //If not logged in disable order functionality and show login prompt
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
            //Handle star selection and submit if user is loged in
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
                //Send the user's rating
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

            //Add to order handling
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
            //Listener for place order button
            document.getElementById('place-order-btn')?.addEventListener('click', async () => {
                if (orderItems.length === 0) {
                    alert("Please add at least one item to your order.");
                    return;
                }

                const placeOrderBtn = document.getElementById('place-order-btn');
                placeOrderBtn.disabled = true;
                //Retrieve user information
                try {
                    const res = await fetch(`${API_URL}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (!res.ok) throw new Error("Failed to retrieve user info");

                    const user = await res.json();
                    const total = orderItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

                    //Show order confirmation popup
                    showOrderConfirmation(orderItems, total, user.address, user.credit, async (selectedAddress) => {
                        try {
                            const orderData = {
                                RestaurantId: activeRestaurantId,
                                Address: selectedAddress,
                                OrderItems: orderItems.map(item => ({
                                    ItemName: item.name,
                                    Quantity: item.quantity,
                                    UnitPrice: item.price
                                }))
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
                            } else {
                                alert(result.message || "Failed to place order. Please ensure you have sufficient credit and a valid delivery address.");
                            }
                        } catch (err) {
                            console.error("Order failed:", err);
                            alert("Error placing order. Please check your credit balance and delivery address.");
                        } finally {
                            placeOrderBtn.disabled = false;
                        }
                    }, () => {
                        placeOrderBtn.disabled = false;
                    });
                //Catch errors
                } catch (err) {
                    console.error("Failed to get user info:", err);
                    alert("Error retrieving user information. Please try again.");
                    placeOrderBtn.disabled = false;
                }
            });
        }
    //Catch errors
    } catch (error) {
        console.error("Error loading restaurant or menu:", error);
        alert("Something went wrong loading the restaurant or menu.");
    }
}

//Function to load restaurant dashboard
async function loadRestaurantDashboard() {
    const restaurantId = localStorage.getItem("restaurantId");
    const token = localStorage.getItem("restaurantToken");
    const dynamicContent = document.getElementById("dynamic-content");
    //If restaurant isnt logged in
    if (!restaurantId || !token) {
        alert("Not authenticated.");
        loadContent("restaurant-login");
        return;
    }
    //Function fetch and render data from db
    async function fetchAndRender() {
        try {
            const token = localStorage.getItem("restaurantToken");
            const restaurantId = localStorage.getItem("restaurantId");

            if (!token || !restaurantId) {
                throw new Error("Missing authentication credentials");
            }

            console.log("Fetching orders and summary for restaurant:", restaurantId);

            //Fetch orders and rating
            const [ordersRes, summaryRes] = await Promise.all([
                fetch(`${API_URL}/orders/restaurant/${restaurantId}`, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    }
                }),
                fetch(`${API_URL}/restaurants/${restaurantId}/summary`, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    }
                })
            ]);

            console.log("Orders response status:", ordersRes.status);
            console.log("Summary response status:", summaryRes.status);

            //If both responses returned successfully
            if (!ordersRes.ok) {
                const errorData = await ordersRes.json().catch(() => ({}));
                throw new Error(`Failed to load orders. Status: ${ordersRes.status}. ${errorData.message || ''}`);
            }

            if (!summaryRes.ok) {
                const errorData = await summaryRes.json().catch(() => ({}));
                throw new Error(`Failed to load summary. Status: ${summaryRes.status}. ${errorData.message || ''}`);
            }

            const allOrders = await ordersRes.json();
            const summary = await summaryRes.json();

            //Filter todays orders
            const today = new Date().toISOString().split('T')[0];
            const ordersToday = allOrders.filter(order =>
                new Date(order.orderDate).toISOString().split('T')[0] === today
            );

            //Calculate revenue for today
            const revenueToday = ordersToday.reduce((sum, o) => sum + o.totalAmount, 0);

            //Get the 5 most recent orders
            const recent = allOrders
                .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                .slice(0, 5);

            const averageRating = summary.rating || 0;
            const ratingCount = summary.ratingCount || 0;

            //Put all data in template
            dynamicContent.innerHTML = restaurantDashboardTemplate(ordersToday, revenueToday, recent, averageRating, ratingCount);
        //Catch errors
        } catch (err) {
            console.error("Error loading dashboard:", err);
            dynamicContent.innerHTML = `
                <div class="max-w-2xl mx-auto px-8 pt-20">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 class="text-red-800 font-medium">Error Loading Dashboard</h3>
                        <p class="text-red-600 mt-2">${err.message}</p>
                        <button onclick="location.reload()" class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md transition-colors">
                            Retry
                        </button>
                    </div>
                </div>
            `;
        }
    }
    //Fetch data
    await fetchAndRender();
}

//Load restaurant orders function
async function loadRestaurantOrders(activeStatus = "Pending") {
    const restaurantId = localStorage.getItem("restaurantId");
    const token = localStorage.getItem("restaurantToken");
    //If no restauran ti slogged in
    if (!restaurantId || !token) {
        alert("Restaurant not found or not logged in.");
        loadContent('restaurant-login');
        return;
    }
    //Fetch orders
    try {
        const response = await fetch(`${API_URL}/orders/restaurant/${restaurantId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        //If orders were retrieved successfully
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to load orders.");
        }

        const allOrders = await response.json();

        //Filter by status
        const filtered = activeStatus === "All"
            ? allOrders
            : allOrders.filter(o => o.status === activeStatus);

        //Inject the filtered orders into the template
        const dynamicContent = document.getElementById('dynamic-content');
        dynamicContent.innerHTML = restaurantOrdersTemplate(filtered, activeStatus);

        //Handle switching tabs
        document.querySelectorAll('.status-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const status = btn.getAttribute('data-status');
                loadRestaurantOrders(status);
            });

            //Highlight active status
            if (btn.getAttribute('data-status') === activeStatus) {
                btn.classList.add('bg-green-500', 'text-white');
                btn.classList.remove('bg-gray-200', 'text-gray-700');
            } else {
                btn.classList.remove('bg-green-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            }
        });

        addStatusButtonListeners(filtered);
    //Catch errors
    } catch (err) {
        console.error("Error loading restaurant orders:", err);
        alert("Something went wrong loading orders.");
    }
}

//Update order status funciton
async function updateOrderStatus(orderId, newStatus) {
    const restaurantId = localStorage.getItem("restaurantId");
    const token = localStorage.getItem("restaurantToken");
    //Send new status to server
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        //If status was updated successfully
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update order status.");
        }
        //Return result
        return await response.json();  
    //Catch errors
    } catch (error) {
        throw new Error("Failed to update order status: " + error.message);
    }
}
//Update orders display function
function updateOrderDisplay(orderItems) {
    const container = document.getElementById('order-items');
    
    //Clear existing content in the container
    container.innerHTML = '';

    //If there are no items in order show a placeholder message and set total to 0
    if (orderItems.length === 0) {
        container.innerHTML = '<p class="text-gray-600">No items added yet</p>';
        document.getElementById('order-total').textContent = '£0.00';
        return;
    }

    //Total cost of order
    let total = 0;

    //For each item in order
    orderItems.forEach(item => {
        //Add item price ot total
        total += item.quantity * item.price;

        //HTML for item display
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

        //Append HTML to container
        container.insertAdjacentHTML('beforeend', itemHtml);
    });

    //Update the total display with total price
    document.getElementById('order-total').textContent = `£${total.toFixed(2)}`;

    //Add event listeners to all "increase" buttons
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-item-name');
            const item = orderItems.find(i => i.name === name);
            if (item) {
                item.quantity += 1; // Increase quantity
                updateOrderDisplay(orderItems); // Refresh the display
            }
        });
    });

    //Add event listeners to all "decrease" buttons
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-item-name');
            const itemIndex = orderItems.findIndex(i => i.name === name);
            if (itemIndex > -1) {
                if (orderItems[itemIndex].quantity > 1) {
                    //Reduce quantity by 1
                    orderItems[itemIndex].quantity -= 1;
                } else {
                    //Remove item from the order if quantity reaches 0
                    orderItems.splice(itemIndex, 1);

                    //Restore "Add to Order" button for the item
                    const addBtn = document.querySelector(`.add-to-order[data-item-name="${name}"]`);
                    if (addBtn) {
                        addBtn.innerHTML = "Add to Order";
                        addBtn.disabled = false;
                        addBtn.classList.remove("flex", "items-center", "space-x-2");
                    }
                }
                updateOrderDisplay(orderItems); //Refresh display
            }
        });
    });
}

//Function to show order confirmation
function showOrderConfirmation(orderItems, total, savedAddress, userCredit, onConfirm, onCancel) {
    //Create confirmation popup
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
    //References to certain parts of the popup
    const manualFields = modal.querySelector('#manual-address-fields');
    const showNewAddressBtn = modal.querySelector('#show-new-address-form');
    const confirmBtn = modal.querySelector('#confirm-order');
    const useSavedAddressBtn = modal.querySelector('#use-saved-address');

    let selectedAddress = savedAddress || '';
    //Handle save address button
    if (useSavedAddressBtn) {
        useSavedAddressBtn.addEventListener('click', () => {
            manualFields.classList.add('hidden');
            selectedAddress = savedAddress;
            confirmBtn.disabled = false;
        });
    }
    //SHow/hide address fields
    showNewAddressBtn.addEventListener('click', () => {
        manualFields.classList.toggle('hidden');
        if (!manualFields.classList.contains('hidden')) {
            selectedAddress = '';
            confirmBtn.disabled = true;
        }
    });

    //Monitor manual input for address fields
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
    //Listen for confirm button click
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

    const handleCancel = () => {
        modal.remove();
        if (onCancel) onCancel();
    };

    modal.querySelector('#cancel-order').addEventListener('click', handleCancel);

    //Close popup on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            handleCancel();
        }
    });
}
//Function to show a temporary success popup when the order status is updated
function showStatusUpdateSuccess(newStatus) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in';

    //Define different colours and icons fo rdifferent status states
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

    //HTML for popup
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

    //Zoom animatoin
    requestAnimationFrame(() => {
        modal.querySelector('div > div').style.transform = 'scale(1.05)';
        setTimeout(() => {
            modal.querySelector('div > div').style.transform = 'scale(1)';
        }, 50);
    });

    //Auto close after 2 seconds
    setTimeout(() => {
        modal.classList.add('animate-fade-out');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }, 2000);
}

//Function to listen for status button clicks
function addStatusButtonListeners(orders) {
    orders.forEach(order => {
        const orderElement = document.querySelector(`[data-order-id="${order.id}"]`);
        if (orderElement) {
            const buttons = orderElement.querySelectorAll('.order-status-btn');
            buttons.forEach(button => {
                button.addEventListener('click', async () => {
                    const newStatus = button.getAttribute('data-status');
                    //Send new status to server
                    try {
                        const result = await updateOrderStatus(order.id, newStatus);
                        if (result.success) {
                            showStatusUpdateSuccess(newStatus);
                            setTimeout(() => {
                                loadRestaurantOrders(newStatus);
                            }, 2300); 
                        }
                    //Catch errors
                    } catch (err) {
                        console.error("Status update failed:", err);
                        alert("Failed to update status.");
                    }
                });
            });
        }
    });
}

//Function to show a popup when order is completed
function showOrderSuccess(total) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in';
    //Popup HTML
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

    //Popup animation
    requestAnimationFrame(() => {
        modal.querySelector('div > div').style.transform = 'scale(1.05)';
        setTimeout(() => {
            modal.querySelector('div > div').style.transform = 'scale(1)';
        }, 50);
    });

    //Auto close after 2 seconds
    setTimeout(() => {
        modal.classList.add('animate-fade-out');
        setTimeout(() => {
            modal.remove();
            loadContent('my-orders');
        }, 300);
    }, 2000);
}

//Make functions available in other js files
export { loadUserOrders, createOrder, selectRestaurant, updateOrderDisplay, loadRestaurantOrders, loadRestaurantDashboard };
