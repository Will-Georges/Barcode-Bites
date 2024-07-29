document.addEventListener('DOMContentLoaded', () => { // Makes sure to load all files completely, to first check if a dark/light mode is already set.
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
});