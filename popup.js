// Barcode Bites

// Javascript for Main Page

// Manual Entry Modal
const manualEntryButton = document.querySelector("#manualEntryButton");
const modalBackgroundEntry = document.querySelector("#modal-background-entry");
const modalEntry = document.querySelector("#modal-entry");

// Tutorial Modal
const modalBackgroundTutorial = document.querySelector(
  "#modal-background-tutorial"
);
const modalTutorial = document.querySelector("#modal-tutorial");
const openTutorial = document.querySelector("#openTutorial");

// Verification Modal
const modalBackgroundVerification = document.querySelector(
  "#modal-background-verification"
);
const modalVerification = document.querySelector("#modal-verification");
const openVerification = document.querySelector("#openVerification");

// Logout Modal
const openLogout = document.querySelector("#openLogout");
const modalBackgroundLogout = document.querySelector(
  "#modal-background-logout"
);
const modalLogout = document.querySelector("#modal-logout");
const confirmLogout = document.querySelector("#confirm-logout");

// Login Modal
const openLogin = document.querySelector("#openLogin");
const modalBackgroundLogin = document.querySelector("#modal-background-login");
const modalLogin = document.querySelector("#modal-login");
const loginUsername = document.querySelector("#login-username");
const loginPassword = document.querySelector("#login-password");
const submitLogin = document.querySelector("#submit-login");

// Signup Modal
const openSignup = document.querySelector("#openSignup");
const modalBackgroundSignup = document.querySelector(
  "#modal-background-signup"
);
const modalSignup = document.querySelector("#modal-signup");
const goFromSignupToLogin = document.querySelector("#go-from-signup-to-login");

// Submit Barcode
const submitBarcode = document.getElementById("submitBarcode");

// Navigation Variables
const openPreferencesButton = document.getElementById("openPreferences");

// Signup functionality
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const submitSignup = document.querySelector("#submit-signup");

// Time Control and Greeting
const nameWelcome = document.querySelector("#name-welcome");
const now = new Date();
const hours = now.getHours();

