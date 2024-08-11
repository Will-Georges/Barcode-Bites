# Barcode Bites

## Description

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
    - Send request for product informaiton to OpenFoodFacts API
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

## Contact

For any questions or suggestions, please contact the developer, Will Georges @ 25GeorWL@cgs.vic.edu.au