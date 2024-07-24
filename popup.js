const manualEntryButton = document.querySelector('#manualEntryButton');
const modalBackground = document.querySelector('.modal-background');
const modal = document.querySelector('.modal');
const submitBarcode = document.getElementById("submitBarcode");

document.addEventListener('DOMContentLoaded', () => {
    const openPreferencesButton = document.getElementById('openPreferences');
    const backToMainButton = document.getElementById('backToMain');
    const mainContent = document.getElementById('mainContent');
    const preferencesContent = document.getElementById('preferencesContent');

    openPreferencesButton.addEventListener('click', () => {
        mainContent.style.display = 'none';
        preferencesContent.style.display = 'block';
    });

    backToMainButton.addEventListener('click', () => {
        preferencesContent.style.display = 'none';
        mainContent.style.display = 'block';
    });
});

manualEntryButton.addEventListener('click', () => {
    modal.classList.add('is-active');
})
   
modalBackground.addEventListener('click', () => {
    modal.classList.remove('is-active');
})

submitBarcode.addEventListener('click', () => {
    var barcodeEntry = document.getElementById("barcodeEntry");
    var barcodeNumber = barcodeEntry.value;
    console.log(barcodeNumber);
    fetchData(barcodeNumber)
})

async function fetchData(barcode) {
    try {
        const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        const data = await response.json();
        console.log(data);

        if (data.status === 1) {
            const productName = data.product.product_name;
            const productBrand = data.product.brands;
            const productIngredients = data.product.ingredients_text;

            console.log(`Product Name: ${productName}`);
            console.log(`Brand: ${productBrand}`);
            console.log(`Ingredients: ${productIngredients}`);
        } else {
            console.log("Product not found");
        }
    } catch (error) {
        console.error("There was a problem with your fetch request: ", error);
    }
}
  
  
   