// When HTML is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;
  const MAX_VERIFICATION_ATTEMPTS = 5;
  const VALID_GRADES = new Set(["a", "b", "c", "d", "e", "unknown"]);
  const VALID_NOVA = new Set(["1", "2", "3", "4"]);

  const showElement = (el, show) => {
    if (!el) return;
    el.classList.toggle("remove-navbar-item", !show);
    el.hidden = !show;
  };

  const setText = (el, text) => {
    if (!el) return;
    el.textContent = text;
  };

  const applyTheme = (isDarkMode) => {
    document.documentElement.classList.toggle("theme-dark", isDarkMode);
    document.body.classList.toggle("theme-dark", isDarkMode);
  };

  const updateIcon = (isDarkMode) => {
    const iconPath = isDarkMode
      ? "images/icon-light.png"
      : "images/icon-dark.png";
    chrome.action.setIcon({ path: iconPath });
  };

  const setNavState = (state) => {
    const activeLogin = Boolean(state.activeLogin);
    const hasSignedUp = Boolean(state.hasSignedUp);
    const hasVerified = Boolean(state.hasVerified);

    const showSignup = !activeLogin && !hasSignedUp;
    const showLogin = !activeLogin && hasSignedUp;

    showElement(openSignup, showSignup);
    showElement(openLogin, showLogin);
    showElement(openVerification, activeLogin && hasSignedUp && !hasVerified);
    showElement(openTutorial, activeLogin && hasVerified);
    showElement(openLogout, activeLogin && hasVerified);
    showElement(openPreferencesButton, activeLogin && hasVerified);

    if (openSignup && showSignup) {
      openSignup.textContent = "Signup";
    }
    if (openLogin && showLogin) {
      openLogin.textContent = "Login";
    }
    if (openVerification && activeLogin && hasSignedUp && !hasVerified) {
      openVerification.textContent = "Verify";
    }
    if (openTutorial && activeLogin && hasVerified) {
      openTutorial.textContent = "Tutorial";
    }
    if (openLogout && activeLogin && hasVerified) {
      openLogout.textContent = "Logout";
    }
    if (openPreferencesButton && activeLogin && hasVerified) {
      openPreferencesButton.textContent = "Settings";
    }
  };

  const loadingIndicator = document.getElementById("loadingIndicator");
  const loadingText = document.getElementById("loadingText");
  const deleteAccountButton = document.getElementById("delete-account");
  const setLoading = (isLoading, message) => {
    if (!loadingIndicator || !loadingText) return;
    loadingText.textContent = message || "Loading...";
    loadingIndicator.classList.toggle("is-hidden", !isLoading);
  };

  const EMAIL_VERIFICATION_ENDPOINT = "";

  const getStorage = (keys) =>
    new Promise((resolve) => chrome.storage.sync.get(keys, resolve));

  const setStorage = (data) =>
    new Promise((resolve) => chrome.storage.sync.set(data, resolve));

  const handleGreeting = async () => {
    const greeting = hours < 12 ? "Good Morning, " : "Good Afternoon, ";
    const result = await getStorage(["username", "activeLogin"]);
    if (result.activeLogin === true) {
      setText(nameWelcome, greeting + (result.username || "User"));
    } else {
      setText(nameWelcome, greeting + "Guest");
    }
  };

  const checkSignedUp = async () => {
    const state = await getStorage([
      "activeLogin",
      "hasSignedUp",
      "hasVerified",
    ]);
    setNavState(state);
  };

  const clearAccount = async () => {
    await setStorage({
      username: null,
      email: null,
      password: null,
      salt: null,
      verificationCode: null,
      verificationExpiresAt: null,
      verificationAttempts: 0,
      hasSignedUp: false,
      hasVerified: false,
      activeLogin: false,
      allergies: [],
    });
    await checkSignedUp();
    handleGreeting();
    if (window.location.pathname.endsWith("preferences.html")) {
      window.location.href = chrome.runtime.getURL("popup.html");
    }
  };

  const validateBarcode = (barcode) => {
    const trimmed = String(barcode || "").trim();
    if (!/^\d{8,14}$/.test(trimmed)) return null;
    return trimmed;
  };

  const normalizeAllergenTag = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/^([a-z]{2}:)/, "")
      .replace(/[\s_-]+/g, " ")
      .trim();
  };

  const parseAllergens = (product) => {
    if (Array.isArray(product.allergens_tags)) {
      return product.allergens_tags.map(normalizeAllergenTag).filter(Boolean);
    }
    if (typeof product.allergens === "string") {
      return product.allergens
        .split(",")
        .map(normalizeAllergenTag)
        .filter(Boolean);
    }
    return [];
  };

  const buildIngredientsList = (container, ingredientsText) => {
    if (!container) return;
    const list = document.createElement("ul");
    const ingredientsArray = String(ingredientsText || "")
      .split(",")
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);
    if (ingredientsArray.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Ingredients not available";
      list.appendChild(li);
    } else {
      ingredientsArray.forEach((ingredient) => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        list.appendChild(li);
      });
    }
    container.replaceChildren(list);
  };

  const safeImageUrl = (url, fallback) => {
    try {
      if (!url) return fallback;
      const parsed = new URL(url, window.location.href);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.href;
      }
    } catch (error) {
      console.warn("Invalid image URL, using fallback.", error);
    }
    return fallback;
  };

  const getBrandLogoUrl = (brand) => {
    const rawBrand = String(brand || "").split(",")[0].trim();
    const slug = rawBrand.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!slug) return "images/carousel-filler.png";
    return `https://img.logo.dev/${slug}.com?token=pk_HbFyEPf9TCekBuFORJvQ4Q`;
  };

  // Code for popup.html
  if (window.location.pathname.endsWith("popup.html")) {
    // Redirects user to settings
    document
      .getElementById("openPreferences")
      .addEventListener("click", function () {
        window.location.href = chrome.runtime.getURL("preferences.html");
      });

    getStorage(["darkMode"]).then((data) => {
      const isDarkMode = Boolean(data.darkMode);
      applyTheme(isDarkMode);
      updateIcon(isDarkMode);
    });

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

    // Email Validity div variable
    const emailValidityDiv = document.querySelector("#email-validity");

    // Password validity variables
    const lengthCriteria = document.querySelector("#length");
    const specialCriteria = document.querySelector("#special");
    const numberCriteria = document.querySelector("#number");

    // Creates Carousel
    const createCarousel = () => {
      // Sizes Carousel
      const carouselProps = onResize();
      const length = carouselItems.length;
      const degrees = 360 / length;
      const gap = window.innerWidth <= 400 ? 10 : 20;
      const tz = distanceZ(carouselProps.w, length, gap);

      const fov = calculateFov(carouselProps);
      const height = Math.max(150, calculateHeight(tz));
      const width = Math.max(200, carouselProps.w);

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
      const perspective = window
        .getComputedStyle(carouselContainer)
        .perspective.split("px")[0];

      const length =
        Math.sqrt(carouselProps.w * carouselProps.w) +
        Math.sqrt(carouselProps.h * carouselProps.h);
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

      // Mouse moves off container
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

    // Initialises cursor events
    initEvents();

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
        element.classList.remove(
          "has-text-white",
          "has-text-info",
          "has-text-danger"
        );
        element.classList.add("has-text-success");
        element.querySelector("i").classList.remove("fa-times");
        element.querySelector("i").classList.add("fa-check");
      } else {
        element.classList.remove("has-text-success", "has-text-info");
        element.classList.add("has-text-danger");
        element.querySelector("i").classList.remove("fa-check");
        element.querySelector("i").classList.add("fa-times");
      }
    }

    // Checks if openPrivacyPolicy is clicked and opens it
    document
      .getElementById("openPrivacyPolicy")
      .addEventListener("click", () => {
        chrome.tabs.create({
          url: chrome.runtime.getURL("docs/PRIVACY-POLICY.md"),
        });
      });

    // Add an event listener to the capture screenshot button
    document
      .getElementById("captureScreenshotButton")
      .addEventListener("click", captureScreenshot);

    // Function to capture the screenshot
    async function captureScreenshot() {
      // Parts from https://developer.chrome.com/docs/extensions/reference/api/desktopCapture
      // Parts from https://github.com/wpp/ScreenStream
      // Parts from https://www.w3schools.com/graphics/canvas_drawing.asp
      // Parts from https://www.w3schools.com/html/html5_canvas.asp

      // Request desktop capture permission
      chrome.desktopCapture.chooseDesktopMedia(["window"], async (streamId) => {
        if (!streamId) {
          console.warn("Desktop capture was cancelled.");
          return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: streamId,
              },
            },
          });

          const video = document.createElement("video");
          video.srcObject = stream;
          video.muted = true;

          await new Promise((resolve) => {
            video.onloadedmetadata = () => resolve();
          });

          await video.play();

          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || screen.availWidth;
          canvas.height = video.videoHeight || screen.availHeight;
          canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

          stream.getTracks().forEach((track) => track.stop());

          const dataUrl = canvas.toDataURL();
          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            scanBarcode(img);
          };
        } catch (error) {
          console.error("Error getting user media:", error);
        }
      });
    }

    // Checks if the submit signup button is clicked
    submitSignup.addEventListener("click", async () => {
      if (
        passwordValidity() &&
        emailValidity() &&
        username.value.length > 0
      ) {
        // Checks if password and email is valid
        const signupSuccess = await handleSignup();
        if (signupSuccess) {
          modalVerification.classList.add("is-active");
        }
      } else {
        alert("Please complete all fields correctly."); // If not valid alerts the user that a criteria is not met
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

    // Open Login Modal
    openLogin.addEventListener("click", () => {
      modalLogin.classList.add("is-active");
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

    // Closes signup and opens login Modal
    goFromSignupToLogin.addEventListener("click", () => {
      modalSignup.classList.remove("is-active");
      modalLogin.classList.add("is-active");
    });

    // Checks if the user clicks login
    submitLogin.addEventListener("click", () => {
      loginUser(loginUsername.value.trim(), loginPassword.value);
    });

    // Delete account
    if (deleteAccountButton) {
      deleteAccountButton.addEventListener("click", async () => {
        const confirmDelete = confirm(
          "Delete your account and all stored data? This cannot be undone."
        );
        if (!confirmDelete) return;
        await clearAccount();
        modalLogin.classList.remove("is-active");
      });
    }

    // Gets barcode number from manual entry and runs fetchData
    submitBarcode.addEventListener("click", () => {
      var barcodeEntry = document.getElementById("barcodeEntry");
      var barcodeNumber = validateBarcode(barcodeEntry.value);
      if (!barcodeNumber) {
        alert("Please enter a valid barcode (8-14 digits).");
        return;
      }
      fetchData(barcodeNumber);
      modalEntry.classList.remove("is-active");
    });

    // Handles after user logs out
    confirmLogout.addEventListener("click", async function () {
      await setStorage({ activeLogin: false });
      await checkSignedUp();
      handleGreeting();
      modalLogout.classList.remove("is-active");
    });

    // Main API call function
    async function fetchData(barcode) {
      // Some Information from https://openfoodfacts.github.io/openfoodfacts-server/api/tutorial-off-api/
      const validatedBarcode = validateBarcode(barcode);
      if (!validatedBarcode) {
        alert("Please enter a valid barcode (8-14 digits).");
        return;
      }
      try {
          setLoading(true, "Loading product...");
          const response = await fetch(
            `https://world.openfoodfacts.net/api/v2/product/${validatedBarcode}`
          );
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        const data = await response.json();

        if (data.status === 1) {
          const product = data.product || {};

          const productName =
            product.product_name_en || product.product_name || "No Name";
          const productBrand = product.brands || "Unknown Brand";
          const productGradeRaw = String(product.nutrition_grades || "unknown").toLowerCase();
          const productGrade = VALID_GRADES.has(productGradeRaw)
            ? productGradeRaw
            : "unknown";
          const productNovaRaw = String(product.nova_groups || "");
          const productNova = VALID_NOVA.has(productNovaRaw) ? productNovaRaw : "";
          const productIngredients =
            product.ingredients_text_en ||
            product.ingredients_text ||
            "Ingredients not available";
          const productImageUrl = safeImageUrl(
            product.image_url,
            "images/carousel-filler.png"
          );

          const ingredientsAnalysisTags =
            product.ingredients_analysis_tags || [];
          const labelsHierarchy = product.labels_hierarchy || [];

          let isProductVegetarian = false;
          let isProductVegan = false;
          let isProductGlutenFree = false;
          let isProductOrganic = false;

          if (ingredientsAnalysisTags.includes("en:non-vegetarian")) {
            isProductVegetarian = false;
          } else if (ingredientsAnalysisTags.includes("en:vegetarian")) {
            isProductVegetarian = true;
          }

          if (ingredientsAnalysisTags.includes("en:non-vegan")) {
            isProductVegan = false;
          } else if (ingredientsAnalysisTags.includes("en:vegan")) {
            isProductVegan = true;
          }

          if (
            labelsHierarchy.includes("en:no-gluten") ||
            labelsHierarchy.includes("en:gluten-free")
          ) {
            isProductGlutenFree = true;
          } else if (labelsHierarchy.includes("en:gluten-status-unknown")) {
            isProductGlutenFree = false;
          }

          if (labelsHierarchy.includes("en:organic")) {
            isProductOrganic = true;
          } else if (labelsHierarchy.includes("en:organic-status-unknown")) {
            isProductOrganic = false;
          }

          const userPrefs = await getStorage([
            "vegetarian",
            "vegan",
            "glutenFree",
            "organic",
          ]);
          if (userPrefs.vegetarian && !isProductVegetarian) {
            alert(
              "This is not vegetarian safe for you. You might want to avoid it."
            );
          }
          if (userPrefs.vegan && !isProductVegan) {
            alert("This is not vegan safe for you. You might want to avoid it.");
          }
          if (userPrefs.glutenFree && !isProductGlutenFree) {
            alert(
              "This is not gluten free safe for you. You might want to avoid it."
            );
          }
          if (userPrefs.organic && !isProductOrganic) {
            alert(
              "This is not organic safe for you. You might want to avoid it."
            );
          }

          const allergens = parseAllergens(product);
          const allergyData = await getStorage(["allergies"]);
          const userAllergies = (allergyData.allergies || []).map(
            normalizeAllergenTag
          );
          const allergySafe = !userAllergies.some((allergy) =>
            allergens.includes(normalizeAllergenTag(allergy))
          );

          if (!allergySafe) {
            alert(
              "This is not allergy safe for you. You might want to avoid it."
            );
          }

          document.getElementById("product-image-output").src = productImageUrl;
          setText(document.getElementById("product-name-output"), productName);

          document.getElementById("vegetarian-vegan-output").innerHTML = `
          <strong>
            <span class="${
              isProductVegetarian ? "has-text-success" : "has-text-danger"
            }">
              <i class="fas ${
                isProductVegetarian ? "fa-check" : "fa-times"
              }"></i> 
              Vegetarian
            </span> <br>
            <span class="${
              isProductVegan ? "has-text-success" : "has-text-danger"
            }">
              <i class="fas ${isProductVegan ? "fa-check" : "fa-times"}"></i> 
              Vegan
            </span> <br>
            <span class="${
              allergySafe ? "has-text-success" : "has-text-danger"
            }">
              <i class="fas ${allergySafe ? "fa-check" : "fa-times"}"></i> 
              Allergy Safe
            </span> <br>
            <span class="${
              isProductGlutenFree ? "has-text-success" : "has-text-danger"
            }">
              <i class="fas ${
                isProductGlutenFree ? "fa-check" : "fa-times"
              }"></i> 
              Gluten Free
            </span> <br>
            <span class="${
              isProductOrganic ? "has-text-success" : "has-text-danger"
            }">
              <i class="fas ${isProductOrganic ? "fa-check" : "fa-times"}"></i> 
              Organic
            </span>
          </strong>
          `;

          const brandHeading = document.getElementById("brand-text-heading");
          setText(brandHeading, "Brand");
          brandHeading.classList.add("has-text-black");
          document.getElementById("brand-image-output").src = safeImageUrl(
            getBrandLogoUrl(productBrand),
            "images/carousel-filler.png"
          );
          setText(document.getElementById("brand-output"), productBrand);

          const ingredientsHeading = document.getElementById(
            "ingredients-text-heading"
          );
          setText(ingredientsHeading, "Ingredients");
          ingredientsHeading.classList.add("has-text-black");
          buildIngredientsList(
            document.getElementById("ingredients-output"),
            productIngredients
          );

          setText(document.getElementById("grade-text-heading"), "Nutritional Grade");
          document.getElementById(
            "grade-image-output"
          ).src = `images/health-rating/${productGrade}.png`;

          document.getElementById("nova-image-output").src = productNova
            ? `images/nova-group/${productNova}.png`
            : "images/carousel-filler.png";
          setText(
            document.getElementById("nova-output"),
            "(1-4) Higher is more processed"
          );
        } else if (data.status === 0) {
          alert("Product Not Found");
        } else {
          console.warn("Unknown API status response.");
        }
      } catch (error) {
        console.error("There was a problem with your fetch request: ", error);
      } finally {
        setLoading(false);
      }
    }


    // Parts found in https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
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

      const hashBuffer = await crypto.subtle.digest("SHA-256", combinedData);
      return new Uint8Array(hashBuffer);
    }

    // Function to convert an ArrayBuffer to a base64 string
    function arrayBufferToBase64(buffer) {
      let binary = "";
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
      const code = generateVerificationCode();

      if (EMAIL_VERIFICATION_ENDPOINT) {
        try {
          const response = await fetch(EMAIL_VERIFICATION_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to_email: email.value,
              to_name: username.value,
              code,
            }),
          });
          if (!response.ok) {
            throw new Error("Email service error");
          }
        } catch (error) {
          console.error("Failed to send email:", error);
          alert("Verification email failed to send. Please try again.");
          return false;
        }
      } else {
        // Simple dev mode for local testing without email services.
        alert(
          `Verification code: ${code}\nWrite it down and enter it in the verify box.`
        );
        console.log("Verification code:", code);
      }

      const salt = await generateSalt();
      const hashedPassword = await hashData(password.value, salt);
      const hashedEmail = await hashData(email.value, salt);

      await setStorage({
        username: username.value,
        email: arrayBufferToBase64(hashedEmail),
        password: arrayBufferToBase64(hashedPassword),
        salt: arrayBufferToBase64(salt),
        verificationCode: code,
        verificationExpiresAt: Date.now() + VERIFICATION_CODE_TTL_MS,
        verificationAttempts: 0,
        hasSignedUp: true,
        hasVerified: false,
        activeLogin: true,
      });

      modalSignup.classList.remove("is-active");
      await checkSignedUp();
      handleGreeting();
      return true;
    }

    // Verify Code function
    async function verifyCode(inputCode) {
      const data = await getStorage([
        "verificationCode",
        "verificationExpiresAt",
        "verificationAttempts",
      ]);
      const attempts = Number(data.verificationAttempts || 0);

      if (attempts >= MAX_VERIFICATION_ATTEMPTS) {
        alert("Too many attempts. Please sign up again to get a new code.");
        return;
      }

      if (!data.verificationCode || !data.verificationExpiresAt) {
        alert("No verification code found. Please sign up again.");
        return;
      }

      if (Date.now() > data.verificationExpiresAt) {
        alert("Verification code expired. Please sign up again.");
        return;
      }

      if (data.verificationCode === inputCode) {
        alert("Email verified successfully!");
        modalVerification.classList.remove("is-active");
        await setStorage({
          hasVerified: true,
          verificationCode: null,
          verificationExpiresAt: null,
          verificationAttempts: 0,
        });
        await checkSignedUp();
        handleGreeting();
      } else {
        await setStorage({ verificationAttempts: attempts + 1 });
        alert("Incorrect verification code. Please try again.");
      }
    }

    // Checks if the verify code button is clicked
    document
      .getElementById("verify-code-button")
      .addEventListener("click", function () {
        const inputCode = document
          .getElementById("verification-code")
          .value.trim();
        verifyCode(inputCode);
      });

    // Handles login feature
    async function loginUser(inputUsername, inputPassword) {
      if (!inputUsername || !inputPassword) {
        alert("Please enter both username and password.");
        return;
      }
      const result = await getStorage(["username", "password", "salt"]);
      if (!result.username || !result.password || !result.salt) {
        alert("No account found. Please sign up first.");
        return;
      }

      if (result.username === inputUsername) {
        const isValid = await verifyPassword(
          inputPassword,
          result.salt,
          result.password
        );
        if (isValid) {
          modalLogin.classList.remove("is-active");
          await setStorage({ activeLogin: true });
          await checkSignedUp();
          handleGreeting();
        } else {
          alert("Invalid password.");
        }
      } else {
        alert("Username not found.");
      }
    }

    // Verifies password for logging in
    async function verifyPassword(inputPassword, storedSalt, storedHash) {
      try {
        // Convert stored salt and hash from Base64
        const salt = base64ToArrayBuffer(storedSalt);
        const storedHashBuffer = base64ToArrayBuffer(storedHash);

        // Hash the input password with the same salt
        const inputHash = await hashData(inputPassword, salt);

        // Compare the input hash with the stored hash byte-by-byte
        return inputHash.every(
          (byte, i) => byte === new Uint8Array(storedHashBuffer)[i]
        );
      } catch (error) {
        console.error("Error verifying password:", error);
        return false;
      }
    }

    // Generates verification code
    function generateVerificationCode() {
      const randomValues = new Uint32Array(1);
      window.crypto.getRandomValues(randomValues);
      const code = (randomValues[0] % 900000) + 100000;
      return code.toString();
    }

    checkSignedUp();
    handleGreeting();

    // Checks if user adds image
    document
      .getElementById("fileInput")
      .addEventListener("change", async function (event) {
        const file = event.target.files[0]; // Gets first image the user selected

        if (!file) {
          // Checks if a file was uploaded
          return;
        }

        if (!file.type.startsWith("image/")) {
          alert("Please upload a valid image file.");
          return;
        }

        try {
          const imageBitmap = await createImageBitmap(file);
          scanBarcode(imageBitmap);
        } catch (error) {
          console.error("Error loading image:", error);
        }
      });

      
    // Mostly From https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector

    // Function to scan the barcode
    async function scanBarcode(imageSource) {
      setLoading(true, "Scanning barcode...");
      if (!("BarcodeDetector" in window)) {
        alert(
          "Barcode scanning is not supported in this browser. Please enter the barcode manually."
        );
        setLoading(false);
        return;
      }

      const detector = new BarcodeDetector({
        formats: ["code_39", "codabar", "ean_13", "ean_8", "upc_a", "upc_e"],
      });

      try {
        const imageBitmap =
          imageSource instanceof ImageBitmap
            ? imageSource
            : await createImageBitmap(await imgToBlob(imageSource));
        const barcodes = await detector.detect(imageBitmap);
        if (barcodes.length > 0) {
          fetchData(barcodes[0].rawValue);
        } else {
          alert(
            "No barcode was detected! Try entering the code manually, or take a screenshot and upload it."
          );
          setLoading(false);
        }
      } catch (error) {
        console.error("Error detecting barcode:", error);
        setLoading(false);
      }
    }

    // Parts from https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob

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
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Unable to read image data."));
              return;
            }
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
    // If on the settings page
    document
      .getElementById("backToMain")
      .addEventListener("click", function () {
        window.location.href = chrome.runtime.getURL("popup.html"); // Returns to main page if home button clicked
      });

    // Opens privacy policy
    document
      .getElementById("openPrivacyPolicy")
      .addEventListener("click", () => {
        chrome.tabs.create({
          url: chrome.runtime.getURL("docs/PRIVACY-POLICY.md"),
        });
      });

    // Checkbox variables
    const darkModeCheckbox = document.getElementById("darkModeCheckbox");
    const glutenFreeCheckbox = document.getElementById("glutenFreeCheckbox");
    const organicCheckbox = document.getElementById("organicCheckbox");
    const vegetarianCheckbox = document.getElementById("vegetarianCheckbox");
    const veganCheckbox = document.getElementById("veganCheckbox");

    // Allergy Input variables
    const allergyInput = document.getElementById("allergy-input");
    const addAllergyButton = document.getElementById("add-allergy");
    const allergyList = document.getElementById("allergy-list");
    const deleteAccountSettingsButton = document.getElementById(
      "delete-account-settings"
    );

    // Load stored allergies and display them
    chrome.storage.sync.get(["allergies"], function (result) {
      const allergies = result.allergies || [];
      allergies.forEach(function (allergy) {
        displayAllergy(allergy); // Runs the function to display each allergy
      });
    });

    // Add allergy to the list and store it in Chrome Sync
    addAllergyButton.addEventListener("click", function () {
      const allergy = allergyInput.value.trim(); // Removes blank space
      if (allergy) {
        // If there is something in the input
        chrome.storage.sync.get(["allergies"], function (result) {
          const allergies = result.allergies || [];
          allergies.push(allergy); // Adds allergy to list
          // Sets allergy to Chrome Sync and run display function
          chrome.storage.sync.set({ allergies: allergies }, function () {
            displayAllergy(allergy); 
          });
        });
        allergyInput.value = ""; // Puts input back to blank
      }
    });

    // Display allergy in the list with a remove button
    function displayAllergy(allergy) {
      const li = document.createElement("li"); // Creates list element
      li.classList.add(
        "is-flex",
        "is-align-items-center",
        "has-text-weight-bold",
        "has-text-white"
      ); // Adds styling to list item

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

        chrome.storage.sync.set({ allergies: allergies }, function () {
          // Updated list saved to storage.
          listItem.remove(); // Item is removed from the ui.
        });
      });
    }

    // Load the saved state of Dark Mode
    chrome.storage.sync.get("darkMode", (data) => {
      darkModeCheckbox.checked = data.darkMode || false; // Checks if it already exists in chrome storage.
      applyTheme(darkModeCheckbox.checked);
      updateIcon(darkModeCheckbox.checked); // Updates icon
    });

    // Load the saved state of Gluten Free
    chrome.storage.sync.get("glutenFree", (data) => {
      glutenFreeCheckbox.checked = data.glutenFree || false; // Checks if it already exists in chrome storage.
    });

    // Load the saved state of Organic
    chrome.storage.sync.get("organic", (data) => {
      organicCheckbox.checked = data.organic || false; // Checks if it already exists in chrome storage.
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
      applyTheme(isDarkMode);
      updateIcon(darkModeCheckbox.checked); // Calls the update Icon function
    });

    // Handle gluten free checkbox change
    glutenFreeCheckbox.addEventListener("change", () => {
      const isGlutenFree = glutenFreeCheckbox.checked; // Sets variable depending on if checkbox is ticked.
      chrome.storage.sync.set({ glutenFree: isGlutenFree }); // stores this setting in chrome storage.
    });

    // Handle organic checkbox change
    organicCheckbox.addEventListener("change", () => {
      const isOrganic = organicCheckbox.checked; // Sets variable depending on if checkbox is ticked.
      chrome.storage.sync.set({ organic: isOrganic }); // stores this setting in chrome storage.
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

    if (deleteAccountSettingsButton) {
      deleteAccountSettingsButton.addEventListener("click", async () => {
        const confirmDelete = confirm(
          "Delete your account and all stored data? This cannot be undone."
        );
        if (!confirmDelete) return;
        await clearAccount();
      });
    }

  }
});
