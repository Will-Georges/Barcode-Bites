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
const openProfile = document.querySelector('#openProfile');
const nameWelcome = document.querySelector('#name-welcome');
const now = new Date();
const hours = now.getHours();


document.addEventListener('DOMContentLoaded', function() {
    // Code for popup.html
    if (window.location.pathname.endsWith('popup.html')) {
        document.getElementById('openPreferences').addEventListener('click', function() {
            window.location.href = chrome.runtime.getURL('preferences.html');
        });

        const emailValidityDiv = document.querySelector("#email-validity");

        email.addEventListener('input', () => {
            emailValidity();
        });

        function emailValidity() {
            const emailValue = email.value;
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

            updateEmailValidity(emailValidityDiv, emailValid);

            return emailValid;
        }

        function updateEmailValidity(element, isValid) {
            if (isValid) {
                element.classList.remove('has-text-danger');
                element.classList.add('has-text-success');
                element.querySelector('i').classList.remove('fa-times');
                element.querySelector('i').classList.add('fa-check');
            } else {
                element.classList.remove('has-text-success');
                element.classList.add('has-text-danger');
                element.querySelector('i').classList.remove('fa-check');
                element.querySelector('i').classList.add('fa-times');
            }
        }

        const password = document.querySelector("#password");
        const lengthCriteria = document.querySelector("#length");
        const specialCriteria = document.querySelector("#special");
        const numberCriteria = document.querySelector("#number");

        password.addEventListener('input', () => {
            passwordValidity();
        });

        function passwordValidity() {
            const passwordValue = password.value;
            const lengthValid = passwordValue.length >= 8;
            const specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
            const numberValid = /\d/.test(passwordValue);

            updateCriteria(lengthCriteria, lengthValid);
            updateCriteria(specialCriteria, specialValid);
            updateCriteria(numberCriteria, numberValid);

            return lengthValid && specialValid && numberValid;
        }

        function updateCriteria(element, isValid) {
            if (isValid) {
                element.classList.remove('has-text-danger');
                element.classList.add('has-text-success');
                element.querySelector('i').classList.remove('fa-times');
                element.querySelector('i').classList.add('fa-check');
            } else {
                element.classList.remove('has-text-success');
                element.classList.add('has-text-danger');
                element.querySelector('i').classList.remove('fa-check');
                element.querySelector('i').classList.add('fa-times');
            }
        }


        // Add an event listener to the capture screenshot button
        document.getElementById('captureScreenshotButton').addEventListener('click', captureScreenshot);

        // Function to capture the screenshot
        async function captureScreenshot() {
            // Request desktop capture permission
            chrome.desktopCapture.chooseDesktopMedia(["screen"], (streamId) => {
            // Create a new MediaStream object
            navigator.mediaDevices.getUserMedia({
                video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId,
                },
                },
            })
            .then((stream) => {
                // Create a video element to capture the screen
                const video = document.createElement('video');
                video.srcObject = stream;
        
                // Create a canvas element to capture the screenshot
                const canvas = document.createElement('canvas');
                canvas.width = screen.availWidth;
                canvas.height = screen.availHeight;
        
                // Draw the video on the canvas
                video.play().then(() => {
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        
                // Get the screenshot as a data URL
                const dataUrl = canvas.toDataURL();
        
                // Create an image element from the screenshot
                const img = new Image();
                img.src = dataUrl;
                img.onload = () => {
                    // Run the scanBarcode function with the screenshot
                    scanBarcode(img);
                };
                });
            })
            .catch((error) => {
                console.error("Error getting user media:", error);
            });
            });
        }

        // submit signup
        submitSignup.addEventListener('click', () => {
            if (passwordValidity() && emailValidity()) {
                handleSignup();
            } else {
                alert("Email or password does not meet the criteria");
            }
        });

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
            try {
                const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
                const data = await response.json();
        
                // Load the output HTML content
                await loadHTML('output-container', 'pages/output.html');
        
                // Wait for the HTML content to be loaded
                await new Promise(resolve => {
                    setTimeout(resolve, 100); // You can adjust the timeout value as needed
                });
        
                if (data.status === 1) {
                    // Set the data to individual variables
                    var productName = data.product.product_name_en;
                    var productBrand = data.product.brands;
                    var productIngredients = data.product.ingredients_text_en;
                    var note = "";
        
                    if (productName === "") {
                        productName = data.product.product_name;
                        note += "Product Name, ";
                    }
        
                    if (productIngredients === "") {
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
                } else if (data.status === 0) {
                    console.log("Product Not Found");
                } else {
                    console.log("Unknown Error");
                }
            } catch (error) {
                console.error("There was a problem with your fetch request: ", error);
            }
        }

        function handleSignup() {
            if (username.value.length > 0 && email.value.length > 0 && password.value.length > 0) {
                modalSignup.classList.remove('is-active');
                hasSignedUp = true;
                localStorage.setItem("hasSignedUp", hasSignedUp);
                localStorage.setItem("username", username.value);
                localStorage.setItem("email", email.value);
                localStorage.setItem("password", password.value);
                checkSignedUp();
            } else {
                alert("One or more fields are blank.");
            }
        }

        function checkSignedUp() {
            let greeting = "";
            if (hours < 12) {
                greeting = "Good Morning, ";
            } else {
                greeting = "Good Afternoon, ";
            }
            if (localStorage.getItem("username") === null) {
                nameWelcome.innerHTML = greeting + "Guest";
            } else {
                nameWelcome.innerHTML = greeting + localStorage.getItem("username");
            }
            if (localStorage.getItem("hasSignedUp") === "true") {
                console.log("signed up");
                openSignup.innerHTML = "";
                openSignup.classList.add("remove-navbar-item");
                openProfile.innerHTML = "Profile";
                openProfile.classList.remove("remove-navbar-item");
                openPreferencesButton.classList.remove("remove-navbar-item");
                openPreferencesButton.innerHTML = "Settings";
            }
        }

        checkSignedUp();

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
        
        // Function to scan the barcode
        async function scanBarcode(img) {
            // Create a new BarcodeDetector
            const detector = new BarcodeDetector({
                formats: ['code_39', 'codabar', 'ean_13']
            });
        
            // Convert the HTMLImageElement to a Blob
            imgToBlob(img).then((blob) => {
            // Create an ImageBitmap from the Blob
            createImageBitmap(blob).then((imageBitmap) => {
                // Detect the barcode
                detector.detect(imageBitmap).then((barcodes) => {
                // Process the detected barcode
                if (barcodes.length > 0) {
                    console.log('Barcode detected:', barcodes[0].rawValue);
                    fetchData(barcodes[0].rawValue);
                } else {
                    console.log('No barcode detected');
                }
                }).catch((error) => {
                console.error('Error detecting barcode:', error);
                });
            }).catch((error) => {
                console.error('Error creating ImageBitmap:', error);
            });
            }).catch((error) => {
            console.error('Error converting image to Blob:', error);
            });
        }

        // Function to convert an HTMLImageElement to a Blob
        function imgToBlob(img) {
            return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png', 1.0);
            });
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