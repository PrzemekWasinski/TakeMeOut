import { restaurantMenuTemplate } from './templates.js';
import API_URL from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#menu') {
    loadMenuManagement();
  }
});

//Function to load menu 
async function loadMenuManagement() {
  //Check if the restaurant has an email to avoid errors
  const email = localStorage.getItem('currentRestaurantEmail');
  if (!email) {
    console.log('Restaurant email missing from localStorage.');
    return;
  }
  //Fetch menu
  try {
    const res = await fetch(`${API_URL}/menu/${email}`);
    if (!res.ok) {
      throw new Error('Failed to fetch menu');
    }
    const data = await res.json();

    document.getElementById('dynamic-content').innerHTML = restaurantMenuTemplate(data);
    attachEventHandlers();
    initializeItemSorting();
  } catch (err) {
    console.error('Failed to load menu:', err);
    alert('Failed to load menu. Please try again.');
  }

  //Drag and drop sorting for categories
  const categoryList = document.querySelector("#menu-categories");
  if (categoryList) {
    new Sortable(categoryList, {
      animation: 150,
      handle: ".drag-handle",
      onEnd: async () => {
        const orderedIds = Array.from(categoryList.children)
          .map(div => parseInt(div.dataset.id))
          .filter(id => !isNaN(id));

        const token = localStorage.getItem("restaurantToken");
        //Reorder the menu after user makes a change
        const res = await fetch(`${API_URL}/menu/categories/reorder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderedIds)
        });

        if (!res.ok) {
          alert("Failed to save category order");
        }
      }
    });
  }
}

//Function for adding new categories
function attachEventHandlers() {
  document.getElementById('add-category-btn')?.addEventListener('click', async () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 transform transition-all">
        <h2 class="text-xl font-semibold mb-4">Add New Category</h2>
        <input type="text" id="new-category-name" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-4" placeholder="Category Name">
        <div class="flex justify-end gap-4">
          <button id="cancel-category-btn" class="px-4 py-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button id="confirm-category-btn" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Add Category
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    //Cancel button
    const cancelBtn = modal.querySelector('#cancel-category-btn');
    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });

    //Confirm button
    const confirmBtn = modal.querySelector('#confirm-category-btn');
    const input = modal.querySelector('#new-category-name');
    
    input.focus();

    //Enter key handling
    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        confirmBtn.click();
      }
    });
    //Listen for confirm button
    confirmBtn.addEventListener('click', async () => {
      const name = input.value.trim();
      if (!name) return;

      const token = localStorage.getItem("restaurantToken");
      const requestBody = { name };

      console.log('Request body:', requestBody);
      //Updat ecategories
      const res = await fetch(`${API_URL}/menu/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to add category:', errorData);
        alert(errorData.message || 'Failed to add category');
        return;
      }

      modal.remove();
      loadMenuManagement();
    });
  });

  //Add item to category
  document.querySelectorAll('.add-item-btn').forEach(btn =>
    btn.addEventListener('click', () => showItemForm(null, btn.dataset.categoryId))
  );

  //Edit item
  document.querySelectorAll('.edit-item-btn').forEach(btn =>
    btn.addEventListener('click', () => showItemForm(btn.dataset.id, btn.dataset.categoryId))
  );

  //Delete item
  document.querySelectorAll('.delete-item-btn').forEach(btn =>
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (!confirm('Delete this item?')) return;

      const token = localStorage.getItem("restaurantToken");
      const res = await fetch(`${API_URL}/menu/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        loadMenuManagement();
      } else {
        alert('Failed to delete item');
      }
    })
  );


// Edit category
document.querySelectorAll('.edit-category-btn').forEach(btn =>
  btn.addEventListener('click', async () => {
    const id = parseInt(btn.dataset.categoryId);
    const currentName = btn.dataset.name;
    const newName = prompt("Edit category name:", currentName);
    if (!newName || newName === currentName) return;

    const token = localStorage.getItem("restaurantToken");

    const email = localStorage.getItem("currentRestaurantEmail");
    const resFetch = await fetch(`${API_URL}/menu/${email}`);
    if (!resFetch.ok) return alert("Failed to load categories");

    const categories = await resFetch.json();
    const cat = categories.find(c => c.id === id);
    if (!cat) return alert("Category not found");

    const updatedCategory = {
      Id: id,
      RestaurantId: parseInt(localStorage.getItem("restaurantId")),
      Name: newName,
      DisplayOrder: cat.displayOrder,
      MenuCategoryId: cat.id
    };
         

    const res = await fetch(`${API_URL}/menu/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedCategory)
    });

    if (res.ok) {
      loadMenuManagement();
    } else {
      const err = await res.json();
      alert(err.message || "Failed to update category");
    }
  })
);


  //Delete category
  document.querySelectorAll('.delete-category-btn').forEach(btn =>
    btn.addEventListener('click', async () => {
      const id = btn.dataset.categoryId;
      if (!confirm("Delete this category and all its items?")) return;

      const token = localStorage.getItem("restaurantToken");
      //Delete category from database
      const res = await fetch(`${API_URL}/menu/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        loadMenuManagement();
      } else {
        alert("Failed to delete category");
      }
    })
  );
}
//Function to show item details
async function showItemForm(itemId = null, categoryId = null) {
  let item = {
    name: '',
    description: '',
    ingredients: '',
    price: '',
    calories: '',
    isVegan: false,
    isAvailable: true,
    imageUrl: ''
  };
  //If the item has an id retrieve it form database
  if (itemId) {
    const token = localStorage.getItem("restaurantToken");
    const res = await fetch(`${API_URL}/menu/items/${itemId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) return alert('Failed to load item');
    item = await res.json();
  }
  //Create a form to display item information
  const formHtml = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form id="item-form" class="bg-white p-6 rounded w-full max-w-lg space-y-4 shadow-lg relative" enctype="multipart/form-data">
        <h2 class="text-lg font-semibold">${itemId ? 'Edit' : 'Add'} Menu Item</h2>
        <input type="text" name="name" value="${item.name}" class="input-field" placeholder="Item Name" required>
        <textarea name="description" class="input-field" placeholder="Description">${item.description}</textarea>
        <input type="text" name="ingredients" value="${Array.isArray(item.ingredients) ? item.ingredients.join(', ') : item.ingredients || ''}" class="input-field" placeholder="Comma-separated ingredients">
        <input type="number" name="price" value="${item.price}" step="0.01" min="0" class="input-field" placeholder="Price (£)" required>
        <input type="number" name="calories" value="${item.calories}" class="input-field" placeholder="Calories">
        <label class="block"><input type="checkbox" name="isVegan" ${item.isVegan ? 'checked' : ''}> Vegan</label>
        <label class="block"><input type="checkbox" name="isAvailable" ${item.isAvailable ? 'checked' : ''}> Available</label>
        <input type="file" name="image" accept="image/*" class="input-field">
        <div class="flex justify-end space-x-2 pt-4">
          <button type="submit" class="submit-btn">${itemId ? 'Update' : 'Create'}</button>
          <button type="button" id="cancel-item-btn" class="back-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', formHtml);

  //Cancel button
  document.getElementById('cancel-item-btn').addEventListener('click', () => {
    document.querySelector('#item-form').parentElement.remove();
  });

  //Listen for confirm button 
  document.getElementById('item-form').addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const token = localStorage.getItem("restaurantToken");

    let imageUrl = item.imageUrl || '';
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const uploadForm = new FormData();
      uploadForm.append('image', imageFile);
      //Upload edited item image to database
      const uploadRes = await fetch(`${API_URL}/menu/items/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadForm
      });

      const uploadData = await uploadRes.json();
      if (uploadRes.ok) {
        imageUrl = uploadData.imageUrl;
      } else {
        console.error("Image upload failed:", uploadData);
        return alert("Image upload failed.");
      }
    }
    //Get all other item details
    const body = {
      name: formData.get('name'),
      description: formData.get('description'),
      ingredients: formData.get('ingredients').split(',').map(i => i.trim()).filter(i => i),
      price: parseFloat(formData.get('price')),
      calories: parseInt(formData.get('calories')),
      isVegan: formData.get('isVegan') === 'on',
      isAvailable: formData.get('isAvailable') === 'on',
      imageUrl
    };
    //Check if item has an ID
    if (!itemId) {
      body.menuCategoryId = parseInt(categoryId);
      if (!body.menuCategoryId || isNaN(body.menuCategoryId)) {
        alert("Missing or invalid category ID for this item.");
        return;
      }
    }
    //Item URL
    const url = itemId
      ? `${API_URL}/menu/items/${itemId}`
      : `${API_URL}/menu/items`;
    const method = itemId ? 'PUT' : 'POST';
    //Update item details in database
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });
    //Check response
    if (res.ok) {
      document.querySelector('#item-form').parentElement.remove();
      loadMenuManagement();
    } else {
      const error = await res.json();
      console.error("Item save failed:", error);
      alert('Failed to save item: ' + (error.message || 'Check console for details'));
    }
  });
}

//Function to sort items
function initializeItemSorting() {
  const allSortableLists = document.querySelectorAll('.sortable-items');

  //Apply sortable behavior to each list
  allSortableLists.forEach(list => {
    new Sortable(list, {
      animation: 150,
      handle: '.drag-handle', 

      //Callback when drag-and-drop ends
      onEnd: async (evt) => {
        //Find the category of the dropped item
        const parentCategory = evt.to.closest('.menu-category');
        if (!parentCategory) return; 

        //Create an array of item IDs in their new order
        const reorderedIds = Array.from(evt.to.children)
          .map(li => parseInt(li.getAttribute('data-id')));

        try {
          //Send the new order to the server
          const res = await fetch(`${API_URL}/menu/items/reorder`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("restaurantToken")}` 
            },
            body: JSON.stringify(reorderedIds) 
          });

          //Check server response
          if (!res.ok) throw new Error('Failed to update item order');
        } catch (err) {
          console.error('Reordering error:', err);
        }
      }
    });
  });
}


export { loadMenuManagement };