document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('darkModeCheckbox');
  
    // Load the saved state
    chrome.storage.sync.get('darkMode', (data) => {
        checkbox.checked = data.darkMode || false;
        updateIcon(checkbox.checked);
    });
  
    // Handle checkbox change
    checkbox.addEventListener('change', () => {
        const isDarkMode = checkbox.checked;
        chrome.storage.sync.set({ darkMode: isDarkMode });
        updateIcon(isDarkMode);
    });
  
    // Function to update the extension icon
    function updateIcon(isDarkMode) {
        const iconPath = isDarkMode ? "images/icon-light.png" : "images/icon-dark.png";
        chrome.action.setIcon({ path: iconPath });
    }
  });