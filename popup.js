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
})
   