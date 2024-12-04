/* DEFINING VARIABLES */

// Accessing Dom elements
const cartButton = document.querySelector('.cart-button');
const closeButton = document.querySelector('.close');
const products = document.querySelector('.products');
const addedItems = document.querySelector('.added-items');
const totalCount = document.querySelector('.count');
const clearAll = document.querySelector('.clear');

// Array to store product data
let productsData = [];

// Array to store the items added to the cart
let cart = [];





/* SHOW/HIDE SIDEBAR (SHOPPING CART) */

// function to toggle the shopping cart sidebar on and off screen
function toggleCart() {
    // add the class 'show cart' to the body of the document which shows the sidebar on the screen
    document.body.classList.toggle('cart-visible');
}

// toggle the shopping cart on when the cart button is clicked
cartButton.addEventListener('click', toggleCart);

// toggle the shopping cart off when the close button (inside the cart) is clicked
closeButton.addEventListener('click', toggleCart);





/* HELPER FUNCTION TO SAVE CART DATA IN LOCAL STORAGE */

function updateLocalStorage(){
    localStorage.setItem('cart',JSON.stringify(cart));
}





/* HELPER FUNCTION TO SHOW THE NUMBER OF ADDED ITEMS NEXT TO THE CART BUTTON */
function showCount(){
    if (cart.length <= 0) {
        totalCount.style.display='none';
    }
    else{
        totalCount.style.display='flex';
        totalCount.innerText=cart.reduce((accumulator,item)=>accumulator+item.quantity,0);
    }
}





/* DISPLAYING PRODUCT CARDS ON THE PAGE */

function displayProducts() {
    products.innerHTML = '';

    if (productsData.length > 0) {
        // for each product in the productsData array,
        // render the product as a card on the screen
        productsData.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('product-card');
            // adding a data-id attribute to each card
            // which helps later with adding items to the cart functionality
            newProduct.dataset.id = product.id;
            // dynamically setting the card content based on each product's properties
            newProduct.innerHTML = `
            <img src="${product.image}" alt="perfume bottle">
            <h2>${product.name}</h2>
            <div class="price">${product.price} AED</div>
            <button class="add-item">
                ADD TO CART
            </button>
            `
            products.appendChild(newProduct);
        });
    }
}





/* DISPLAYING THE ITEMS ADDED TO THE CART ON THE SIDEBAR */

function displayCart() {
    addedItems.innerHTML = '';
    if (cart.length > 0) {
        // for each item in the cart array,
        // render the item on the side bar
        cart.forEach(item => {
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            // adding a data-id attribute to each item
            // which helps later with removing items
            // and increasing/decreasing quantity
            newItem.dataset.id = item.id;

            // the cart only stores item id and quantity
            // hence we need the productData array in order to access
            // other properties of the item like image and price

            // finding the product in the productData array
            // has the same id as the current item and storing its data in itemInfo
            let productIndex = productsData.findIndex(product => product.id == item.id);
            let itemInfo = productsData[productIndex];

            // dynamically setting the item content based on each item's properties
            newItem.innerHTML = `
            <div class="item-image">
                    <img src="${itemInfo.image}" alt="item image">
                </div>
                <div class="item-name">${itemInfo.name}</div>
                <div class="total-price">
                ${itemInfo.price * item.quantity} AED
                </div>
                <div class="quantity">
                    <div class="decrease">-</div>
                    <div class="count">${item.quantity}</div>
                    <div class="increase">+</div>
                </div>
                <div class="remove-item">
                    <img src="images/trash.png" alt="remove item">
                </div>
            `;
            addedItems.appendChild(newItem);
        })
    }
    // each time a new item is added the count next to the cart needs to be rendered again
    showCount();
}





/* ADDING ITEMS TO THE SHOPPING CART */

function addToCart(itemId) {
    // search for the item in the cart
    // if found returns its index
    // if not found or the array is empty returns -1
    let itemIndex = cart.findIndex(item => item.id === itemId)

    // if the item is not already in the cart
    if (itemIndex < 0) {
        // add the item with a quantity of 1 to the cart
        cart.push({
            id: itemId,
            quantity: 1
        })
    }

    // if the item is already in the cart
    else {
        //increase the item's quantity by 1
        cart[itemIndex].quantity = cart[itemIndex].quantity + 1;
    }

    // saving the new cart to local storage
    updateLocalStorage();

    // displaying the added items on the sidebar
    displayCart();
}

// adding the item to the cart each time the 'add to cart'
// button is clicked inside of a card
products.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-item')) {
        let productId = event.target.parentElement.dataset.id;
        addToCart(productId);
    }
})





/* REMOVE ITEM FROM SHOPPING CART OR INCREASE / DECREASE QUANTITY */

addedItems.addEventListener('click', (event)=>{

    // when the trash button is clicked
    if (event.target.closest('.remove-item')) {
        let itemId = event.target.closest('.remove-item').parentElement.dataset.id;
        // removing the item from the cart
        // by filtering out the item with an id equal to the
        // id of the item that the trash symbol was clicked on
        cart = cart.filter(item => item.id !== itemId);
        updateLocalStorage();
        displayCart();
    }


    // when the minus button is clicked
    if (event.target.classList.contains('decrease')) {
        let itemId = event.target.parentElement.parentElement.dataset.id;
        let itemIndex = cart.findIndex(item => item.id === itemId);

        // decrease the quantity of the item if it's larger than one
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity = cart[itemIndex].quantity - 1;
            updateLocalStorage();
            displayCart();
        }
        // remove the item if its quantity is one 
        else {
            cart = cart.filter(item => item.id !== itemId);
            updateLocalStorage();
            displayCart();
        }
    }

    // when the plus button is clicked
    if (event.target.classList.contains('increase')) {
        let itemId = event.target.parentElement.parentElement.dataset.id;
        let itemIndex = cart.findIndex(item => item.id === itemId);
        // increase the quantity of the item by one
        cart[itemIndex].quantity = cart[itemIndex].quantity + 1;
        updateLocalStorage();
        displayCart();
    }
});





/* CLEAR ALL ITEMS FROM THE CART */

clearAll.addEventListener('click', () => {
    // set the cart to an empty array again
    cart = [];

    // clear local storage
    localStorage.removeItem('cart');

    // visually display that the cart is now empty
    displayCart();
})





/* FUNCTION TO RUN ON PAGE LOAD (INITIALIZING THE PAGE) */

function initializePage() {

    // fetch the product data from the pseudo database
    // represented in the products.json file
    // which mimicks the type of json data responses
    // we would get from a real world API or Server
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            productsData = data;
            displayProducts();
            displayCart();
        });
}

initializePage();