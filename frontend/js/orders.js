import API_URL from './config.js';

async function createOrder(orderData) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to place an order.");
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

function selectRestaurant(restaurantId, restaurantName) {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to place an order.");
        loadContent('login');
        return;
    }

    // Show a simple order form
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.classList.add('page-transition', 'fade-out');
    
    setTimeout(() => {
        const orderFormTemplate = `
            <div class="max-w-6xl mx-auto p-8 slide-up">
                <h1 class="text-3xl font-bold mb-6">Place Order - ${restaurantName}</h1>
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-semibold mb-4">Menu Items</h2>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-4 border rounded">
                            <div>
                                <h3 class="font-medium">Signature Dish 1</h3>
                                <p class="text-gray-600">$10.00</p>
                            </div>
                            <button class="add-to-order px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600" 
                                data-item-name="Signature Dish 1" 
                                data-item-price="10.00">
                                Add to Order
                            </button>
                        </div>
                        <div class="flex items-center justify-between p-4 border rounded">
                            <div>
                                <h3 class="font-medium">Signature Dish 2</h3>
                                <p class="text-gray-600">$15.00</p>
                            </div>
                            <button class="add-to-order px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600" 
                                data-item-name="Signature Dish 2" 
                                data-item-price="15.00">
                                Add to Order
                            </button>
                        </div>
                    </div>
                    
                    <div class="mt-8">
                        <h2 class="text-xl font-semibold mb-4">Your Order</h2>
                        <div id="order-items" class="space-y-2 mb-4">
                            <p class="text-gray-600">No items added yet</p>
                        </div>
                        
                        <div class="flex justify-between font-bold text-lg mb-4">
                            <span>Total:</span>
                            <span id="order-total">$0.00</span>
                        </div>
                        
                        <button id="place-order-btn" class="w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        dynamicContent.innerHTML = orderFormTemplate;
        dynamicContent.classList.remove('fade-out');
        
        // Set up event listeners for the order form
        const orderItems = [];
        
        // Add to order buttons
        document.querySelectorAll('.add-to-order').forEach(button => {
            button.addEventListener('click', () => {
                const itemName = button.getAttribute('data-item-name');
                const itemPrice = parseFloat(button.getAttribute('data-item-price'));
                
                // Add item to order
                const existingItem = orderItems.find(item => item.ItemName === itemName);
                if (existingItem) {
                    existingItem.Quantity += 1;
                } else {
                    orderItems.push({
                        ItemName: itemName,
                        Quantity: 1,
                        UnitPrice: itemPrice
                    });
                }
                
                // Update order display
                updateOrderDisplay(orderItems);
            });
        });
        
        // Place order button
        document.getElementById('place-order-btn').addEventListener('click', () => {
            if (orderItems.length === 0) {
                alert("Please add at least one item to your order.");
                return;
            }
            
            const orderData = {
                RestaurantId: restaurantId,
                orderItems: orderItems
            };
            
            createOrder(orderData);
        });
    }, 300);
}

function updateOrderDisplay(orderItems) {
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotalElement = document.getElementById('order-total');
    
    if (orderItems.length === 0) {
        orderItemsContainer.innerHTML = '<p class="text-gray-600">No items added yet</p>';
        orderTotalElement.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    let html = '';
    
    orderItems.forEach(item => {
        const itemTotal = item.Quantity * item.UnitPrice;
        total += itemTotal;
        
        html += `
            <div class="flex justify-between items-center">
                <span>${item.Quantity}x ${item.ItemName}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    orderItemsContainer.innerHTML = html;
    orderTotalElement.textContent = `$${total.toFixed(2)}`;
}

export { createOrder, selectRestaurant, updateOrderDisplay }; 