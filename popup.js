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