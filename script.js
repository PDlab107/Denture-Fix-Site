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
                this.textContent = 'Add to Basket';
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
    // TODO: SHOPIFY CHECKOUT INTEGRATION
    // This function needs to be updated to integrate with Shopify checkout
    
    /* 
     * ==========================================
     * SHOPIFY CHECKOUT INTEGRATION INSTRUCTIONS
     * ==========================================
     * 
     * STEP 1: Set up Shopify Store
     * -----------------------------
     * - Create a Shopify store at https://www.shopify.com
     * - Note your store domain: YOUR_STORE.myshopify.com
     * - Create products in Shopify that match the services on this site
     * - Get the variant IDs for each product
     * 
     * STEP 2: Get Storefront Access Token
     * ------------------------------------
     * 1. Go to Shopify Admin → Apps → Develop apps
     * 2. Create a new app or select existing one
     * 3. Configure Storefront API scopes (unauthenticated_read_product_listings, etc.)
     * 4. Install the app and get the Storefront Access Token
     * 
     * STEP 3: Update Product IDs
     * ---------------------------
     * Update all data-product-id attributes in services.html with Shopify variant IDs:
     * - data-shopify-variant-id="gid://shopify/ProductVariant/XXXXXXXXXX"
     * 
     * STEP 4: Choose Integration Method
     * ----------------------------------
     * 
     * OPTION A: Using Shopify Buy Button SDK (Recommended)
     * =====================================================
     * 
     * 1. Include SDK in HTML pages:
     *    <script src="https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"></script>
     * 
     * 2. Initialize client at top of this file:
     *    const shopifyClient = ShopifyBuy.buildClient({
     *      domain: 'YOUR_STORE.myshopify.com',
     *      storefrontAccessToken: 'YOUR_ACCESS_TOKEN'
     *    });
     * 
     * 3. Replace the code below with:
     * 
     *    async function handleCheckout() {
     *      try {
     *        // Create a new checkout
     *        const checkout = await shopifyClient.checkout.create();
     *        
     *        // Prepare line items from cart
     *        const lineItemsToAdd = cart.map(item => ({
     *          variantId: item.shopifyVariantId, // Make sure to store this when adding to cart
     *          quantity: 1
     *        }));
     *        
     *        // Add items to checkout
     *        const updatedCheckout = await shopifyClient.checkout.addLineItems(
     *          checkout.id, 
     *          lineItemsToAdd
     *        );
     *        
     *        // Redirect to Shopify checkout
     *        window.location.href = updatedCheckout.webUrl;
     *        
     *      } catch (error) {
     *        console.error('Checkout error:', error);
     *        alert('There was an error processing your checkout. Please try again.');
     *      }
     *    }
     * 
     * OPTION B: Direct Checkout URL (Simpler but less flexible)
     * ==========================================================
     * 
     * Build a URL with variant IDs and redirect:
     * 
     *    function handleCheckout() {
     *      const SHOPIFY_STORE_DOMAIN = 'YOUR_STORE.myshopify.com'; // TODO: Replace
     *      
     *      // Build cart URL with variant IDs
     *      const cartItems = cart.map(item => 
     *        `${item.shopifyVariantId}:1`  // variantId:quantity
     *      ).join(',');
     *      
     *      const checkoutUrl = `https://${SHOPIFY_STORE_DOMAIN}/cart/${cartItems}`;
     *      
     *      // Redirect to Shopify cart/checkout
     *      window.location.href = checkoutUrl;
     *    }
     * 
     * STEP 5: Update addToCart Function
     * ----------------------------------
     * Modify addToCart() to capture Shopify variant IDs from the button data attributes
     * and store them with the cart item for use in checkout.
     */
    
    // ==========================================
    // TEMPORARY PLACEHOLDER (Remove in production)
    // ==========================================
    alert('Checkout integration pending. Please configure Shopify settings in script.js\n\n' +
          'See detailed integration instructions in the handleCheckout() function comments.');
    console.log('Cart items to checkout:', cart);
    console.log('Integration instructions: See handleCheckout() function in script.js');
    
    // In production, replace above with actual Shopify checkout redirect
}
