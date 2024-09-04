// Manual Entry Modal
const manualEntryButton = document.querySelector("#manualEntryButton");
const modalBackgroundEntry = document.querySelector("#modal-background-entry");
const modalEntry = document.querySelector("#modal-entry");

// Tutorial Modal
const modalBackgroundTutorial = document.querySelector("#modal-background-tutorial");
const modalTutorial = document.querySelector("#modal-tutorial");
const openTutorial = document.querySelector("#openTutorial");

// Verification Modal
const modalBackgroundVerification = document.querySelector("#modal-background-verification");
const modalVerification = document.querySelector("#modal-verification");
const openVerification = document.querySelector("#openVerification");
let hasVerified = false;

// Logout Modal
const openLogout = document.querySelector("#openLogout");
const modalBackgroundLogout = document.querySelector("#modal-background-logout");
const modalLogout = document.querySelector("#modal-logout");
const confirmLogout = document.querySelector('#confirm-logout');

// Login Modal
const openLogin = document.querySelector("#openLogin");
const modalBackgroundLogin = document.querySelector("#modal-background-login");
const modalLogin = document.querySelector("#modal-login");
const loginUsername = document.querySelector("#login-username");
const loginPassword = document.querySelector("#login-password");
const submitLogin = document.querySelector("#submit-login");

// Signup Modal
const openSignup = document.querySelector("#openSignup");
const modalBackgroundSignup = document.querySelector("#modal-background-signup");
const modalSignup = document.querySelector("#modal-signup");
const goFromSignupToLogin = document.querySelector("#go-from-signup-to-login");

// Submit Barcode
const submitBarcode = document.getElementById("submitBarcode");

// Navigation Variables
const openPreferencesButton = document.getElementById("openPreferences");
const backToMainButton = document.getElementById("backToMain");
const mainContent = document.getElementById("mainContent");
const preferencesContent = document.getElementById("preferencesContent");

// Signup functionality
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const submitSignup = document.querySelector("#submit-signup");
let hasSignedUp = false;
let activeLogin = false;

// Time Control and Greeting
const nameWelcome = document.querySelector("#name-welcome");
const now = new Date();
const hours = now.getHours();

