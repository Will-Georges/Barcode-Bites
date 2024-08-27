# Barcode Bites

Barcode Bites is a Chrome extension that scans food barcodes and alerts users if they have any allergies, or if it does not meet their preferences. The extension will also output other health information.

## Features

> [!NOTE]
> A list will be created towards the completion of the project.

## Notes

- This project utilises the OpenFoodFacts API.

## Tutorial

> [!NOTE]
> Tutorial will go here towards the completion of the project

> [!NOTE]
> The tutorial can also be found by clicking the profile icon, to reveal a dropdown menu.

## Versioning Convention

The version number of the extension is specified in the `manifest.json` file. The format used is "Major.Minor.Patch.Revised" (E.g. "1.0.1.0"). Each part of the version number has a specific purpose:

- **Major Version**: Increased when an API change or significant change is made.
- **Minor Version**: Increased when functionality is added, or a medium-scale change is made.
- **Patch Version**: Increased when bug fixes are made, or minor things updated.
- **Revised Version**: Increased when minor wording or detail changed.

### Reset Behavior

Whenever the number to the left increases, all numbers to its right reset to 0. For example:
- If `1.1.2.3` receives a **Minor** version upgrade, it becomes `1.2.0`.

It is assumed that all releases are **Revised Versions** of 0, unless otherwise specified.

## Browser Compatability

This extension only works with browsers that support Google Accounts Integration (GAIA). This includes browsers like Chrome and Brave, but does not support Arc browser.

## Changelog

<details>
<summary>1.0</summary>
    <br>
    <details>
    <summary>1.0.0 - (22/7/24 4:45pm)</summary>
    - Files and IDE Setup
    </details>
    <details>
    <summary>1.0.1 - (22/7/24 4:50pm)</summary>
    - Update Logo
    </details>
    <br>
</details>

<details>
<summary>1.1</summary>
    <br>
    <details>
    <summary>1.1.0 - (22/7/24 5:25pm)</summary>
    - Connected Project to Github
    </details>
    <details>
    <summary>1.1.1 - (22/7/24 5:35pm)</summary>
    - Set logo on GitHub repository
    </details>
    <details>
    <summary>1.1.2 - (22/7/24 5:45pm)</summary>
    - Update README
    <br>
    - Revert logo change on GitHub repository
    </details>
    <br>
</details>

