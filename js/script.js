// Products Data
const products = [
    {
        id: 1,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "mens",
        image: "images/tshirt-1.jpg"
    },
    {
        id: 2,
        name: "Vintage Black Tee",
        price: 24.99,
        category: "mens",
        image: "images/tshirt-2.jpg"
    },
    {
        id: 3,
        name: "Graphic Design T-Shirt",
        price: 29.99,
        category: "graphic",
        image: "images/tshirt-3.jpg"
    },
    {
        id: 4,
        name: "Women's V-Neck T-Shirt",
        price: 22.99,
        category: "womens",
        image: "images/tshirt-4.jpg"
    },
    {
        id: 5,
        name: "Casual Striped T-Shirt",
        price: 26.99,
        category: "mens",
        image: "images/tshirt-5.jpg"
    },
    {
        id: 6,
        name: "Summer Floral Tee",
        price: 24.99,
        category: "womens",
        image: "images/tshirt-6.jpg"
    },
    {
        id: 7,
        name: "Abstract Art T-Shirt",
        price: 34.99,
        category: "graphic",
        image: "images/tshirt-7.jpg"
    },
    {
        id: 8,
        name: "Minimalist Design T-Shirt",
        price: 28.99,
        category: "graphic",
        image: "images/tshirt-8.jpg"
    }
];

// Cart Array
let cart = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Product Grid
    const productGrid = document.querySelector('.product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Shopping Cart
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout');
    
    // Testimonials
    const testimonialSlider = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    
    // Forms
    const newsletterForm = document.getElementById('newsletter-form');
    const contactForm = document.getElementById('contact-form');
    
    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    // Initialize Functions
    displayProducts('all');
    updateCartCount();
    
    // Filter Products
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter value
            const filter = btn.dataset.filter;
            
            // Display filtered products
            displayProducts(filter);
        });
    });
    
    // Display Products Function
    function displayProducts(filter) {
        // Clear product grid
        productGrid.innerHTML = '';
        
        // Filter products
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(product => product.category === filter);
        
        // Display products
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            
            productCard.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        // Add Event Listeners to Add to Cart Buttons
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', addToCart);
        });
    }
    
    // Add to Cart Function
    function addToCart(e) {
        // Get product id
        const productId = parseInt(e.target.dataset.id);
        
        // Find product
        const product = products.find(p => p.id === productId);
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Update quantity
            existingItem.quantity++;
        } else {
            // Add product to cart
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        // Update cart UI
        updateCart();
        updateCartCount();
        
        // Show success message or animation
        showToast('Product added to cart!');
    }
    
    // Update Cart Function
    function updateCart() {
        // Clear cart items container
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            // Add cart items
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <div class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Add Event Listeners to Quantity Buttons
            const decreaseBtns = document.querySelectorAll('.decrease');
            const increaseBtns = document.querySelectorAll('.increase');
            const removeItemBtns = document.querySelectorAll('.remove-item');
            
            decreaseBtns.forEach(btn => {
                btn.addEventListener('click', decreaseQuantity);
            });
            
            increaseBtns.forEach(btn => {
                btn.addEventListener('click', increaseQuantity);
            });
            
            removeItemBtns.forEach(btn => {
                btn.addEventListener('click', removeItem);
            });
        }
        
        // Update total price
        updateTotalPrice();
    }
    
    // Update Cart Count Function
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Update Total Price Function
    function updateTotalPrice() {
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    }
    
    // Decrease Quantity Function
    function decreaseQuantity(e) {
        const productId = parseInt(e.target.dataset.id);
        const item = cart.find(item => item.id === productId);
        
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            // Remove item from cart
            cart = cart.filter(item => item.id !== productId);
        }
        
        // Update cart UI
        updateCart();
        updateCartCount();
    }
    
    // Increase Quantity Function
    function increaseQuantity(e) {
        const productId = parseInt(e.target.dataset.id);
        const item = cart.find(item => item.id === productId);
        
        item.quantity++;
        
        // Update cart UI
        updateCart();
        updateCartCount();
    }
    
    // Remove Item Function
    function removeItem(e) {
        const productId = parseInt(e.target.closest('.remove-item').dataset.id);
        
        // Remove item from cart
        cart = cart.filter(item => item.id !== productId);
        
        // Update cart UI
        updateCart();
        updateCartCount();
    }
    
    // Clear Cart Function
    function clearCart() {
        // Clear cart array
        cart = [];
        
        // Update cart UI
        updateCart();
        updateCartCount();
    }
    
    // Checkout Function
    function checkout() {
        if (cart.length === 0) {
            showToast('Your cart is empty!');
            return;
        }
        
        // Show success message
        showToast('Order placed successfully!');
        
        // Clear cart
        clearCart();
        
        // Close cart modal
        cartModal.classList.remove('active');
    }
    
    // Toast Message Function
    function showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        
        // Add toast to body
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            
            // Remove toast from DOM after animation
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Testimonial Slider Function
    function showSlide(index) {
        // Hide all slides
        testimonialSlider.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show selected slide
        testimonialSlider[index].classList.add('active');
        
        // Add active class to selected dot
        dots[index].classList.add('active');
    }
    
    // Initialize testimonial slider
    showSlide(0);
    
    // Set interval for testimonial slider
    let slideIndex = 0;
    setInterval(() => {
        slideIndex = (slideIndex + 1) % testimonialSlider.length;
        showSlide(slideIndex);
    }, 5000);
    
    // Dot Click Event
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slideIndex = index;
            showSlide(slideIndex);
        });
    });
    
    // Newsletter Form Submit Event
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email value
            const email = this.querySelector('input[type="email"]').value;
            
            // Validate email
            if (!validateEmail(email)) {
                showToast('Please enter a valid email address!');
                return;
            }
            
            // Show success message
            showToast('Thank you for subscribing to our newsletter!');
            
            // Clear form
            this.reset();
        });
    }
    
    // Contact Form Submit Event
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('#name').value;
            const email = this.querySelector('#email').value;
            const message = this.querySelector('#message').value;
            
            // Validate email
            if (!validateEmail(email)) {
                showToast('Please enter a valid email address!');
                return;
            }
            
            // Show success message
            showToast('Thank you for your message. We will get back to you soon!');
            
            // Clear form
            this.reset();
        });
    }
    
    // Email Validation Function
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
    
    // Cart Modal Event Listeners
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('active');
        updateCart();
    });
    
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
    
    // Close cart when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
    
    // Cart Button Event Listeners
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', checkout);
    
    // Create default placeholder images when none are available
    // This is for demonstration purposes
    createPlaceholderImages();
});