// When HTML is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Code for popup.html
  if (window.location.pathname.endsWith("popup.html")) { // On the main page
    // Redirects user to settings
    document.getElementById("openPreferences").addEventListener("click", function () {
        window.location.href = chrome.runtime.getURL("preferences.html");
    });

    emailjs.init("Igrq_UNPItE8jc0Iw"); // Initialises email service

    // Carousel
    const container = document.querySelector(".outer-container");
    const carouselContainer = container.querySelector(".carousel-container");
    const carousel = container.querySelector(".carousel");
    const carouselItems = carousel.querySelectorAll(".carousel-item");

    // Mouse Controls for Carousel
    let isMouseDown = false;
    let currentMousePos = 0;
    let lastMousePos = 0;
    let lastMoveTo = 0;
    let moveTo = 0;

    // Creates Carousel
    const createCarousel = () => {
      // Sizes Carousel
      const carouselProps = onResize();
      const length = carouselItems.length;
      const degrees = 360 / length;
      const gap = window.innerWidth <= 400 ? 10 : 20;
      const tz = distanceZ(carouselProps.w, length, gap);

      const fov = calculateFov(carouselProps);
      const height = Math.max(150, calculateHeight(tz)); // Ensure minimum height
      const width = Math.max(200, carouselProps.w); // Ensure minimum width

      container.style.width = width + "px"; // Sets width of Container
      container.style.height = height + "px"; // Sets height of Container

      // Puts other carousel items at an angle
      carouselItems.forEach((item, i) => {
        const degreesByItem = degrees * i + "deg";
        item.style.setProperty("--rotatey", degreesByItem);
        item.style.setProperty("--tz", tz + "px");
      });
    };

    // Helper function to smooth out movement
    const lerp = (a, b, n) => (1 - n) * b + n * a;

    // Calculate how far back element should be and therefore width
    const distanceZ = (widthElement, length, gap) => {
      return widthElement / 2 / Math.tan(Math.PI / length) + gap;
    };

    // Calculate height depending on how far back it is
    const calculateHeight = (z) => {
      const t = Math.atan((90 * Math.PI) / 180 / 2);
      const height = t * 2 * z;

      return height;
    };

    // Sets sizing
    const calculateFov = (carouselProps) => {
      const perspective = window.getComputedStyle(carouselContainer).perspective.split("px")[0];

      const length = Math.sqrt(carouselProps.w * carouselProps.w) + Math.sqrt(carouselProps.h * carouselProps.h);
      const fov = 2 * Math.atan(length / (2 * perspective)) * (180 / Math.PI);
      return fov;
    };

    // Gets cursor position
    const getPosX = (x) => {
      currentMousePos = x;

      // Determine the direction of the swipe
      const rotationSensitivity = window.innerWidth <= 400 ? 1 : 2; // Adjust sensitivity for narrow screen

      // Update moveTo based on direction of the swipe
      if (currentMousePos < lastMousePos) {
        // Swiping left
        moveTo -= rotationSensitivity;
      } else if (currentMousePos > lastMousePos) {
        // Swiping right
        moveTo += rotationSensitivity;
      }

      lastMousePos = currentMousePos;
    };

    // Updates carousel
    const update = () => {
      lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
      carousel.style.setProperty("--rotatey", `${lastMoveTo}deg`);

      requestAnimationFrame(update);
    };

    // Gets sizing of carousel
    const onResize = () => {
      const boundingCarousel = carouselContainer.getBoundingClientRect();

      const carouselProps = {
        w: boundingCarousel.width,
        h: boundingCarousel.height,
      };

      return carouselProps;
    };

    // Event listeners for all mouse actions
    const initEvents = () => {
      // Mouse Down
      carousel.addEventListener("mousedown", () => {
        isMouseDown = true;
        carousel.style.cursor = "grabbing";
      });

      // Mouse Up
      carousel.addEventListener("mouseup", () => {
        isMouseDown = false;
        carousel.style.cursor = "grab";
      });

      container.addEventListener("mouseleave", () => (isMouseDown = false));

      carousel.addEventListener("mousemove", (e) => isMouseDown && getPosX(e.clientX));

      carousel.addEventListener("touchstart", () => {
        isMouseDown = true;
        carousel.style.cursor = "grabbing";
      });

      carousel.addEventListener("touchend", () => {
        isMouseDown = false;
        carousel.style.cursor = "grab";
      });

      container.addEventListener("touchmove", (e) => isMouseDown && getPosX(e.touches[0].clientX));

      window.addEventListener("resize", createCarousel);

      update();
      createCarousel();
    };

    initEvents();

    // Email Validity Div variable
    const emailValidityDiv = document.querySelector("#email-validity");

    // Calls function every time the input changes
    email.addEventListener("input", () => {
      emailValidity();
    });

    function emailValidity() {
      const emailValue = email.value;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
      // ^ Start of string
      // [] Defines character set
      // ^ inside the character set negates it, so ^\s@ means “any character except whitespace (\s) and @”.
      // + means “one or more” of the preceding element.
      // @ is the symbl in the email
      // [^\s@]+ Matches the domain name part.
      // \. The escaped . matches the literal dot in the email.
      // [^\s@]+: Matches the top-level domain like com or org
      // $ Asserts the end of the string.
      // .test() is used to test whether the string emailValue matches the pattern.

      updateCriteria(emailValidityDiv, emailValid);

      return emailValid;
    }

    // Password validity variables
    const password = document.querySelector("#password");
    const lengthCriteria = document.querySelector("#length");
    const specialCriteria = document.querySelector("#special");
    const numberCriteria = document.querySelector("#number");

    // Checks if password input changes and runs the password validity function
    password.addEventListener("input", () => {
      passwordValidity();
    });

    // Checks password validity
    function passwordValidity() {
      const passwordValue = password.value;
      const lengthValid = passwordValue.length >= 8; // If it is greater than 8 characters
      const specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue); // Tests if it has one of the characters
      const numberValid = /\d/.test(passwordValue); // Checks for a digit from 0-9

      // Updates colour and icon for each criteria
      updateCriteria(lengthCriteria, lengthValid);
      updateCriteria(specialCriteria, specialValid);
      updateCriteria(numberCriteria, numberValid);

      return lengthValid && specialValid && numberValid;
    }

    // Changes colour and icon if test is valid
    function updateCriteria(element, isValid) {
      if (isValid) {
        element.classList.remove("has-text-white");
        element.classList.add("has-text-success");
        element.querySelector("i").classList.remove("fa-times");
        element.querySelector("i").classList.add("fa-check");
      } else {
        element.classList.remove("has-text-success");
        element.classList.add("has-text-white");
        element.querySelector("i").classList.remove("fa-check");
        element.querySelector("i").classList.add("fa-times");
      }
    }

    document.getElementById('openPrivacyPolicy').addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('docs/PRIVACY-POLICY.md') });
    });

    // Add an event listener to the capture screenshot button
    document.getElementById("captureScreenshotButton").addEventListener("click", captureScreenshot);

    // Function to capture the screenshot
    async function captureScreenshot() {
      // Request desktop capture permission
      chrome.desktopCapture.chooseDesktopMedia(["screen"], (streamId) => {
        // Create a new MediaStream object
        navigator.mediaDevices.getUserMedia({
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: streamId,
            },
          },
        }).then((stream) => {
          // Create a video element to capture the screen
          const video = document.createElement("video");
          video.srcObject = stream;

          // Create a canvas element to capture the screenshot
          const canvas = document.createElement("canvas");
          canvas.width = screen.availWidth;
          canvas.height = screen.availHeight;

          // Draw the video on the canvas
          video.play().then(() => {
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

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

    // Checks if the submit signup button is clicked
    submitSignup.addEventListener("click", () => {
      if (passwordValidity() && emailValidity() && username.value.length > 0) { // Checks if password and email is valid
        handleSignup();
        modalVerification.classList.add("is-active");
      } else {
        alert("Email, password or username does not meet the criteria"); // If not valid alerts the user that a criteria is not met
      }
    });

    // Open Manual Entry Modal
    manualEntryButton.addEventListener("click", () => {
      modalEntry.classList.add("is-active");
    });

    // Open Signup Modal
    openSignup.addEventListener("click", () => {
      modalSignup.classList.add("is-active");
    });

    // Open Tutorial Modal
    openTutorial.addEventListener("click", () => {
      modalTutorial.classList.add("is-active");
    });

    // Open Verification Modal
    openVerification.addEventListener("click", () => {
      modalVerification.classList.add("is-active");
    });

    // Open Logout Modal
    openLogout.addEventListener("click", () => {
      modalLogout.classList.add("is-active");
    });

    // Close Manual Entry Modal
    modalBackgroundEntry.addEventListener("click", () => {
      modalEntry.classList.remove("is-active");
    });

    // Close Signup Modal
    modalBackgroundSignup.addEventListener("click", () => {
      modalSignup.classList.remove("is-active");
    });

    // Close Verification Modal
    modalBackgroundVerification.addEventListener("click", () => {
      modalVerification.classList.remove("is-active");
    });

    // Close Tutorial Modal
    modalBackgroundTutorial.addEventListener("click", () => {
      modalTutorial.classList.remove("is-active");
    });

    // Close Logout Modal
    modalBackgroundLogout.addEventListener("click", () => {
      modalLogout.classList.remove("is-active");
    });

    // Close Login Modal
    modalBackgroundLogin.addEventListener("click", () => {
      modalLogin.classList.remove("is-active");
    });

    goFromSignupToLogin.addEventListener("click", () => {
      modalSignup.classList.remove("is-active");
      modalLogin.classList.add("is-active");
    });

    submitLogin.addEventListener("click", () => {
      loginUser(loginUsername.value, loginPassword.value);
    });

    // Gets barcode number and runs fetchData
    submitBarcode.addEventListener("click", () => {
      var barcodeEntry = document.getElementById("barcodeEntry");
      var barcodeNumber = barcodeEntry.value;
      console.log(barcodeNumber);
      fetchData(barcodeNumber);
      modalEntry.classList.remove("is-active");
    });

    confirmLogout.addEventListener("click", function() {
      console.log("Logged out");
      chrome.storage.sync.set({ activeLogin: false });
      handleGreeting();
      openSignup.innerHTML = "Signup";
      openSignup.classList.remove("remove-navbar-item");
      openTutorial.innerHTML = "";
      openTutorial.classList.add("remove-navbar-item");
      openLogout.innerHTML = "";
      openLogout.classList.add("remove-navbar-item");
      openPreferencesButton.classList.add("remove-navbar-item");
      openPreferencesButton.innerHTML = "";
      modalLogout.classList.remove("is-active");
    });

    async function fetchData(barcode) {
      try {
        // Makes API call
        const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        // Puts all data in a variable
        const data = await response.json();

        // Wait for the HTML content to be loaded (Helps with image handeling)
        await new Promise((resolve) => {
          setTimeout(resolve, 100); // You can adjust the timeout value as needed
        });

        if (data.status === 1) { // If product is found
          // Set the data to individual variables
          const product = data.product;
          const productName = product.product_name_en || product.product_name;
          const productBrand = product.brands || "Unknown Brand";
          const productGrade = product.nutriscore_data || "No Grade";
          const productIngredients = product.ingredients_text_en || product.ingredients_text || "Ingredients not available";
          const productImageUrl = product.image_url || "images/carousel-filler.png"; // Replace with a default image URL if needed

          // Checks ingredients analysis tags
          const ingredientsAnalysisTags = product.ingredients_analysis_tags || [];
          let isProductVegetarian = false;
          let isProductVegan = false;

          // Determine vegetarian and vegan status based on tags
          if (ingredientsAnalysisTags.includes("en:non-vegetarian")) {
              isProductVegetarian = false;
          } else if (ingredientsAnalysisTags.includes("en:vegetarian")) {
              isProductVegetarian = true;
          } else if (ingredientsAnalysisTags.includes("en:vegetarian-status-unknown")) {
              isProductVegetarian = false;
          }

          if (ingredientsAnalysisTags.includes("en:non-vegan")) {
              isProductVegan = false;
          } else if (ingredientsAnalysisTags.includes("en:vegan")) {
              isProductVegan = true;
          } else if (ingredientsAnalysisTags.includes("en:vegan-status-unknown")) {
              isProductVegan = false;
          }

          // Retrieve vegetarian and vegan preference from storage and compare
          chrome.storage.sync.get(["vegetarian", "vegan"], (data) => {
              const userPrefersVegetarian = data.vegetarian || false;
              const userPrefersVegan = data.vegan || false;

              if (userPrefersVegetarian && !isProductVegetarian) {
                  alert("This is not vegetarian safe for you. You might want to avoid it."); // Alerts user if it is not vegetarian
              }

              if (userPrefersVegan && !isProductVegan) {
                  alert("This is not vegan safe for you. You might want to avoid it."); // Alerts the user if it is not vegan
              }
          });

          const allergens = product.allergens || []; // Create list of allergens from data
          var allergySafe = true;

          // Retrieve the user's allergy list from Chrome Sync
          chrome.storage.sync.get(["allergies"], function (result) {
            const userAllergies = result.allergies || [];
            // Loops through users allergies
            for (const allergy of userAllergies) {
              if (allergens.includes(allergy)) { // Checks if the the allergens from the data includes the user allergy
                alert("This is not allergy safe for you. You might want to avoid it."); // Alerts user if it is not safe
                allergySafe = false;
              } else {
                allergySafe = true;
              }
            }
          });

          // Print data in carousel
          document.getElementById("vegetarian-vegan-output").innerHTML = `Vegetarian: ${isProductVegetarian ? "Yes" : "No"}, Vegan: ${isProductVegan ? "Yes" : "No"}, Allergy Safe: ${allergySafe ? "Yes" : "No"}`;
          document.getElementById("product-name-output").innerHTML = "Product: " + productName;
          document.getElementById("brand-output").innerHTML = "Brand: " + productBrand;
          document.getElementById("ingredients-output").innerHTML = "Ingredients: " + productIngredients;
          document.getElementById("grade-output").innerHTML = "Grade: " + productGrade;
          document.getElementById("note-output").innerHTML = "Notes: ";
          document.getElementById("product-image-output").src = productImageUrl;

          // Logs all information
          console.log(`Product Name: ${productName}`);
          console.log(`Brand: ${productBrand}`);
          console.log(`Ingredients: ${productIngredients}`);
          console.log(`Image URL: ${productImageUrl}`);
        } else if (data.status === 0) { // If product is not found
          console.log("Product Not Found");
        } else { // Checks for random error
          console.log("Unknown Error");
        }
      } catch (error) {
        console.error("There was a problem with your fetch request: ", error);
      }
    }

    // Function to generate a random salt
    async function generateSalt() {
      const salt = new Uint8Array(16);
      window.crypto.getRandomValues(salt);
      return salt;
    }

    // Function to hash data with a salt
    async function hashData(data, salt) {
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(data);
      const saltBytes = new Uint8Array(salt);

      const combinedData = new Uint8Array(dataBytes.length + saltBytes.length);
      combinedData.set(dataBytes);
      combinedData.set(saltBytes, dataBytes.length);

      const hashBuffer = await crypto.subtle.digest('SHA-256', combinedData);
      return new Uint8Array(hashBuffer);
    }

    // Function to convert an ArrayBuffer to a base64 string
    function arrayBufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }

    // Function to convert a base64 string to an ArrayBuffer
    function base64ToArrayBuffer(base64) {
      const binary_string = window.atob(base64);
      const len = binary_string.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }

    // Handle Signup
    async function handleSignup() {
        // Generate Verification Code
        const code = generateVerificationCode();
    
        // Send verification email using EmailJS
        const emailParams = {
          to_email: email.value,
          to_name: username.value,
          message: code
        };
    
        emailjs.send('service_h6i54pt', 'template_jt8s6z7', emailParams)
        .then(function(response) {
          console.log('Email sent successfully!', response.status, response.text);
        }, function(error) {
          console.error('Failed to send email:', error);
        });
    
        const salt = await generateSalt();
    
        // Hash the password and email
        const hashedPassword = await hashData(password.value, salt);
        const hashedEmail = await hashData(email.value, salt);
    
        // Store username, hashed email, hashed password, and salt in Chrome Sync
        chrome.storage.sync.set({
          username: username.value, // Keep the username as it is
          email: arrayBufferToBase64(hashedEmail),
          password: arrayBufferToBase64(hashedPassword),
          salt: arrayBufferToBase64(salt),
          verificationCode: code, // Store the generated verification code
          hasSignedUp: true,
          hasVerified: false,
          activeLogin: true
        });
    
        modalSignup.classList.remove("is-active");
        checkSignedUp();
        handleGreeting();
    }
    async function verifyCode(inputCode) {
      chrome.storage.sync.get(["verificationCode"], function(result) {
        if (result.verificationCode === inputCode) {
          alert("Email verified successfully!");
          modalVerification.classList.remove("is-active");
          chrome.storage.sync.set({ hasVerified: true });
          checkSignedUp();
          handleGreeting();
        } else {
          alert("Incorrect verification code. Please try again.");
        }
      });
    }

    document.getElementById("verify-code-button").addEventListener("click", function() {
      const inputCode = document.getElementById("verification-code").value;
      verifyCode(inputCode);
    });
    
    
    async function loginUser(inputUsername, inputPassword) {
      chrome.storage.sync.get(["username", "password", "salt"], async (result) => {
          // Retrieve and log stored values for debugging
          console.log("Retrieved Username:", result.username);
          console.log("Retrieved Salt (Base64):", result.salt);
          console.log("Retrieved Password Hash (Base64):", result.password);
  
          // Check if the retrieved username matches the input username
          if (result.username === inputUsername) {
              // Verify the password
              const isValid = await verifyPassword(inputPassword, result.salt, result.password);
              if (isValid) {
                  console.log("Login successful!");
                  openSignup.innerHTML = "";
                  openSignup.classList.add("remove-navbar-item");
                  openTutorial.innerHTML = "Tutorial";
                  openTutorial.classList.remove("remove-navbar-item");
                  openLogout.innerHTML = "Logout";
                  openLogout.classList.remove("remove-navbar-item");
                  openPreferencesButton.classList.remove("remove-navbar-item");
                  openPreferencesButton.innerHTML = "Settings";
                  modalLogin.classList.remove("is-active");
                  chrome.storage.sync.set({ activeLogin: true });
                  checkSignedUp();
                  handleGreeting();
              } else {
                  console.log("Invalid password.");
              }
          } else {
              console.log("Username not found.");
          }
      });
    }
    
    async function verifyPassword(inputPassword, storedSalt, storedHash) {
      try {
          // Convert stored salt and hash from Base64
          const salt = base64ToArrayBuffer(storedSalt);
          const storedHashBuffer = base64ToArrayBuffer(storedHash);
  
          // Log the contents of the ArrayBuffer by converting to Uint8Array
          console.log("Converted Salt:", new Uint8Array(salt));
          console.log("Converted Hash Buffer:", new Uint8Array(storedHashBuffer));
  
          // Hash the input password with the same salt
          const inputHash = await hashData(inputPassword, salt);
  
          // Log the input hash for comparison
          console.log("Converted Input Hash:", inputHash);
  
          // Compare the input hash with the stored hash byte-by-byte
          return inputHash.every((byte, i) => byte === new Uint8Array(storedHashBuffer)[i]);
      } catch (error) {
          console.error("Error verifying password:", error);
          return false;
      }
    }
  
  

    function generateVerificationCode() {
      return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    }
  
    function handleGreeting() {
      let greeting = hours < 12 ? "Good Morning, " : "Good Afternoon, "; // Sets greeting depending on time

      // Outputs welcome greeting with username
      chrome.storage.sync.get(["username", "activeLogin"], (result) => {
        console.log(result.activeLogin);
        if (result.activeLogin === true) {
          nameWelcome.innerHTML = greeting + result.username;
        } else {
          nameWelcome.innerHTML = greeting + "Guest";
        }
      });
    }

    // Checks if the user is signed up
    function checkSignedUp() {
      chrome.storage.sync.get("activeLogin", (result) => {
        if (result.activeLogin === true) {
          // If signed up, removes signup from navbar, adds verification as navbar item.
          chrome.storage.sync.get("hasSignedUp", (result) => {
            if (result.hasSignedUp === true) {
              console.log("signed up");
              openSignup.innerHTML = "";
              openSignup.classList.add("remove-navbar-item");
              openVerification.innerHTML = 'Verify';
              openVerification.classList.remove("remove-navbar-item");
            }
          });

          // If verified, removes verified from navbar, adds setting and tutorial as navbar item.
          chrome.storage.sync.get("hasVerified", (result) => {
            if (result.hasVerified === true) {
              console.log("verified up");
              openVerification.innerHTML = "";
              openVerification.classList.add("remove-navbar-item");
              openTutorial.innerHTML = "Tutorial";
              openTutorial.classList.remove("remove-navbar-item");
              openLogout.innerHTML = "Logout";
              openLogout.classList.remove("remove-navbar-item");
              openPreferencesButton.classList.remove("remove-navbar-item");
              openPreferencesButton.innerHTML = "Settings";
            }
          });
        }
      });

      
    }

    checkSignedUp();
    handleGreeting();

    // Checks if user adds image
    document.getElementById("fileInput").addEventListener("change", function (event) {
      const file = event.target.files[0]; // Gets first image the user selected

      if (!file) { // Checks if a file was uploaded
        return;
      }

      const img = document.getElementById("uploadedImage");
      img.src = URL.createObjectURL(file); // Creates temporary URL for image
      img.onload = () => { // Runs when image finished loading
        URL.revokeObjectURL(img.src); // Revokes temporary URL created earlier
        scanBarcode(img); // Calls function to scan barcode
      };
    });

    // Function to scan the barcode
    async function scanBarcode(img) {
      // Creates a new Barcode Detector
      const detector = new BarcodeDetector({formats: ["code_39", "codabar", "ean_13"]}); // Creates list of accepted formatd

      // Convert the HTMLImageElement to a Blob (Binary Large Object)
      // Barcode Detector requires an Image Bitmap for detection
      imgToBlob(img).then((blob) => {
        // Create an ImageBitmap from the Blob
        createImageBitmap(blob).then((imageBitmap) => {
          // Detect the barcode
          detector.detect(imageBitmap).then((barcodes) => {
            // Process the detected barcode
            if (barcodes.length > 0) {
              console.log("Barcode detected:", barcodes[0].rawValue);
              fetchData(barcodes[0].rawValue); // Calls fetchData function
            } else {
              console.log("No barcode detected");
            }
          }).catch((error) => {
              console.error("Error detecting barcode:", error);
          });
        }).catch((error) => {
            console.error("Error creating ImageBitmap:", error);
          });
      }).catch((error) => {
          console.error("Error converting image to Blob:", error);
        });
    }

    // Function to convert an HTMLImageElement to a Blob
    function imgToBlob(img) {
      return new Promise((resolve, reject) => {
        // Creates a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
      
        // Converts contents of canvas to blob
        canvas.toBlob((blob) => {
            resolve(blob);
          },
          "image/png",
          1.0
        );
      });
    }
  }

  // Code for preferences.html
  if (window.location.pathname.endsWith("preferences.html")) { // If on the settings page
    document.getElementById("backToMain").addEventListener("click", function () {
        window.location.href = chrome.runtime.getURL("popup.html"); // Returns to main page if home button clicked
    });

    document.getElementById('openPrivacyPolicy').addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('docs/PRIVACY-POLICY.md') });
    });

    // Checkbox variables
    const darkModeCheckbox = document.getElementById("darkModeCheckbox");
    const vegetarianCheckbox = document.getElementById("vegetarianCheckbox");
    const veganCheckbox = document.getElementById("veganCheckbox");

    // Allergy Input variables
    const allergyInput = document.getElementById("allergy-input");
    const addAllergyButton = document.getElementById("add-allergy");
    const allergyList = document.getElementById("allergy-list");

    // Load stored allergies and display them
    chrome.storage.sync.get(["allergies"], function (result) {
      const allergies = result.allergies || [];
      allergies.forEach(function (allergy) {
        displayAllergy(allergy); // Runs the function to display each allergy
      });
    });

    // Add allergy to the list and store it in Chrome Sync
    addAllergyButton.addEventListener("click", function () {
      const allergy = allergyInput.value.trim(); // Removes white space
      if (allergy) { // If there is something in the input
        chrome.storage.sync.get(["allergies"], function (result) {
          const allergies = result.allergies || [];
          allergies.push(allergy); // Adds allergy to list
          chrome.storage.sync.set({ allergies: allergies }, function () {
            displayAllergy(allergy); // Sets allergy to Chrome Sync and run display function
          });
        });
        allergyInput.value = ""; // Puts input back to blank
      }
    });

    // Display allergy in the list with a remove button
    function displayAllergy(allergy) {
      const li = document.createElement("li"); // Creates list element
      li.classList.add("is-flex", "is-align-items-center", "has-text-weight-bold", "has-text-white"); // Adds styling to list item

      // Creates remove Button
      const removeButton = document.createElement("button");
      removeButton.classList.add("delete", "mr-2"); // Adds styling

      // Checks if remove allergy button is clicked
      removeButton.addEventListener("click", function () {
        removeAllergy(allergy, li);
      });

      // Appends button and allergy to HTML.
      li.appendChild(removeButton);
      li.appendChild(document.createTextNode(allergy));
      allergyList.appendChild(li);
    }

    // Remove allergy from the list and Chrome Sync
    function removeAllergy(allergy, listItem) {
      chrome.storage.sync.get(["allergies"], function (result) {
        let allergies = result.allergies || [];

        // Filters out specified allergy
        allergies = allergies.filter((item) => item !== allergy); // Creates new array. If allergy is found in the array it is excluded from the new allergies array.

        chrome.storage.sync.set({ allergies: allergies }, function () { // Updated list saved to storage.
          // Ran after storage set
          listItem.remove(); // Item is removed from the ui.
        });
      });
    }

    // Load the saved state of Dark Mode
    chrome.storage.sync.get("darkMode", (data) => {
      darkModeCheckbox.checked = data.darkMode || false; // Checks if it already exists in chrome storage.
      updateIcon(darkModeCheckbox.checked); // Updates icon
    });

    // Load the saved state of Vegetarian
    chrome.storage.sync.get("vegetarian", (data) => {
      vegetarianCheckbox.checked = data.vegetarian || false; // Checks if it already exists in chrome storage.
    });

    // Load the saved state of Vegan
    chrome.storage.sync.get("vegan", (data) => {
      veganCheckbox.checked = data.vegan || false; // Checks if it already exists in chrome storage.
    });

    // Handle dark mode checkbox change
    darkModeCheckbox.addEventListener("change", () => {
      const isDarkMode = darkModeCheckbox.checked; // Sets variable depending on if checkbox is ticked.
      chrome.storage.sync.set({ darkMode: isDarkMode }); // Stores this setting in chrome storage.
      updateIcon(darkModeCheckbox.checked); // Calls the update Icon function
    });

    // Handle vegetarian checkbox change
    vegetarianCheckbox.addEventListener("change", () => {
      const isVegetarian = vegetarianCheckbox.checked; // Sets variable depending on if checkbox is ticked.
      chrome.storage.sync.set({ vegetarian: isVegetarian }); // stores this setting in chrome storage.
    });

    // Handle vegan checkbox change
    veganCheckbox.addEventListener("change", () => {
      const isVegan = veganCheckbox.checked; // Sets variable depending on if checkbox is ticked.
      chrome.storage.sync.set({ vegan: isVegan }); // stores this setting in chrome storage.
    });

    // Function to update the extension icon
    function updateIcon(isDarkMode) {
      const iconPath = isDarkMode ? "images/icon-light.png" : "images/icon-dark.png"; // Gets path to image depending on boolean
      chrome.action.setIcon({ path: iconPath }); // Sets the icon
    }
  }
});