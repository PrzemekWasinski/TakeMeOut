import API_URL from "./config.js";

//HTML templates

//Home template
const homeContentTemplate = `
    <!-- Hero Section -->
    <div class="bg-black text-white py-16">
        <div class="max-w-6xl mx-auto px-4">
            <h1 class="text-4xl font-bold mb-4">Hungry? You're in the right place</h1>
            <div class="flex flex-col sm:flex-row gap-4">
                <input type="text" placeholder="Enter delivery address" class="px-4 py-2 rounded-full w-full sm:w-96 text-black">
                <div class="flex gap-2">
                    <button class="bg-green-500 px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-200 flex items-center justify-center">
                        <span>Find Food</span>
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <button id="feeling-lucky-btn" class="bg-purple-500 px-6 py-2 rounded-full hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center">
                        <span>I'm Feeling Lucky</span>
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>  
    </div>

    <!-- Search Section -->
    <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="relative">
            <input type="text" 
                   id="restaurant-search" 
                   placeholder="Search for restaurants, cuisines, or dishes..." 
                   class="w-full px-6 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 focus:outline-none text-lg">
            <button id="search-button" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-200">
                Search
            </button>
        </div>
    </div>

    <!-- Restaurant Grid -->
    <div class="max-w-6xl mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-6">Popular Restaurants</h2>
        <div id="restaurants-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Dynamic restaurant cards will be inserted here -->
        </div>
    </div>
`;

//Login template
const loginFormTemplate = `
    <div class="max-w-md mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Sign In</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <form id="login-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" placeholder="Email" class="input-field">
                    <p class="text-red-500 text-sm mt-1" id="email-error"></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" placeholder="Password" class="input-field">
                    <p class="text-red-500 text-sm mt-1" id="password-error"></p>
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
                <p>Don't have an account? <a href="#" onclick="window.loadContent('register')" class="text-blue-600 hover:underline">Sign up</a></p>
                <p class="mt-2 text-sm">Are you a restaurant? <a href="#" onclick="window.loadContent('restaurant-login')" class="text-blue-600 hover:underline">Restaurant Sign In</a></p>
            </div>
        </div>
        <button onclick="window.showHome()" class="back-btn">← Back to Home</button>
    </div>
`;
//Register template
const registerFormTemplate = `
    <div class="max-w-md mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Sign Up</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <form id="register-form" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" id="firstName" required class="input-field">
                        <p class="text-red-500 text-sm mt-1" id="firstName-error"></p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" id="lastName" required class="input-field">
                        <p class="text-red-500 text-sm mt-1" id="lastName-error"></p>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" placeholder="Email" class="input-field">
                    <p class="text-red-500 text-sm mt-1" id="email-error"></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" placeholder="Password" class="input-field">
                    <p class="text-red-500 text-sm mt-1" id="password-error"></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input type="password" id="confirmPassword" required class="input-field">
                    <p class="text-red-500 text-sm mt-1" id="confirmPassword-error"></p>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" required class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <label class="ml-2 block text-sm text-gray-700">I agree to the Terms and Privacy Policy</label>
                </div>
                <button type="submit" class="submit-btn">Sign Up</button>
            </form>
            <div class="text-center mt-4">
                <p>Already have an account? <a href="#" onclick="window.loadContent('login')" class="text-blue-600 hover:underline">Sign in</a></p>
                <p class="mt-2 text-sm">Are you a restaurant? <a href="#" onclick="window.loadContent('restaurant-signup')" class="text-blue-600 hover:underline">Register your Restaurant</a></p>
            </div>
        </div>
        <button onclick="window.showHome()" class="back-btn">← Back to Home</button>
    </div>
`;
//About template
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
        <button onclick="window.showHome()" class="back-btn">← Back to Home</button>
    </div>
