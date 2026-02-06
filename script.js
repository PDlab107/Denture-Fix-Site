// Cart management
let cart = JSON.parse(localStorage.getItem('dentureFixCart')) || [];

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // If we're on the cart page, render the cart
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
    
    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.getAttribute('data-product-name');
            const productPrice = parseFloat(this.getAttribute('data-product-price'));
            const productId = this.getAttribute('data-product-id');
            
            addToCart({
                id: productId,
                name: productName,
                price: productPrice
            });
            
            // Show feedback
            this.textContent = 'Added!';
            this.style.background = '#10b981';
            setTimeout(() => {
                this.textContent = 'Get a Free Quote';
                this.style.background = '';
            }, 1500);
        });
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            handleCheckout();
        });
    }
});

function addToCart(product) {
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (!existingProduct) {
        cart.push(product);
        saveCart();
        updateCartCount();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function saveCart() {
    localStorage.setItem('dentureFixCart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cart.length;
    });
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartSummary.style.display = 'none';
        cartEmpty.style.display = 'block';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    cartSummary.style.display = 'block';
    
    // Render cart items
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Product ID: ${item.id}</p>
            </div>
            <div class="cart-item-price">£${item.price.toFixed(2)}</div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update totals
    document.getElementById('cart-subtotal').textContent = `£${total.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `£${total.toFixed(2)}`;
}

function handleCheckout() {
    // TODO: Integrate with Shopify Checkout
    // This is where Shopify Buy Button SDK or direct checkout URL integration will go
    
    /* 
     * SHOPIFY INTEGRATION PLACEHOLDER
     * 
     * To integrate with Shopify checkout, you will need to:
     * 
     * 1. Set up your Shopify store and note your store domain
     * 2. Create products in Shopify that match the services above
     * 3. Get the Shopify variant IDs for each product
     * 4. Update the data-product-id attributes to use Shopify variant IDs
     * 
     * Option A: Using Shopify Buy Button SDK
     * - Include the Shopify Buy Button SDK in your HTML
     * - Initialize the SDK with your store domain and API key
     * - Use the SDK to create a checkout with the cart items
     * 
     * Example code:
     * const client = ShopifyBuy.buildClient({
     *   domain: 'YOUR_STORE.myshopify.com',
     *   storefrontAccessToken: 'YOUR_ACCESS_TOKEN'
     * });
     * 
     * client.checkout.create().then((checkout) => {
     *   const lineItemsToAdd = cart.map(item => ({
     *     variantId: item.id,
     *     quantity: 1
     *   }));
     *   
     *   client.checkout.addLineItems(checkout.id, lineItemsToAdd).then((checkout) => {
     *     window.location.href = checkout.webUrl;
     *   });
     * });
     * 
     * Option B: Direct Checkout URL
     * - Build a checkout URL with variant IDs and quantities
     * - Redirect to Shopify checkout
     * 
     * Example:
     * const checkoutUrl = `https://YOUR_STORE.myshopify.com/cart/${variantId}:1`;
     * window.location.href = checkoutUrl;
     */
    
    // Temporary placeholder - alert user
    alert('Checkout integration pending. Please configure Shopify settings in script.js');
    console.log('Cart items to checkout:', cart);
    
    // In production, replace above with actual Shopify checkout redirect
}
