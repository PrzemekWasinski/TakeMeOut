// Templates
const homeContentTemplate = `
    <!-- Hero Section -->
    <div class="bg-black text-white py-16">
        <div class="max-w-6xl mx-auto px-4">
            <h1 class="text-4xl font-bold mb-4">Hungry? You're in the right place</h1>
            <div class="flex flex-col sm:flex-row gap-4">
                <input type="text" placeholder="Enter delivery address" class="px-4 py-2 rounded-full w-full sm:w-96 text-black">
                <button class="bg-green-500 px-6 py-2 rounded-full hover:bg-green-600">Find Food</button>
            </div>
        </div>  
    </div>

    <!-- Restaurant Grid -->
    <div class="max-w-6xl mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-6">Popular Restaurants</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Restaurant Cards -->
            <div class="restaurant-card cursor-pointer" data-restaurant-id="1" onclick="selectRestaurant(1, 'Burger Palace')">
                <img src="https://via.placeholder.com/400x250" alt="Restaurant" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">Burger Palace</h3>
                    <p class="text-gray-600">⭐ 4.5 (500+ ratings)</p>
                    <p class="text-gray-600">$$ • Burgers • American</p>
                    <p class="text-gray-600">20-30 min delivery</p>
                </div>
            </div>

            <div class="restaurant-card cursor-pointer" data-restaurant-id="2" onclick="selectRestaurant(2, 'Sushi Master')">
                <img src="https://via.placeholder.com/400x250" alt="Restaurant" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">Sushi Master</h3>
                    <p class="text-gray-600">⭐ 4.8 (300+ ratings)</p>
                    <p class="text-gray-600">$$$ • Japanese • Sushi</p>
                    <p class="text-gray-600">25-35 min delivery</p>
                </div>
            </div>

            <div class="restaurant-card cursor-pointer" data-restaurant-id="3" onclick="selectRestaurant(3, 'Pizza Express')">
                <img src="https://via.placeholder.com/400x250" alt="Restaurant" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">Pizza Express</h3>
                    <p class="text-gray-600">⭐ 4.3 (400+ ratings)</p>
                    <p class="text-gray-600">$$ • Italian • Pizza</p>
                    <p class="text-gray-600">15-25 min delivery</p>
                </div>
            </div>
        </div>
    </div>
`;

const loginFormTemplate = `
    <div class="max-w-md mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Sign In</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <form id="login-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" placeholder="Email" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" placeholder="Password" class="input-field">
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                        <label class="ml-2 block text-sm text-gray-700">Remember me</label>
                    </div>
                    <a href="#" class="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
                </div>
                <button type="submit" class="submit-btn">Sign In</button>
            </form>
            <div class="text-center mt-4">
                <p>Don't have an account? <a href="#" onclick="loadContent('register')" class="text-blue-600 hover:underline">Sign up</a></p>
                <p class="mt-2 text-sm">Are you a restaurant? <a href="#" onclick="loadContent('restaurant-login')" class="text-blue-600 hover:underline">Restaurant Sign In</a></p>
            </div>
        </div>
        <button onclick="showHome()" class="back-btn">← Back to Home</button>
    </div>
`;

const registerFormTemplate = `
    <div class="max-w-md mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Sign Up</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <form id="register-form" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" required class="input-field">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" required class="input-field">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" placeholder="Email" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" placeholder="Password" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input type="password" required class="input-field">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" required class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <label class="ml-2 block text-sm text-gray-700">I agree to the Terms and Privacy Policy</label>
                </div>
                <button type="submit" class="submit-btn">Sign Up</button>
            </form>
            <div class="text-center mt-4">
                <p>Already have an account? <a href="#" onclick="loadContent('login')" class="text-blue-600 hover:underline">Sign in</a></p>
            </div>
        </div>
        <button onclick="showHome()" class="back-btn">← Back to Home</button>
    </div>
`;

const aboutTemplate = `
    <div class="max-w-4xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6">About Us</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <div id="about-content" class="prose max-w-none">
                <p>EatMeOut is a premier food delivery platform connecting hungry customers with their favorite local restaurants.</p>
                <p>Founded in 2023, we've quickly grown to serve over 50 cities worldwide, with a mission to make food delivery fast, reliable, and affordable for everyone.</p>
                <p>Our platform features thousands of restaurant partners, from local favorites to national chains, ensuring you can always find exactly what you're craving.</p>
                <p>With our dedicated delivery network, we ensure your food arrives hot and fresh, exactly when you want it.</p>
            </div>
        </div>
        <button onclick="showHome()" class="back-btn">← Back to Home</button>
    </div>
`;

const partnerTemplate = `
    <div class="max-w-4xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6">Become a Partner</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <form id="partner-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Business Name</label>
                    <input type="text" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Business Type</label>
                    <select class="input-field">
                        <option>Restaurant</option>
                        <option>Delivery Service</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Contact Email</label>
                    <input type="email" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" class="input-field">
                </div>
                <button type="submit" class="submit-btn">Submit Application</button>
            </form>
        </div>
        <button onclick="showHome()" class="back-btn">← Back to Home</button>
    </div>
`;

