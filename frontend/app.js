const API = "http://44.195.107.128:5000"; // Update to your server IP if needed

// Helper to get headers with Auth
const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

// Check if Logged In
const isLoggedIn = () => !!localStorage.getItem("token");
const getRole = () => localStorage.getItem("role");

// Load Cars with Filters
async function loadCars(search = "", minPrice = "", maxPrice = "") {
    try {
        let url = `${API}/cars?search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load cars");
        const cars = await res.json();
        
        const container = document.getElementById("carsGrid");
        if (!container) return; // Not on index page
        
        container.innerHTML = cars.length ? "" : "<p style='text-align:center; grid-column: 1/-1;'>No cars found matching your criteria.</p>";
        
        cars.forEach(car => {
            const card = document.createElement("div");
            card.className = "card glass";
            card.innerHTML = `
                <img src="${car.image_url || 'https://via.placeholder.com/300x180'}" alt="${car.name}">
                <div class="card-content">
                    <div class="card-title">${car.name}</div>
                    <div class="card-price">${car.price}</div>
                    <div style="margin-bottom: 1rem;">
                        <span class="card-badge">${car.year}</span>
                        <span class="card-badge">${car.brand}</span>
                        <span class="card-badge">${car.fuel_type || 'Petrol'}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: #94a3b8; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${car.description}
                    </p>
                    ${getRole() === 'admin' ? `
                        <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                            <button onclick="deleteCar(${car.id})" class="btn btn-outline" style="color: #ff4d4d; border-color: #ff4d4d22; flex:1">Delete</button>
                        </div>
                    ` : ''}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
    }
}

// Predict Price
async function predictPrice(e) {
    if (e) e.preventDefault();
    const resultDiv = document.getElementById("predictionResult");
    const resultValue = document.getElementById("predictedValue");
    
    const data = {
        brand: document.getElementById("p-brand").value,
        year: document.getElementById("p-year").value,
        mileage: document.getElementById("p-mileage").value,
        fuel_type: document.getElementById("p-fuel").value
    };

    try {
        const res = await fetch(`${API}/predict`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        const result = await res.json();
        resultValue.innerText = `$${result.predicted_price.toLocaleString()}`;
        resultDiv.style.display = "block";
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        alert("Prediction failed. Please check your inputs.");
    }
}

// Delete Car
async function deleteCar(id) {
    if (!confirm("Are you sure you want to delete this car?")) return;
    try {
        const res = await fetch(`${API}/cars/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (res.ok) {
            alert("Car deleted successfully");
            loadCars();
        } else {
            alert("Failed to delete car. Access denied.");
        }
    } catch (err) {
        console.error(err);
    }
}

// Logout
function logout() {
    localStorage.clear();
    window.location = "login.html";
}

// Setup Navbar
function setupNavbar() {
    const nav = document.getElementById("navLinks");
    if (!nav) return;
    
    const role = getRole();
    if (!isLoggedIn()) {
        nav.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html" class="btn btn-primary">Register</a>
        `;
    } else {
        nav.innerHTML = `
            ${role === 'admin' ? '<a href="admin.html">Dashboard</a>' : ''}
            <span style="font-size: 0.8rem; color: #94a3b8;">${localStorage.getItem("email")}</span>
            <button onclick="logout()" class="btn btn-outline">Logout</button>
        `;
    }
}

// Initialize based on page
document.addEventListener("DOMContentLoaded", () => {
    setupNavbar();
    
    // Index Page
    if (document.getElementById("carsGrid")) {
        loadCars();
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                loadCars(e.target.value);
            });
        }
    }

    // Prediction Form
    const pForm = document.getElementById("predictionForm");
    if (pForm) {
        pForm.addEventListener("submit", predictPrice);
    }
});