`;
//Partner template
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
        <button onclick="window.showHome()" class="back-btn">← Back to Home</button>
    </div>
`;
//Template for restaurant signup
const restaurantSignupTemplate = `
    <div class="max-w-4xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Restaurant Sign Up</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            
            <!-- Step 1: Basic Information -->
            <div id="signup-step-1">
                <h2 class="text-xl font-bold mb-4">Step 1: Basic Information</h2>

                <label class="block text-sm font-medium text-gray-700">Owner Name</label>
                <input type="text" id="ownerName" required class="input-field">
                <p class="text-red-500 text-sm mt-1" id="ownerName-error"></p>

                <label class="block text-sm font-medium text-gray-700">Restaurant Name</label>
                <input type="text" id="restaurantName" required class="input-field">
                <p class="text-red-500 text-sm mt-1" id="restaurantName-error"></p>

                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" required class="input-field">
                <p class="text-red-500 text-sm mt-1" id="email-error"></p>

                <label class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" required class="input-field">
                <p class="text-red-500 text-sm mt-1" id="password-error"></p>

                <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" id="confirmPassword" required class="input-field">
                <p class="text-red-500 text-sm mt-1" id="confirmPassword-error"></p>

                <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" id="phone" required class="input-field">
                <p class="text-red-500 text-sm mt-1" id="phone-error"></p>

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
                <p class="text-red-500 text-sm mt-1" id="cuisineType-error"></p>

                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows="4" class="input-field" placeholder="Tell us about your restaurant..."></textarea>

                <button id="next-step" class="submit-btn">Next</button>
            </div>

            <!-- Step 2: Address -->
            <div id="signup-step-2" class="hidden">
                <h2 class="text-xl font-bold mb-4">Step 2: Address Details</h2>

                <label class="block text-sm font-medium text-gray-700">Door Number</label>
                <input type="text" id="doorNumber" required class="input-field">
                <p class="text-red-500 text-sm mt-1" id="doorNumber-error"></p>

                <label class="block text-sm font-medium text-gray-700">Road</label>
                <input type="text" id="road" required class="input-field">
                <p class="text-red-500 text-sm mt-1" id="road-error"></p>

                <label class="block text-sm font-medium text-gray-700">City</label>
                <input type="text" id="city" required class="input-field">
                <p class="text-red-500 text-sm mt-1" id="city-error"></p>

                <label class="block text-sm font-medium text-gray-700">Postcode</label>
                <input type="text" id="postcode" required class="input-field">
                <p class="text-red-500 text-sm mt-1" id="postcode-error"></p>

                <div class="flex justify-between">
                    <button id="back-to-step-1" class="back-btn">← Back</button>
                    <button id="next-to-step-3" class="submit-btn">Next</button>
                </div>
            </div>

            <!-- Step 3: Image Upload & Operating Hours -->
            <div id="signup-step-3" class="hidden">
                <h2 class="text-xl font-bold mb-4">Step 3: Images & Operating Hours</h2>

                <div class="flex gap-6">
                    <!-- Cover Image (Square) -->
                    <div class="image-box w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md bg-gray-100 cursor-pointer"
                        id="coverPreview" onclick="document.getElementById('coverImg').click()">
                        <span class="text-gray-600 text-center">Click to Upload<br>Cover Image</span>
                    </div>
                    <input type="file" id="coverImg" class="hidden" accept="image/*" onchange="previewImage(event, 'coverPreview')">
                    <p class="text-red-500 text-sm mt-1" id="coverImg-error"></p>
                    
                    <!-- Banner Image (Longer) -->
                    <div class="image-box w-64 h-32 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md bg-gray-100 cursor-pointer"
                        id="bannerPreview" onclick="document.getElementById('bannerImg').click()">
                        <span class="text-gray-600 text-center">Click to Upload<br>Banner Image</span>
                    </div>
                    <input type="file" id="bannerImg" class="hidden" accept="image/*" onchange="previewImage(event, 'bannerPreview')">
                    <p class="text-red-500 text-sm mt-1" id="bannerImg-error"></p>
                </div>

                <h3 class="text-lg font-bold mt-4">Opening & Closing Times</h3>
                <div id="time-fields-container"></div>

                <div class="flex justify-between">
                    <button id="back-to-step-2" class="back-btn">← Back</button>
                    <button id="submit-signup" class="submit-btn">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
`;
//Template for register login
const restaurantLoginTemplate = `
    <div class="max-w-md mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Restaurant Sign In</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <form id="restaurant-login-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Restaurant Email</label>
                    <input type="email" id="restaurant-email" placeholder="Email" class="input-field">
                    <p class="text-red-500 text-sm mt-1" id="restaurant-email-error"></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="restaurant-password" placeholder="Password" class="input-field">
                    <p class="text-red-500 text-sm mt-1" id="restaurant-password-error"></p>
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
                <p>Don't have a restaurant account? <a href="#" onclick="window.loadContent('restaurant-signup')" class="text-blue-600 hover:underline">Register your Restaurant</a></p>
                <p class="mt-2 text-sm">Not a restaurant? <a href="#" onclick="window.loadContent('login')" class="text-blue-600 hover:underline">Customer Sign In</a></p>
            </div>
        </div>
        <button onclick="window.showHome()" class="back-btn">← Back to Home</button>
    </div>
`;

