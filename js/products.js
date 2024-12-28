

$(document).ready(function() {
  const productContainer = $("#product-container");
  const categoryFilter = $("#categoryFilter");
  const searchBox = $("#searchBox"); 
  let allProducts = [];

  $.ajax({
    url: "data/products.json",
    method: "GET",
    dataType: "json",
    success: function(data) {
      allProducts = data; 
      displayProducts(allProducts);
    },
    error: function(err) {
      console.error("Error loading products.json:", err);
      productContainer.text("Failed to load products.");
    }
  });

  function displayProducts(productsArray) {
    productContainer.empty();

    productsArray.forEach(product => {
      const productCard = $(`
        <div class="product-card">
          <img src="${product.image}" alt="${product.title}" />
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <p><strong>$${product.price.toFixed(2)}</strong></p>
          <button class="btn-add-cart">Add to Cart</button>
          <button class="btn-details">View Details</button>
        </div>
      `);

      productCard.find(".btn-add-cart").on("click", function() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(item => item.id === product.id);
        if(existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({...product, quantity: 1});
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        alert(`${product.title} added to cart!`);
      });

      productCard.find(".btn-details").on("click", function() {
        window.location.href = `product-detail.html?id=${product.id}`;
      });

      productContainer.append(productCard);
    });
  }

  categoryFilter.on("change", function() {
    applyFilters();
  });

  searchBox.on("keyup", function() {
    applyFilters();
  });

  function applyFilters() {
    const selectedCategory = categoryFilter.val();  
    const searchTerm = searchBox.val().toLowerCase();

    let filtered = allProducts;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(prod => prod.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(prod => {
        return (
          prod.title.toLowerCase().includes(searchTerm) ||
          prod.description.toLowerCase().includes(searchTerm)
        );
      });
    }

    displayProducts(filtered);
  }

  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = 0;
    cart.forEach(item => totalItems += item.quantity);
    $(".cart-count").text(totalItems);
  }

  updateCartCount();
});
