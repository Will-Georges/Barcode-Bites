// Set initial variables
const manualEntryButton = document.querySelector('#manualEntryButton');
const modalBackgroundEntry = document.querySelector('#modal-background-entry');
const modalEntry = document.querySelector('#modal-entry');

const openSignup = document.querySelector('#openSignup');
const modalBackgroundSignup = document.querySelector('#modal-background-signup');
const modalSignup = document.querySelector('#modal-signup');

const submitBarcode = document.getElementById("submitBarcode");
const openPreferencesButton = document.getElementById('openPreferences');
const backToMainButton = document.getElementById('backToMain');
const mainContent = document.getElementById('mainContent');
const preferencesContent = document.getElementById('preferencesContent');

const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const submitSignup = document.querySelector("#submit-signup");

let hasSignedUp = false;

document.addEventListener('DOMContentLoaded', function() {
    // Code for popup.html
    if (window.location.pathname.endsWith('popup.html')) {
        document.getElementById('openPreferences').addEventListener('click', function() {
            window.location.href = chrome.runtime.getURL('preferences.html');
        });

        // submit signup
        submitSignup.addEventListener('click', () => {
            handleSignup();
        })

        // Open Modal
        manualEntryButton.addEventListener('click', () => {
            modalEntry.classList.add('is-active');
        })

        // Open Signup Modal
        openSignup.addEventListener('click', () => {
            modalSignup.classList.add('is-active');
        })

        // Close Modal
        modalBackgroundEntry.addEventListener('click', () => {
            modalEntry.classList.remove('is-active');
        })

        // Close Modal
        modalBackgroundSignup.addEventListener('click', () => {
            modalSignup.classList.remove('is-active');
        })

        // Run when the manual entry submit button is clicked, and runs the API fetch function
        submitBarcode.addEventListener('click', () => {
            var barcodeEntry = document.getElementById("barcodeEntry");
            var barcodeNumber = barcodeEntry.value;
            console.log(barcodeNumber);
            fetchData(barcodeNumber)
            modalEntry.classList.remove('is-active');
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
                    var productName = data.product.product_name_en;
                    var productBrand = data.product.brands;
                    var productIngredients = data.product.ingredients_text_en;
                    var note = "";

                    if (productName === "") { // Checks if there is no specified English, and puts the original language as the output
                        productName = data.product.product_name;
                        note += "Product Name, ";
                    }

                    if (productIngredients === "") { // Checks if there is no specified English, and puts the original language as the output
                        productIngredients = data.product.ingredients_text;
                        note += "Ingredients could not be found in English.";
                    }

                    // Print data in output page
                    document.getElementById("product-name-output").innerHTML = "Product: " + productName;
                    document.getElementById("brand-output").innerHTML = "Brand: " + productBrand;
                    document.getElementById("ingredients-output").innerHTML = "Ingredients: " + productIngredients;
                    document.getElementById("note-output").innerHTML = "Notes: " + note;

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

        function handleSignup() {
            console.log("sign up submitted");
            if (username.value.length > 0 && email.value.length > 0 && password.value.length > 0) {
                modalSignup.classList.remove('is-active');
                hasSignedUp = true;
                localStorage.setItem("username", username.value);
                localStorage.setItem("email", email.value);
                localStorage.setItem("password", password.value);
            } else {
                console.log("didnt type in one of them.");
            }
        }

        document.getElementById('fileInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) {
                return;
            }
        
            const img = document.getElementById('uploadedImage');
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(img.src); // Clean up the URL object
                scanBarcode(img);
            };
        });
        
        async function scanBarcode(imageEl) {
            // Check if BarcodeDetector is supported
            if (!('BarcodeDetector' in globalThis)) {
                console.log('Barcode Detector is not supported by this browser.');
                document.getElementById('barcodeResult').textContent = 'Barcode Detector is not supported by this browser.';
                return;
            }
        
            try {
                const barcodeDetector = new BarcodeDetector({
                    formats: ['code_39', 'codabar', 'ean_13']
                });
        
                // Detect barcodes from the image
                const barcodes = await barcodeDetector.detect(imageEl);
        
                // Display results
                if (barcodes.length > 0) {
                    document.getElementById('barcodeResult').textContent = 'Barcode Detected: ' + barcodes[0].rawValue;
                } else {
                    document.getElementById('barcodeResult').textContent = 'No barcode detected.';
                }
            } catch (err) {
                console.error('Error detecting barcode:', err);
                document.getElementById('barcodeResult').textContent = 'Error detecting barcode: ' + err.message;
            }
        }
    }

    // Code for preferences.html
    if (window.location.pathname.endsWith('preferences.html')) {
        document.getElementById('backToMain').addEventListener('click', function() {
            window.location.href = chrome.runtime.getURL('popup.html');
        });

        const checkbox = document.getElementById('darkModeCheckbox');
  
        // Load the saved state
        chrome.storage.sync.get('darkMode', (data) => {
            checkbox.checked = data.darkMode || false; // Checks if it already exists in chrome storage.
            updateIcon(checkbox.checked);
        });
    
        // Handle checkbox change
        checkbox.addEventListener('change', () => {
            const isDarkMode = checkbox.checked; // Sets variable depending on if checkbox is ticked.
            chrome.storage.sync.set({ darkMode: isDarkMode }); // stores this setting in chrome storage.
            updateIcon(isDarkMode);
        });
    
        // Function to update the extension icon
        function updateIcon(isDarkMode) {
            const iconPath = isDarkMode ? "images/icon-light.png" : "images/icon-dark.png"; // says where the file is.
            chrome.action.setIcon({ path: iconPath }); // Sets the icon
        }
    }

});

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

function clearStorage() {
    localStorage.clear();
}