// Additional CSS for the toast messages
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #333;
        color: #fff;
        padding: 15px 20px;
        border-radius: 5px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .toast.show {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Function to create placeholder images when real ones are not available
function createPlaceholderImages() {
    // Check if we need to create a hero background
    const hero = document.querySelector('.hero');
    if (hero && getComputedStyle(hero).backgroundImage === 'none') {
        // Create a placeholder Hero background with CSS
        hero.style.background = 'linear-gradient(45deg, #ff6b6b, #546de5)';
    }
    
    // Check if we need a newsletter background
    const newsletter = document.querySelector('.newsletter');
    if (newsletter && getComputedStyle(newsletter).backgroundImage === 'none') {
        // Create a placeholder Newsletter background with CSS
        newsletter.style.background = 'linear-gradient(45deg, #3f3d56, #546de5)';
    }
    
    // Check if we need an about image
    const aboutImg = document.getElementById('about-img');
    if (aboutImg && (!aboutImg.getAttribute('src') || aboutImg.getAttribute('src') === 'images/about.jpg')) {
        // Create a placeholder About image
        const aboutImgWrapper = aboutImg.parentElement;
        aboutImgWrapper.innerHTML = `
            <div style="height: 300px; background: linear-gradient(45deg, #546de5, #3f3d56); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                <i class="fas fa-tshirt" style="font-size: 5rem; margin-bottom: 1rem;"></i>
            </div>
        `;
    }
    
    // Create placeholder product images
    const productImages = document.querySelectorAll('.product-img img');
    productImages.forEach((img, index) => {
        if (!img.getAttribute('src') || img.naturalWidth === 0) {
            // Create a placeholder image with SVG
            const colors = ['#ff6b6b', '#ff9e7d', '#546de5', '#e77fb3', '#8A2BE2', '#32cd32', '#FFD700', '#FF4500'];
            const color = colors[index % colors.length];
            
            const svgImage = `
                <div style="width: 100%; height: 100%; background-color: ${color}; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
                    <i class="fas fa-tshirt" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <div style="text-align: center; padding: 0 1rem;">T-Shirt ${index + 1}</div>
                </div>
            `;
            
            const container = img.parentElement;
            container.innerHTML = svgImage;
        }
    });
}