const restaurantSignupTemplate = `
    <div class="max-w-4xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Restaurant Sign Up</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            
            <!-- Step 1: Basic Information -->
            <div id="signup-step-1">
                <h2 class="text-xl font-bold mb-4">Step 1: Basic Information</h2>

                <label class="block text-sm font-medium text-gray-700">Owner Name</label>
                <input type="text" id="ownerName" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Restaurant Name</label>
                <input type="text" id="restaurantName" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" id="confirmPassword" required class="input-field">
                <span id="password-error" style="color: red; display: none;">Passwords do not match.</span>

                <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" id="phone" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Cuisine Type</label>
                <select id="cuisineType" required class="input-field">
                    <option value="">Select cuisine type</option>
                    <option value="Italian">Italian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Indian">Indian</option>
                    <option value="American">American</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Thai">Thai</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Other">Other</option>
                </select>

                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows="4" class="input-field" placeholder="Tell us about your restaurant..."></textarea>

                <button id="next-step" class="submit-btn">Next</button>
            </div>

            <!-- Step 2: Image Upload & Operating Hours -->
            <div id="signup-step-2" class="hidden">
                <h2 class="text-xl font-bold mb-4">Step 2: Images & Operating Hours</h2>

                <div class="flex gap-6">
                    <!-- Cover Image (Square) -->
                    <div class="image-box w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md bg-gray-100 cursor-pointer"
                        id="coverPreview" onclick="document.getElementById('coverImg').click()">
                        <span class="text-gray-600 text-center">Click to Upload<br>Cover Image</span>
                    </div>
                    <input type="file" id="coverImg" class="hidden" accept="image/*" onchange="previewImage(event, 'coverPreview')">
                    
                    <!-- Banner Image (Longer) -->
                    <div class="image-box w-64 h-32 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md bg-gray-100 cursor-pointer"
                        id="bannerPreview" onclick="document.getElementById('bannerImg').click()">
                        <span class="text-gray-600 text-center">Click to Upload<br>Banner Image</span>
                    </div>
                    <input type="file" id="bannerImg" class="hidden" accept="image/*" onchange="previewImage(event, 'bannerPreview')">
                </div>

                <h3 class="text-lg font-bold mt-4">Opening & Closing Times</h3>
                <div id="time-fields-container"></div>

                <div class="flex justify-between">
                    <button id="back-step" class="back-btn">← Back</button>
                    <button id="submit-signup" class="submit-btn">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
`;

const restaurantLoginTemplate = `
    <div class="max-w-md mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Restaurant Sign In</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <form id="restaurant-login-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Restaurant Email</label>
                    <input type="email" id="restaurant-email" placeholder="Email" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="restaurant-password" placeholder="Password" class="input-field">
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                        <label class="ml-2 block text-sm text-gray-700">Remember me</label>
                    </div>
                    <a href="#" class="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
                </div>
                <button type="submit" class="submit-btn">Sign In</button>
            </form>
            <div class="text-center mt-4">
                <p>Don't have a restaurant account? <a href="#" onclick="loadContent('restaurant-signup')" class="text-blue-600 hover:underline">Register your Restaurant</a></p>
                <p class="mt-2 text-sm">Not a restaurant? <a href="#" onclick="loadContent('login')" class="text-blue-600 hover:underline">Customer Sign In</a></p>
            </div>
        </div>
        <button onclick="showHome()" class="back-btn">← Back to Home</button>
    </div>
`;

// Restaurant-specific templates
const restaurantDashboardTemplate = `
    <div class="max-w-6xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6">Restaurant Dashboard</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Today's Orders</h2>
                <div class="text-3xl font-bold text-green-600">0</div>
                <p class="text-gray-600">Active Orders</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Revenue</h2>
                <div class="text-3xl font-bold text-blue-600">$0.00</div>
                <p class="text-gray-600">Today's Revenue</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Rating</h2>
                <div class="text-3xl font-bold text-yellow-600">⭐ 0.0</div>
                <p class="text-gray-600">Average Rating</p>
            </div>
        </div>
        
        <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4">Recent Orders</h2>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-gray-500" colspan="5">No recent orders</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`;

const restaurantMenuTemplate = `
    <div class="max-w-6xl mx-auto p-8 slide-up">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">Menu Management</h1>
            <button onclick="showAddItemForm()" class="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">Add New Item</button>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Sample menu item card -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="text-xl font-semibold mb-2">Add Your First Item</div>
                    <p class="text-gray-600 mb-4">Start building your menu by adding your first dish</p>
                    <button onclick="showAddItemForm()" class="text-green-500 hover:text-green-600">+ Add Item</button>
                </div>
            </div>
        </div>
    </div>
`;

const restaurantOrdersTemplate = `
    <div class="max-w-6xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6">Order Management</h1>
        
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b">
                <div class="flex gap-4">
                    <button class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">New Orders</button>
                    <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">Preparing</button>
                    <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">Ready</button>
                    <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">Completed</button>
                </div>
            </div>
            
            <table class="min-w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-500" colspan="6">No orders to display</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button id="create-order-btn" class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">Create Order</button>
    </div>
`;

// Helper function for restaurant signup
function generateTimeFields() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return days.map(day => `
        <div class="flex gap-4 items-center mb-2">
            <label class="w-24">${day}:</label>

            <div class="relative flex-grow">
                <input type="time" id="${day.toLowerCase()}Open" class="input-field w-full pr-10" onclick="this.showPicker()">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" onclick="document.getElementById('${day.toLowerCase()}Open').showPicker()">⏰</span>
            </div>

            <div class="relative flex-grow">
                <input type="time" id="${day.toLowerCase()}Close" class="input-field w-full pr-10" onclick="this.showPicker()">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" onclick="document.getElementById('${day.toLowerCase()}Close').showPicker()">⏰</span>
            </div>
        </div>
    `).join("");
}

export { 
    homeContentTemplate, 
    loginFormTemplate, 
    registerFormTemplate, 
    aboutTemplate, 
    partnerTemplate, 
    restaurantSignupTemplate, 
    restaurantLoginTemplate, 
    restaurantDashboardTemplate, 
    restaurantMenuTemplate, 
    restaurantOrdersTemplate, 
    generateTimeFields 
}; 