<details>
<summary>1.2</summary>
    <br>
    <details>
    <summary>1.2.0 - (22/7/24 9:25pm)</summary>
    - Add Permission in manifest.json.
    <br>
    - Create a Preference page.
    <br>
    - Change icon from dark/light with toggle in preferences.
    </details>
    <details>
    <summary>1.2.1 - (22/7/24 9:50pm)</summary>
    - Fixed a bug that caused a scroll bar to appear when in preferences
    <br>
    - Moved inline CSS into separate styles.css file.
    </details>
    <details>
    <summary>1.2.2 - (22/7/24 10:00pm)</summary>
    - Reformatted the README to include "Note" sections
    </details>
    <details>
    <summary>1.2.2.1 - (22/7/24 10:10pm)</summary>
    - Altered [Versioning Convention](#versioning-convention) in README
    <br>
    - Changed email in Contact
    <br>
    - Added same page link in README
    </details>
    <details>
    <summary>1.2.2.2 - (23/7/24 8:45am)</summary>
    - Updated Changelog format.
    <br>
    - Add Reset Behaviour in README
    </details>
    <details>
    <summary>1.2.2.3 - (23/7/24 8:55am)</summary>
    - Added line breaks in version history.
    <br>
    - Updated Reset Behaviour in README
    </details>
    <details>
    <summary>1.2.2.4 - (23/7/24 9:00am)</summary>
    - Minor Wording Changes.
    </details>
    <details>
    <summary>1.2.2.5 - (23/7/24 9:20am)</summary>
    - Testing formatting changes.
    </details>
    <details>
    <summary>1.2.2.6 - (23/7/24 9:25am)</summary>
    - Fixed formatting bug
    </details>
    <details>
    <summary>1.2.2.7 - (23/7/24 9:30am)</summary>
    - Update Formatting
    </details>
    <details>
    <summary>1.2.2.8 - (23/7/24 9:40am)</summary>
    - Testing
    </details>
    <details>
    <summary>1.2.2.9 - (23/7/24 9:45am)</summary>
    - Further Testing
    </details>
    <details>
    <summary>1.2.2.10 - (23/7/24 9:46am)</summary>
    - Fixed Bug
    </details>
    <details>
    <summary>1.2.2.11 - (23/7/24 9:46am)</summary>
    - Testing
    </details>
    <details>
    <summary>1.2.2.12 - (23/7/24 9:50am)</summary>
    - Testing
    </details>
    <details>
    <summary>1.2.2.13 - (23/7/24 9:55am)</summary>
    - Testing
    </details>
    <details>
    <summary>1.2.2.14 - (23/7/24 10:00am)</summary>
    - README formatted.
    </details>
    <details>
    <summary>1.2.2.15 - (23/7/24 10:45am)</summary>
    - Further Testing of iframe.
    <br>
    - Moved Bulma link
    </details>
    <br>
</details>

<details>
<summary>1.3</summary>
    <br>
    <details>
    <summary>1.3.0 - (24/7/24 6:20pm)</summary>
    - Created Button for Modal with Input for Barcode Number to be entered in.
    <br>
    - Retrieve Barcode Number from input.
    </details>
    <details>
    <summary>1.3.0.1 - (24/7/24 6:25pm)</summary>
    - Fixed formatting error on README
    </details>
    <details>
    <summary>1.3.0.2 - (24/7/24 8:00pm)</summary>
    - Update Formatting
    </details>
    <br>
</details>

<details>
<summary>2.0</summary>
    <br>
    <details>
    <summary>2.0.0 - (25/7/24 9:50am)</summary>
    - Send request for product information to OpenFoodFacts API
    <br>
    - Retrieve data from API.
    </details>
    <details>
    <summary>2.0.1 - (25/7/24 10:30am)</summary>
    - Commented out code.
    <br>
    - Added more error detection in API requests.
    <br>
    - Added more debugging statements
    <br>
    - Updated icons
    </details>
    <details>
    <summary>2.0.2 - (26/7/24 10:20am)</summary>
    - Create Functions to load or remove HTML content.
    <br>
    - Created basic navbar code.
    <br>
    - Minor wording changes.
    </details>
    <details>
    <summary>2.0.3 - (26/7/24 10:25am)</summary>
    - Create folder for all additional HTML pages.
    </details>
    <details>
    <summary>2.0.4 - (26/7/24 10:30am)</summary>
    - Added basic footer code.
    </details>
    <details>
    <summary>2.0.4.1 - (26/7/24 10:35am)</summary>
    - Bug Fix
    </details>
    <br>
</details>

<details>
<summary>2.1</summary>
    <br>
    <details>
    <summary>2.1.0 - (29/7/24 1:50pm)</summary>
    - Create seperate output page that embeds in main page.
    <br>
    - Output data retrieved through API.
    </details>
    <details>
    <summary>2.1.1 - (29/7/24 2:40pm)</summary>
    - Updated footer
    <br>
    - Fixed header and footer to top and bottom of page.
    </details>
    <details>
    <summary>2.1.2 - (29/7/24 3:15pm)</summary>
    - Added css properties
    <br>
    - Created a header.
    <br>
    - Added another logo
    </details>
    <details>
    <summary>2.1.2.1 - (29/7/24 6:05pm)</summary>
    - Minor Formatting Changes.
    <br>
    - Testing translation tools
    </details>
    <details>
    <summary>2.1.3 - (30/7/24 9:50am)</summary>
    - Changed the color of the footer.
    <br>
    - Fixed an error where outputted data would be in another language.
    </details>
    <details>
    <summary>2.1.3.1 - (30/7/24 10:20am)</summary>
    - Added a Note output field to state if English is not available.
    </details>
    <details>
    <summary>2.1.3.2 - (30/7/24 10:25am)</summary>
    - Fixed a bug where navbar and footer would disappear when manual entry modal was opened.
    </details>
    <br>
</details>

<details>
<summary>2.2</summary>
    <br>
    <details>
    <summary>2.2.0 - (6/8/24 10:45am)</summary>
    - Created form for account creation
    <br>
    - Edited Navbar
    <br>
    - Added another image.
    <br>
    - Added more minor changes.
    </details>
    <details>
    <summary>2.2.1 - (7/8/24 1:45pm)</summary>
    - Saved details to local storage.
    </details>
    <details>
    <summary>2.2.2 - (7/8/24 2:05pm)</summary>
    - Create signup page
    </details>
    <details>
    <summary>2.2.3 - (11/8/24 5:00pm)</summary>
    - Code Restructure
    <br>
    - Fixed a bug with the modal
    <br>
    - Adjusted Permissions
    </details>
    <details>
    <summary>2.2.3.1 - (11/8/24 5:05pm)</summary>
    - Removed sign up page
    </details>
    <br>
</details>

<details>
<summary>2.3</summary>
    <br>
    <details>
    <summary>2.3.0 - (11/8/24 5:25pm)</summary>
    - Major Code Structure Rework
    </details>
    <details>
    <summary>2.3.1 - (11/8/24 5:35pm)</summary>
    - Added Navbar and Footer to preferences
    <br>
    - Fixed Styling bug for preferences
    <br>
    - Commented and Formatted Code
    </details>
    <details>
    <summary>2.3.2 - (11/8/24 6:10pm)</summary>
    - Fixed navbar item colouring
    <br>
    - Fixed column width to fit smaller size
    <br>
    - Use navbar settings button instead
    </details>
    <br>
</details>

<details>
<summary>3.0</summary>
    <br>
    <details>
    <summary>3.0.0 - (11/8/24 8:20pm)</summary>
    - Detect Barcode Number from an image Uploaded
    </details>
    <br>
</details>

<details>
<summary>3.1</summary>
    <br>
    <details>
    <summary>3.1.0 - (11/8/24 8:55pm)</summary>
    - Output data after barcode number is scanned from an image
    </details>
    <details>
    <summary>3.1.0.1 - (12/8/24 1:45pm)</summary>
    - Fixed modal sizing
    <br>
    - Moved image upload into section
    </details>
    <details>
    <summary>3.1.0.2 - (12/8/24 2:05pm)</summary>
    - Minor Changes
    </details>
    <br>
</details>

<details>
<summary>4.0</summary>
    <br>
    <details>
    <summary>4.0.0 - (12/8/24 8:45pm)</summary>
    - Automatic Scan implemented
    <br>
    - Styling improvements
    </details>
    <details>
    <summary>4.0.1 - (13/8/24 10:20am)</summary>
    - Moved signup button to navbar, and only accessible from main page.
    <br>
    - Improved file upload styling
    </details>
    <details>
    <summary>4.0.1.1 - (13/8/24 10:45am)</summary>
    - Added profile navbar-item
    <br>
    - Added class to hide or view signup/profile depending on the user's circumstances.
    </details>
    <details>
    <summary>4.0.2 - (14/8/24 1:55pm)</summary>
    - Greeting depending on time with username added
    </details>
    <details>
    <summary>4.1.0 - (15/8/24 10:15am)</summary>
    - Added Password Validity Tests.
    <br>
    - Alert user of invalid password or blank field.
    <br>
    - Added signup check on load.
    </details>
    <details>
    <summary>4.2.0 - (15/8/24 10:30am)</summary>
    - Added Email Validity Tests
    <br>
    - Styled Signup
    </details>
    <details>
    <summary>4.2.1 - (15/8/24 10:45am)</summary>
    - Only show preferences button if signed up
    <br>
    - Added home redirect in preferences page.
    <br>
    - Bug fixes and improvements
    </details>
    <details>
    <summary>4.2.2 - (19/8/24 5:40pm)</summary>
    - Added vegan and vegetarian selection option that saves to local storage.
    </details>
    <details>
    <summary>4.2.3 - (19/8/24 8:15pm)</summary>
    - Output now also includes the image
    <br>
    - README also includes compatability section
    </details>
    <details>
    <summary>4.2.3.1 - (19/8/24 8:25pm)</summary>
    - Minor Changes
    </details>
    <details>
    <summary>4.3.0 - (19/8/24 9:45pm)</summary>
    - Implemented Carousel
    <br>
    - Formatting Changes
    </details>
    <details>
    <summary>4.4.0 - (20/8/24 9:55am)</summary>
    - Fixed Height of Carousel
    <br>
    - Output information on carousel.
    <br>
    - Removed need for output page.
    </details>
    <details>
    <summary>4.4.1 - (20/8/24 10:25am)</summary>
    - Added carousel filler image for before an image is loaded
    <br>
    - Put product name on first carousel item with the image
    </details>
    <details>
    <summary>4.4.2 - (20/8/24 10:25am)</summary>
    - Vegan and Vegetarian checkboxes now use Chrome storage sync instead of local storage
    </details>
    <details>
    <summary>4.4.3 - (22/8/24 9:55am)</summary>
    - All items that previously used localStorage now use Chrome storage sync.
    </details>
    <details>
    <summary>4.4.4 - (22/8/24 10:20am)</summary>
    - Output checks if it is vegan/vegetarian safe
    <br>
    - Other changes to how the output functions
    </details>
    <details>
    <summary>4.4.4.1 - (22/8/24 10:25am)</summary>
    - Minor Changes to way vegetarian/vegan check works.
    </details>
    <details>
    <summary>4.4.5 - (22/8/24 10:45am)</summary>
    - Alerts user if the product is not vegetarian
    </details>
    <details>
    <summary>4.4.6 - (26/8/24 1:55pm)</summary>
    - Also alerts users if it is not vegan.
    </details>
    <details>
    <summary>4.4.7 - (26/8/24 9:15pm)</summary>
    - Displays the Nutritional Score on one of the Carousel Items.
    </details>
    <details>
    <summary>4.4.8 - (26/8/24 9:35pm)</summary>
    - Can add allergies to account and outputs in a list in settings page.
    </details>
    <details>
    <summary>4.4.9 - (26/8/24 10:20pm)</summary>
    - Detects if the product is allergy safe.
    </details>
    <details>
    <summary>4.4.9.1 - (27/8/24 9:35am)</summary>
    - Fixed bug where light/dark mode icon was permanently stuck on the dark icon.
    </details>
    <details>
    <summary>4.4.10 - (27/8/24 10:05am)</summary>
    - Added a tutorial modal that opens after signup.
    </details>
    <details>
    <summary>4.4.10.1 - (27/8/24 10:20am)</summary>
    - Added tutorial button in the navbar which is only available after signup
    </details>
    <details>
    <summary>4.4.11 - (27/8/24 10:35am)</summary>
    - Added a LICENSE.
    </details>
    <details>
    <summary>4.4.11.1 - (27/8/24 2:10pm)</summary>
    - Added link to GitHub.
    <br>
    - Commented out popup.html file
    </details>
    <details>
    <summary>4.4.11.2 - (27/8/24 2:10pm)</summary>
    - Commented out preferences.html file
    <br>
    - Fixed footer in preferences page.
    </details>
    <br>
</details>
<details>
<summary>4.5</summary>
    <br>
    <details>
    <summary>4.5.0 - (27/8/24 3:20pm)</summary>
    - Added Bulma locally instead of through web link.
    <br>
    - Commented out styles.css
    </details>
    <details>
    <summary>4.5.1 - (27/8/24 5:30pm)</summary>
    - Removed Profile item from navbar
    <br>
    - Commented out popup.js
    </details>
    <details>
    <summary>4.5.1.1 - (27/8/24 5:35pm)</summary>
    - Styling Changes
    </details>
    <br>
</details>

## Contact

For any questions or suggestions, please contact the developer, Will Georges @ 25GeorWL@cgs.vic.edu.au