//Restaurant specific templates
const restaurantDashboardTemplate = (
  ordersToday = [],
  revenue = 0,
  recent = [],
  averageRating = 0.0,
  ratingCount = 0
) => {
  return `
    <div class="max-w-6xl mx-auto p-8 slide-up">
      <h1 class="text-3xl font-bold mb-6">Restaurant Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onclick="window.loadRestaurantOrders('Pending')">
          <h2 class="text-xl font-semibold mb-4">Today's Orders</h2>
          <div class="text-3xl font-bold text-green-600">${ordersToday.length}</div>
          <p class="text-gray-600">Orders placed today (GMT)</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold mb-4">Today's Revenue</h2>
          <div class="text-3xl font-bold text-blue-600">£${revenue.toFixed(2)}</div>
          <p class="text-gray-600">Revenue today (GMT)</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onclick="window.loadContent('restaurant-menu')">
          <h2 class="text-xl font-semibold mb-4">Menu Management</h2>
          <div class="text-3xl font-bold text-blue-600">🍽️</div>
          <p class="text-gray-600">Manage your menu</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onclick="window.loadContent('profile')">
          <h2 class="text-xl font-semibold mb-4">Rating</h2>
          <div class="text-3xl font-bold text-yellow-600">⭐ ${averageRating.toFixed(1)}</div>
          <p class="text-gray-600">${ratingCount} rating${ratingCount === 1 ? '' : 's'}</p>
        </div>
      </div>
      
      <div class="mt-8 cursor-pointer" onclick="window.loadRestaurantOrders('Pending')">
        <h2 class="text-2xl font-bold mb-4">Recent Orders</h2>
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
              ${
                recent.length === 0
                  ? `<tr><td colspan="5" class="text-center text-gray-500 py-4">No recent orders</td></tr>`
                  : recent.map(o => `
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${o.id}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${o.customerName}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${o.items.map(i => `${i.quantity} x ${i.itemName}`).join('<br>')}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£${o.totalAmount.toFixed(2)}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${o.status}</td>
                    </tr>
                  `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};
//Rstaurant menu template
const restaurantMenuTemplate = (categories = []) => {
  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  return `
    <section class="max-w-4xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold mb-6">Menu Management</h1>
      <button id="add-category-btn" class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mb-6">
        + Add New Category
      </button>

      <div id="menu-categories" class="sortable-categories">
        ${
          sortedCategories.length === 0
            ? `<div class="bg-white p-6 rounded shadow text-center text-gray-500">No menu items yet. Start by adding a category.</div>`
            : sortedCategories.map((cat) => {
                const itemsHtml = cat.items
                  .map((item) => {
                    const cleanedPath = (item.imageUrl || '').replace(/^\/?api\/?/, '');
                    const safePath = cleanedPath.startsWith('/uploads')
                      ? cleanedPath
                      : `/uploads/${cleanedPath.replace(/^\/+/, '')}`;
                    const fullImageUrl = item.imageUrl ? `${API_URL}${safePath}` : '';

                    return `
                      <li class="flex justify-between items-start border p-3 rounded space-x-4" data-id="${item.id}">
                        <span class="drag-handle cursor-move text-gray-400 pr-2">☰</span>
                        <div class="w-16 h-16 flex-shrink-0 rounded overflow-hidden border">
                          ${fullImageUrl ? `<img src="${fullImageUrl}" alt="${item.name}" class="w-full h-full object-cover" crossorigin="anonymous">` : ''}
                        </div>
                        <div class="flex-grow">
                          <h3 class="font-bold">${item.name}</h3>
                          <p class="text-sm text-gray-600">${item.description}</p>
                          <p class="text-sm text-gray-400">Ingredients: ${item.ingredients.join(', ')}</p>
                          <p class="text-sm text-gray-500">
                            Calories: ${item.calories} | Vegan: ${item.isVegan ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <div class="flex flex-col space-y-1 text-right">
                          <button 
                            class="edit-item-btn text-blue-600 text-sm" 
                            data-id="${item.id}" 
                            data-category-id="${cat.id}">
                            Edit
                          </button>
                          <button 
                            class="delete-item-btn text-red-600 text-sm" 
                            data-id="${item.id}" 
                            data-category-id="${cat.id}">
                            Delete
                          </button>
                        </div>
                      </li>
                    `;
                  })
                  .join('');

                return `
                  <div class="menu-category mb-6 bg-white p-4 rounded shadow" data-id="${cat.id}">
                    <div class="flex justify-between items-center mb-2">
                      <h2 class="text-xl font-semibold flex items-center">
                        <span class="drag-handle cursor-move text-gray-400 pr-2">☰</span>
                        <span>${cat.category || cat.name}</span>
                      </h2>
                      <div class="flex space-x-2">
                        <button 
                          class="add-item-btn text-sm text-green-600 hover:underline" 
                          data-category-id="${cat.id}">
                          + Add Item
                        </button>
                        <button 
                          class="edit-category-btn text-sm text-blue-600 hover:underline" 
                          data-category-id="${cat.id}" 
                          data-name="${cat.category || cat.name}">
                          Edit
                        </button>
                        <button 
                          class="delete-category-btn text-sm text-red-600 hover:underline" 
                          data-category-id="${cat.id}">
                          Delete
                        </button>
                      </div>
                    </div>
                    <ul class="sortable-items space-y-2" data-category-id="${cat.id}">
                      ${itemsHtml}
                    </ul>
                  </div>
                `;
              }).join('')
        }
      </div>
    </section>
  `;
};
//Restaurant orders template
const restaurantOrdersTemplate = (orders = [], activeStatus = "Pending") => `
    <div class="max-w-6xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6">Order Management</h1>
        
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b">
                <div class="flex gap-4 flex-wrap">
                    ${["Pending", "Preparing", "Ready", "Completed"].map(status => `
                        <button 
                            class="status-tab px-4 py-2 rounded-full ${status === activeStatus ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}" 
                            data-status="${status}">
                            ${status}
                        </button>
                    `).join('')}
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
                        ${activeStatus !== "Completed" ? `
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        ` : ''}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${orders.length === 0
                        ? `<tr><td class="px-6 py-4 whitespace-nowrap text-gray-500" colspan="${activeStatus === "Completed" ? '5' : '6'}">No orders to display</td></tr>`
                        : orders.filter(o => o.status === activeStatus).map(order => `
                            <tr data-order-id="${order.id}">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${order.id}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(order.orderDate).toLocaleString()}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${order.customerName}<br>
                                    <span class="text-xs text-gray-400">${order.address}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${order.items.map(i => `${i.quantity} x ${i.itemName}`).join("<br>")}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£${order.totalAmount.toFixed(2)}</td>
                                ${order.status !== "Completed" ? `
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex flex-wrap gap-2">
                                        ${order.status === "Pending" ? `
                                            <button 
                                                class="order-status-btn bg-green-500 text-white text-xs px-3 py-1 rounded-full hover:bg-green-600" 
                                                data-status="Preparing"
                                                data-order-id="${order.id}">
                                                Preparing
                                            </button>
                                        ` : ''}
                                        ${order.status === "Preparing" ? `
                                            <button 
                                                class="order-status-btn bg-yellow-500 text-white text-xs px-3 py-1 rounded-full hover:bg-yellow-600" 
                                                data-status="Ready"
                                                data-order-id="${order.id}">
                                                Ready
                                            </button>
                                        ` : ''}
                                        ${order.status === "Ready" ? `
                                            <button 
                                                class="order-status-btn bg-blue-500 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-600" 
                                                data-status="Completed"
                                                data-order-id="${order.id}">
                                                Completed
                                            </button>
                                        ` : ''}
                                    </div>
                                </td>
                                ` : ''}
                            </tr>
                        `).join('')}
                </tbody>
            </table>
        </div>
    </div>
`;

//Function to create opening and closing time fields
function generateTimeFields() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return days.map(day => `
        <div class="flex gap-4 items-center mb-2">
            <label class="w-24">${day}:</label>

            <div class="relative flex-grow">
                <input type="time" id="${day.toLowerCase()}Open" class="input-field w-full pr-10" onclick="this.showPicker()">
            </div>

            <div class="relative flex-grow">
                <input type="time" id="${day.toLowerCase()}Close" class="input-field w-full pr-10" onclick="this.showPicker()">
            </div>
        </div>
    `).join("");
}
//Meny template for viewing customers
const customerMenuTemplate = (restaurant, categories = []) => {
  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
  console.log("Restaurant data in template:", restaurant);
  
  const fullBannerUrl = restaurant.BannerIMG 
    ? restaurant.BannerIMG.startsWith('http') 
      ? restaurant.BannerIMG 
      : restaurant.BannerIMG.startsWith('/uploads') 
        ? `${API_URL}${restaurant.BannerIMG}` 
        : restaurant.BannerIMG.startsWith('uploads/') 
          ? `${API_URL}/${restaurant.BannerIMG}` 
          : `${API_URL}/uploads/${restaurant.BannerIMG.replace(/^\/+/, '')}`
    : '/images/placeholder.svg';  // Default placeholder image if no banner
  console.log("Constructed banner URL:", fullBannerUrl);

  const pricingSymbol = restaurant.PricingTier || '£';

  return `
    <section class="max-w-4xl mx-auto px-4 py-6">
      <div class="relative w-full h-64 mb-6 rounded-lg overflow-hidden shadow-lg">
        <img src="${fullBannerUrl}" alt="${restaurant.RestaurantName}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end px-8 py-6 text-white">
          <h1 class="text-4xl font-bold mb-2">${restaurant.RestaurantName}</h1>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center gap-4 text-gray-600">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>${restaurant.Address}</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            <span>${restaurant.Rating ? restaurant.Rating.toFixed(1) : 'No ratings yet'}</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Price: ${pricingSymbol}</span>
          </div>
        </div>
      </div>

      <section class="mb-6" data-restaurant-id="${restaurant.id}">
        <h2 class="text-xl font-semibold mb-2">Rate This Restaurant</h2>
        <div class="flex items-center space-x-2 mb-2">
          ${[1, 2, 3, 4, 5].map(n => `
            <button class="rating-star text-2xl text-gray-400 hover:text-yellow-400 transition" data-value="${n}">★</button>
          `).join('')}
        </div>
        <button id="submit-rating-btn" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Submit Rating
        </button>
        <p id="rating-feedback" class="text-sm mt-2 text-green-600 hidden">Thank you for your feedback!</p>
      </section>

      ${sortedCategories.map(cat => `
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">${cat.name}</h2>
          <div class="space-y-4">
            ${cat.items
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map(item => {
                const cleanedPath = (item.imageUrl || '').replace(/^\/?api\/?/, '');
                const safePath = cleanedPath.startsWith('/uploads')
                  ? cleanedPath
                  : `/uploads/${cleanedPath.replace(/^\/+/, '')}`;
                const fullImageUrl = item.imageUrl ? `${API_URL}${safePath}` : '';

                const unavailable = !item.isAvailable;
                const unavailableClasses = unavailable ? 'opacity-50 pointer-events-none' : '';
                const veganText = item.isVegan ? 'Yes' : 'No';

                return `
                  <div class="restaurant-menu-item flex ${unavailableClasses}" data-id="${item.id}">
                    <div class="flex-shrink-0 w-24 h-24 mr-4 rounded overflow-hidden">
                      ${fullImageUrl ? `<img src="${fullImageUrl}" alt="${item.name}" class="w-full h-full object-cover" crossorigin="anonymous">` : ''}
                    </div>
                    <div class="flex-grow">
                      <h3 class="font-bold text-lg">${item.name}</h3>
                      <p class="text-gray-600 text-sm mb-1">${item.description}</p>
                      <p class="text-sm text-gray-500 mb-1">£${item.price.toFixed(2)}</p>
                      <p class="text-sm text-gray-500">Ingredients: ${item.ingredients.join(', ')}</p>
                      <p class="text-sm text-gray-500">Calories: ${item.calories} | Vegan: ${veganText}</p>
                      ${
                        !unavailable
                          ? `<div class="mt-3">
                              <button 
                                class="add-to-order px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600" 
                                data-item-name="${item.name}" 
                                data-item-price="${item.price}">
                                Add to Order
                              </button>
                            </div>`
                          : ''
                      }
                    </div>
                  </div>
                `;
              }).join('')}
          </div>
        </div>
      `).join('')}
    </section>

    <section class="max-w-4xl mx-auto px-4 pb-10">
      <h2 class="text-xl font-semibold mb-4">Your Order</h2>
      <div id="order-items" class="space-y-2 mb-4">
        <p class="text-gray-600">No items added yet</p>
      </div>
      <div class="flex justify-between font-bold text-lg mb-4">
        <span>Total:</span>
        <span id="order-total">£0.00</span>
      </div>
      <button id="place-order-btn" class="w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
        Place Order
      </button>
    </section>
  `;
};
//Oders template for user viewing
const userOrdersTemplate = (orders = []) => {
  if (!orders.length) {
    return `
      <section class="max-w-4xl mx-auto px-4 py-10 slide-up">
        <h1 class="text-3xl font-bold mb-6">My Orders</h1>
        <p class="text-gray-500">You haven't placed any orders yet.</p>
      </section>
    `;
  }

  return `
    <section class="max-w-4xl mx-auto px-4 py-10 slide-up">
      <h1 class="text-3xl font-bold mb-6">My Orders</h1>
      <div class="space-y-6">
        ${orders.map(order => `
          <div class="border rounded shadow p-4">
            <div class="flex justify-between mb-2">
              <div>
                <p class="text-sm text-gray-500">Order ID: <strong>#${order.id}</strong></p>
                <p class="text-sm text-gray-500">Placed: ${new Date(order.orderDate).toLocaleString()}</p>
                <p class="text-sm text-gray-500">To: ${order.address || "Unknown address"}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-blue-600">£${order.totalAmount.toFixed(2)}</p>
                <p class="text-sm text-gray-500">Status: ${order.status}</p>
              </div>
            </div>
            <div class="mt-2">
              <h4 class="text-sm font-semibold mb-1">Items:</h4>
              <ul class="list-disc pl-5 text-sm text-gray-700">
                ${order.items.map(i => `
                  <li>${i.quantity} x ${i.itemName} @ £${i.unitPrice.toFixed(2)}</li>
                `).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
};
  
//Template for displaying all restaurants
const allRestaurantsTemplate = `
    <div class="max-w-6xl mx-auto px-4 py-8 slide-up">
        <h1 class="text-3xl font-bold mb-6">All Restaurants</h1>
        <div id="restaurants-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Restaurants will be dynamically inserted here -->
            <div class="flex justify-center items-center col-span-full">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        </div>
    </div>
`;
//Template for displaying favourite restaurants
const favouritesTemplate = `
    <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">My Favourites</h1>
        <div id="no-favourites" class="text-center py-8 hidden">
            <p class="text-gray-500">You haven't added any restaurants to your favourites yet.</p>
        </div>
        <div id="favourites-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Favourite restaurants will be loaded here -->
        </div>
    </div>
`;
//Make templates available in other JS files
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
    generateTimeFields, 
    customerMenuTemplate,
    userOrdersTemplate,
    allRestaurantsTemplate,
    favouritesTemplate
}; 