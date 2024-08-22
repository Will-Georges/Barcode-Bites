// Set initial variables
const manualEntryButton = document.querySelector("#manualEntryButton");
const modalBackgroundEntry = document.querySelector("#modal-background-entry");
const modalEntry = document.querySelector("#modal-entry");

const openSignup = document.querySelector("#openSignup");
const modalBackgroundSignup = document.querySelector(
  "#modal-background-signup"
);
const modalSignup = document.querySelector("#modal-signup");

const submitBarcode = document.getElementById("submitBarcode");
const openPreferencesButton = document.getElementById("openPreferences");
const backToMainButton = document.getElementById("backToMain");
const mainContent = document.getElementById("mainContent");
const preferencesContent = document.getElementById("preferencesContent");

const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const submitSignup = document.querySelector("#submit-signup");

let hasSignedUp = false;
const openProfile = document.querySelector("#openProfile");
const nameWelcome = document.querySelector("#name-welcome");
const now = new Date();
const hours = now.getHours();

document.addEventListener("DOMContentLoaded", function () {
  // Code for popup.html
  if (window.location.pathname.endsWith("popup.html")) {
    document
      .getElementById("openPreferences")
      .addEventListener("click", function () {
        window.location.href = chrome.runtime.getURL("preferences.html");
      });

    const container = document.querySelector(".outer-container");
    const carouselContainer = container.querySelector(".carousel-container");
    const carousel = container.querySelector(".carousel");
    const carouselItems = carousel.querySelectorAll(".carousel-item");

    let isMouseDown = false;
    let currentMousePos = 0;
    let lastMousePos = 0;
    let lastMoveTo = 0;
    let moveTo = 0;

    const createCarousel = () => {
      const carouselProps = onResize();
      const length = carouselItems.length;
      const degrees = 360 / length;
      const gap = window.innerWidth <= 400 ? 10 : 20;
      const tz = distanceZ(carouselProps.w, length, gap);

      const fov = calculateFov(carouselProps);
      const height = Math.max(150, calculateHeight(tz)); // Ensure minimum height
      const width = Math.max(200, carouselProps.w); // Ensure minimum width

      container.style.width = width + "px";
      container.style.height = height + "px";

      carouselItems.forEach((item, i) => {
        const degreesByItem = degrees * i + "deg";
        item.style.setProperty("--rotatey", degreesByItem);
        item.style.setProperty("--tz", tz + "px");
      });
    };

    // Helper function to smooth out movement (linear interpolation)
    const lerp = (a, b, n) => (1 - n) * b + n * a;

    const distanceZ = (widthElement, length, gap) => {
      return widthElement / 2 / Math.tan(Math.PI / length) + gap;
    };

    const calculateHeight = (z) => {
      const t = Math.atan((90 * Math.PI) / 180 / 2);
      const height = t * 2 * z;

      return height;
    };

    const calculateFov = (carouselProps) => {
      const perspective = window
        .getComputedStyle(carouselContainer)
        .perspective.split("px")[0];

      const length =
        Math.sqrt(carouselProps.w * carouselProps.w) +
        Math.sqrt(carouselProps.h * carouselProps.h);
      const fov = 2 * Math.atan(length / (2 * perspective)) * (180 / Math.PI);
      return fov;
    };

    const getPosX = (x) => {
      currentMousePos = x;

      // Determine the direction of the swipe
      const rotationSensitivity = window.innerWidth <= 400 ? 1 : 2; // Adjust sensitivity for narrow screens

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

    const update = () => {
      lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
      carousel.style.setProperty("--rotatey", `${lastMoveTo}deg`);

      requestAnimationFrame(update);
    };

    const onResize = () => {
      const boundingCarousel = carouselContainer.getBoundingClientRect();

      const carouselProps = {
        w: boundingCarousel.width,
        h: boundingCarousel.height,
      };

      return carouselProps;
    };

    const initEvents = () => {
      carousel.addEventListener("mousedown", () => {
        isMouseDown = true;
        carousel.style.cursor = "grabbing";
      });
      carousel.addEventListener("mouseup", () => {
        isMouseDown = false;
        carousel.style.cursor = "grab";
      });
      container.addEventListener("mouseleave", () => (isMouseDown = false));

      carousel.addEventListener(
        "mousemove",
        (e) => isMouseDown && getPosX(e.clientX)
      );

      carousel.addEventListener("touchstart", () => {
        isMouseDown = true;
        carousel.style.cursor = "grabbing";
      });
      carousel.addEventListener("touchend", () => {
        isMouseDown = false;
        carousel.style.cursor = "grab";
      });
      container.addEventListener(
        "touchmove",
        (e) => isMouseDown && getPosX(e.touches[0].clientX)
      );

      window.addEventListener("resize", createCarousel);

      update();
      createCarousel();
    };

    initEvents();

    const emailValidityDiv = document.querySelector("#email-validity");

    email.addEventListener("input", () => {
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
        element.classList.remove("has-text-danger");
        element.classList.add("has-text-success");
        element.querySelector("i").classList.remove("fa-times");
        element.querySelector("i").classList.add("fa-check");
      } else {
        element.classList.remove("has-text-success");
        element.classList.add("has-text-danger");
        element.querySelector("i").classList.remove("fa-check");
        element.querySelector("i").classList.add("fa-times");
      }
    }

    const password = document.querySelector("#password");
    const lengthCriteria = document.querySelector("#length");
    const specialCriteria = document.querySelector("#special");
    const numberCriteria = document.querySelector("#number");

    password.addEventListener("input", () => {
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
        element.classList.remove("has-text-danger");
        element.classList.add("has-text-success");
        element.querySelector("i").classList.remove("fa-times");
        element.querySelector("i").classList.add("fa-check");
      } else {
        element.classList.remove("has-text-success");
        element.classList.add("has-text-danger");
        element.querySelector("i").classList.remove("fa-check");
        element.querySelector("i").classList.add("fa-times");
      }
    }

    // Add an event listener to the capture screenshot button
    document
      .getElementById("captureScreenshotButton")
      .addEventListener("click", captureScreenshot);

    // Function to capture the screenshot
    async function captureScreenshot() {
      // Request desktop capture permission
      chrome.desktopCapture.chooseDesktopMedia(["screen"], (streamId) => {
        // Create a new MediaStream object
        navigator.mediaDevices
          .getUserMedia({
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: streamId,
              },
            },
          })
          .then((stream) => {
            // Create a video element to capture the screen
            const video = document.createElement("video");
            video.srcObject = stream;

            // Create a canvas element to capture the screenshot
            const canvas = document.createElement("canvas");
            canvas.width = screen.availWidth;
            canvas.height = screen.availHeight;

            // Draw the video on the canvas
            video.play().then(() => {
              canvas
                .getContext("2d")
                .drawImage(video, 0, 0, canvas.width, canvas.height);

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
    submitSignup.addEventListener("click", () => {
      if (passwordValidity() && emailValidity()) {
        handleSignup();
      } else {
        alert("Email or password does not meet the criteria");
      }
    });

    // Open Modal
    manualEntryButton.addEventListener("click", () => {
      modalEntry.classList.add("is-active");
    });

    // Open Signup Modal
    openSignup.addEventListener("click", () => {
      modalSignup.classList.add("is-active");
    });

    // Close Modal
    modalBackgroundEntry.addEventListener("click", () => {
      modalEntry.classList.remove("is-active");
    });

    // Close Modal
    modalBackgroundSignup.addEventListener("click", () => {
      modalSignup.classList.remove("is-active");
    });

    // Run when the manual entry submit button is clicked, and runs the API fetch function
    submitBarcode.addEventListener("click", () => {
      var barcodeEntry = document.getElementById("barcodeEntry");
      var barcodeNumber = barcodeEntry.value;
      console.log(barcodeNumber);
      fetchData(barcodeNumber);
      modalEntry.classList.remove("is-active");
    });

    async function fetchData(barcode) {
        try {
          const response = await fetch(
            `https://world.openfoodfacts.net/api/v2/product/${barcode}`
          );
          if (!response.ok) {
            throw new Error("Network response was not OK");
          }
          const data = await response.json();
      
          // Wait for the HTML content to be loaded
          await new Promise((resolve) => {
            setTimeout(resolve, 100); // You can adjust the timeout value as needed
          });
      
          if (data.status === 1) {
            // Set the data to individual variables
            const product = data.product;
            const productName = product.product_name_en || product.product_name;
            const productBrand = product.brands || "Unknown Brand";
            const productIngredients =
              product.ingredients_text_en || product.ingredients_text || "Ingredients not available";
            const productImageUrl = product.image_url || "default_image_url"; // Replace with a default image URL if needed
            
            // Check ingredients analysis tags
            const ingredientsAnalysisTags = product.ingredients_analysis_tags || [];
            const isProductVegetarian = ingredientsAnalysisTags.includes("vegetarian");
            const isProductVegan = ingredientsAnalysisTags.includes("vegan");
      
            // Retrieve vegetarian preference from storage and compare
            chrome.storage.sync.get("vegetarian", (data) => {
              const userPrefersVegetarian = data.vegetarian || false;
              if (userPrefersVegetarian && !isProductVegetarian) {
                alert("This is not vegetarian safe for you. You might want to avoid it.");
              }
            });
      
            // Print data in output page
            document.getElementById("vegetarian-vegan-output").innerHTML =
              "Vegetarian: " + (isProductVegetarian ? "Yes" : "No");
            document.getElementById("product-name-output").innerHTML =
              "Product: " + productName;
            document.getElementById("brand-output").innerHTML =
              "Brand: " + productBrand;
            document.getElementById("ingredients-output").innerHTML =
              "Ingredients: " + productIngredients;
            document.getElementById("note-output").innerHTML = "Notes: ";
            document.getElementById("product-image-output").src = productImageUrl;
      
            console.log(`Product Name: ${productName}`);
            console.log(`Brand: ${productBrand}`);
            console.log(`Ingredients: ${productIngredients}`);
            console.log(`Image URL: ${productImageUrl}`);
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
      if (
        username.value.length > 0 &&
        email.value.length > 0 &&
        password.value.length > 0
      ) {
        modalSignup.classList.remove("is-active");
        hasSignedUp = true;
        chrome.storage.sync.set({ username: username.value });
        chrome.storage.sync.set({ email: email.value });
        chrome.storage.sync.set({ password: password.value });
        chrome.storage.sync.set({ hasSignedUp: hasSignedUp });
        checkSignedUp();
      } else {
        alert("One or more fields are blank.");
      }
    }

    function checkSignedUp() {
      let greeting = hours < 12 ? "Good Morning, " : "Good Afternoon, ";

      chrome.storage.sync.get("username", (result) => {
        if (result.username) {
          nameWelcome.innerHTML = greeting + result.username;
        } else {
          nameWelcome.innerHTML = greeting + "Guest";
        }
      });

      chrome.storage.sync.get("hasSignedUp", (result) => {
        if (result.hasSignedUp === true) {
          console.log("signed up");
          openSignup.innerHTML = "";
          openSignup.classList.add("remove-navbar-item");
          openProfile.innerHTML = "Profile";
          openProfile.classList.remove("remove-navbar-item");
          openPreferencesButton.classList.remove("remove-navbar-item");
          openPreferencesButton.innerHTML = "Settings";
        }
      });
    }

    checkSignedUp();

    document
      .getElementById("fileInput")
      .addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) {
          return;
        }

        const img = document.getElementById("uploadedImage");
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
        formats: ["code_39", "codabar", "ean_13"],
      });

      // Convert the HTMLImageElement to a Blob
      imgToBlob(img)
        .then((blob) => {
          // Create an ImageBitmap from the Blob
          createImageBitmap(blob)
            .then((imageBitmap) => {
              // Detect the barcode
              detector
                .detect(imageBitmap)
                .then((barcodes) => {
                  // Process the detected barcode
                  if (barcodes.length > 0) {
                    console.log("Barcode detected:", barcodes[0].rawValue);
                    fetchData(barcodes[0].rawValue);
                  } else {
                    console.log("No barcode detected");
                  }
                })
                .catch((error) => {
                  console.error("Error detecting barcode:", error);
                });
            })
            .catch((error) => {
              console.error("Error creating ImageBitmap:", error);
            });
        })
        .catch((error) => {
          console.error("Error converting image to Blob:", error);
        });
    }

    // Function to convert an HTMLImageElement to a Blob
    function imgToBlob(img) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/png",
          1.0
        );
      });
    }
  }

  // Code for preferences.html
  if (window.location.pathname.endsWith("preferences.html")) {
    document
      .getElementById("backToMain")
      .addEventListener("click", function () {
        window.location.href = chrome.runtime.getURL("popup.html");
      });

    const darkModeCheckbox = document.getElementById("darkModeCheckbox");
    const vegetarianCheckbox = document.getElementById("vegetarianCheckbox");
    const veganCheckbox = document.getElementById("veganCheckbox");

    // Load the saved state
    chrome.storage.sync.get("darkMode", (data) => {
      darkModeCheckbox.checked = data.darkMode || false; // Checks if it already exists in chrome storage.
      updateIcon(darkModeCheckbox.checked);
    });

    // Load the saved state
    chrome.storage.sync.get("vegetarian", (data) => {
      vegetarianCheckbox.checked = data.vegetarian || false; // Checks if it already exists in chrome storage.
    });

    // Load the saved state
    chrome.storage.sync.get("vegan", (data) => {
      veganCheckbox.checked = data.vegan || false; // Checks if it already exists in chrome storage.
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
      const iconPath = isDarkMode
        ? "images/icon-light.png"
        : "images/icon-dark.png"; // says where the file is.
      chrome.action.setIcon({ path: iconPath }); // Sets the icon
    }
  }
});

// Function to load HTML content into a container
function loadHTML(containerId, url) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(containerId).innerHTML = data;
    })
    .catch((error) => console.error("Error loading HTML:", error));
}

// Function to remove HTML content from a container
function removeHTML(containerId) {
  document.getElementById(containerId).innerHTML = "";
}
