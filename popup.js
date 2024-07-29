// Set initial variables
const manualEntryButton = document.querySelector('#manualEntryButton');
const modalBackground = document.querySelector('.modal-background');
const modal = document.querySelector('.modal');
const submitBarcode = document.getElementById("submitBarcode");
const openPreferencesButton = document.getElementById('openPreferences');
const backToMainButton = document.getElementById('backToMain');
const mainContent = document.getElementById('mainContent');
const preferencesContent = document.getElementById('preferencesContent');


// Function to load HTML content into a container
function loadHTML(containerId, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// Function to remove HTML content from a container
function removeHTML(containerId) {
    document.getElementById(containerId).innerHTML = '';
}

// If preferences is opened, the main content should be hidden
openPreferencesButton.addEventListener('click', () => {
    mainContent.style.display = 'none';
    preferencesContent.style.display = 'block';
});

// If the main content is viewed again, the preferences should be hidden
backToMainButton.addEventListener('click', () => {
    preferencesContent.style.display = 'none';
    mainContent.style.display = 'block';
});

// Open Modal
manualEntryButton.addEventListener('click', () => {
    modal.classList.add('is-active');
    removeHTML('navbar-container');
    removeHTML('footer-container');
})

// Close Modal
modalBackground.addEventListener('click', () => {
    modal.classList.remove('is-active');
    loadHTML('navbar-container', 'pages/navbar.html');
    loadHTML('footer-container', 'pages/footer.html');
})

// Run when the manual entry submit button is clicked, and runs the API fetch function
submitBarcode.addEventListener('click', () => {
    var barcodeEntry = document.getElementById("barcodeEntry");
    var barcodeNumber = barcodeEntry.value;
    console.log(barcodeNumber);
    fetchData(barcodeNumber)
    modal.classList.remove('is-active');
    loadHTML('output-container', 'pages/output.html');
})

// Featches Data
async function fetchData(barcode) {
    try { // Code can be tested for errors while it is being executed
        const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}`); // Makes API call
        if (!response.ok) {
            throw new Error("Network response was not OK"); // Give error if no response.
        }
        const data = await response.json(); // Assigned responded data to a variable
        console.log(data);

        if (data.status === 1) { // If product found
            console.log("Product Found");
            // Set the data to individual variables
            const productName = data.product.product_name;
            const productBrand = data.product.brands;
            const productIngredients = data.product.ingredients_text;

            // Print data in output page
            document.getElementById("product-name-output").innerHTML = "Product: " + productName;
            document.getElementById("brand-output").innerHTML = "Brand: " + productBrand;
            document.getElementById("ingredients-output").innerHTML = "Ingredients: " + productIngredients;

            console.log(`Product Name: ${productName}`);
            console.log(`Brand: ${productBrand}`);
            console.log(`Ingredients: ${productIngredients}`);
        } else if (data.status === 0) { // If product not found
            console.log("Product Not Found");
        } else { // If there is a response but an unknown error.
            console.log("Unknown Error");
        }
    } catch (error) { // Block of code to be executed, if an error occurs in the try block.
        // If try block of code fails.
        console.error("There was a problem with your fetch request: ", error);
    }
}

// Load navbar HTML on page load
document.addEventListener('DOMContentLoaded', () => {
    loadHTML('navbar-container', 'pages/navbar.html');
    loadHTML('footer-container', 'pages/footer.html');
});
   