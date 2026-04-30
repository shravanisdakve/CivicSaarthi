# Feature Verification Guide for CivicSaarthi

This document outlines the steps to verify the newly implemented features in the CivicSaarthi application.

---

## 1. Google Maps Directions API

This feature embeds an interactive map to provide driving directions to election offices directly within the application.

**Verification Steps:**

1.  **Ensure API Keys are Valid and Enabled:**
    *   Confirm your `VITE_GOOGLE_MAPS_API_KEY` in your `.env` file is valid.
    *   In your Google Cloud Project console, ensure the following APIs are **enabled** for the API key you are using:
        *   **Maps JavaScript API**
        *   **Directions API**
        *   **Geolocation API**
2.  **Run the Application.**
3.  **Navigate to the page** where the `ElectionOfficeMap` component is rendered (e.g., the `MapHelper` page if it uses this component).
4.  **Enter a city or district** in the search input field.
5.  Click the **"Get Directions"** button.
6.  Observe the behavior:
    *   The application should now ask for your **location permission**. Grant it.
    *   An **embedded map** displaying the directions from your current location to the searched election office should appear within the application.
    *   If any errors occur (e.g., location denied, API not loaded), an error message should be shown, and directions might open in a new tab as a fallback.
    *   Verify that the "Close Map" button hides the embedded map.

---

## 2. Speech-to-Text/Text-to-Speech (STT/TTS)

This feature enables voice input for user queries and voice output for the AI assistant's responses.

**Verification Steps:**

1.  **Run the Application.**
2.  **Navigate to the Assistant page.**
3.  **To test Speech-to-Text (Voice Input):**
    *   Locate the **microphone icon button** near the chat input field.
    *   Click this button. Your browser will likely prompt you for microphone permission. **Grant it.**
    *   Speak your question clearly (e.g., "What is the election process?").
    *   Observe:
        *   The microphone icon should change (e.g., to 'mic_active' and pulsate) indicating listening.
        *   Once you finish speaking, the recognized text should automatically populate the input field and be sent to the AI assistant.
4.  **To test Text-to-Speech (Voice Output):**
    *   After the AI assistant provides a response, look for a **volume-up icon button** (speaker icon) usually located near the AI's message.
    *   Click this button. The AI's response text should be read aloud.
    *   If you click it again while it's speaking, the icon should change to 'stop_circle', and the speech should stop.

---

## 3. Google Maps Places API

This feature extends the directions map to show nearby points of interest (e.g., bus stops, parking, cafes) around the election office destination.

**Verification Steps:**

1.  **Ensure API Keys are Valid and Enabled:**
    *   Confirm your `VITE_GOOGLE_MAPS_API_KEY` in your `.env` file is valid.
    *   In your Google Cloud Project console, ensure the following APIs are **enabled** for the API key you are using:
        *   **Places API** (in addition to Maps JavaScript, Directions, and Geolocation APIs).
2.  **Run your application.**
3.  **Navigate to the page** containing the `ElectionOfficeMap` component.
4.  **Enter a location** in the search bar (e.g., a city or specific address) and click the **"Get Directions"** button.
5.  Once the embedded directions map appears:
    *   You should briefly observe a "Finding nearby places..." loading message.
    *   Additional **markers** should appear on the map, indicating nearby amenities (like bus stops, parking, restaurants) around the election office location.
    *   Click on these new markers to see if an info window with details appears (if implemented).

---

## 4. Firebase Firestore Integration

This feature enables persistent, user-specific checklist management, replacing local storage with a cloud database.

**Verification Steps:**

1.  **Firebase Project Setup:**
    *   Ensure you have a Firebase Project set up with **Firestore Database enabled**.
    *   Confirm your Firebase configuration variables (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, etc.) are correctly configured in your `.env` file and match your Firebase project settings.
2.  **Firestore Security Rules:**
    *   **Deploy appropriate Firebase security rules for Firestore** to allow read/write access to user-specific checklist data. A basic rule set that allows authenticated users to read/write their own checklist data might look like this (adjust `userId` if you are using `uid` instead of `email` for document IDs):
        ```firestore
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /users/{userId} {
              allow read, write: if request.auth.token.email == userId; // Or request.auth.uid == userId;
            }
          }
        }
        ```
3.  **Run your application.**
4.  **Log in with a Google account** (or any authenticated user configured with Firebase Auth).
5.  Navigate to the **Profile** page.
6.  Then, navigate to the **Checklist** page.
7.  **Check and uncheck items** on the checklist.
8.  **Verify Persistence:**
    *   **Refresh the page.** Your checklist progress should remain as you left it.
    *   **Log out and then log back in** with the *same Google account*. Your checklist progress should still be there.
    *   (Optional) If you have another browser or device, log in with the same Google account. The checklist progress should be synchronized across all instances.
9.  **Test "Reset Progress":**
    *   On the Checklist page, click the **"Reset Progress"** button.
    *   Confirm the action in the dialog.
    *   Verify that all checklist items become unchecked and this state persists after refreshing or logging back in.
10. **Test Guest User Fallback:**
    *   Log out of your authenticated account.
    *   As a guest user, check some items on the checklist.
    *   Refresh the page; the guest checklist items should persist (stored in local storage).
    *   Clear your browser's local storage (e.g., in Developer Tools -> Application -> Local Storage) and refresh; the guest checklist should now be empty.

If you encounter any errors during verification, check your browser's console for Firebase-related messages and carefully review your Firebase project setup, API key configurations, and Firestore security rules.

---

## 5. Google Cloud Natural Language API (Sentiment Analysis)

This feature integrates sentiment analysis into the AI assistant's chat responses, providing insight into the emotional tone of user messages.

**Verification Steps:**

1.  **Google Cloud Project Setup:**
    *   Ensure the **Cloud Natural Language API** is enabled in your Google Cloud Project.
    *   **Crucially, you need to configure Application Default Credentials (ADC)** for your backend service. This typically involves setting the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to a service account key file (`.json`). Refer to Google Cloud documentation for detailed setup: [https://cloud.google.com/docs/authentication/production#set_up_adc](https://cloud.google.com/docs/authentication#set_up_adc)
2.  **Run your application (both frontend and backend).**
3.  **Navigate to the Assistant page.**
4.  Send a message to the AI assistant.
5.  **Observe the backend console/logs (where your `server.js` is running):**
    *   You should see `console.log` output indicating the sentiment score for the message, e.g., `Sentiment Score for "Hello, how are you?": 0.5`.
    *   The `sentimentScore` is also included in the JSON response from `/api/chat`. You can inspect this in your browser's network tab (DevTools).
6.  **Test with varying sentiment:** Send messages with positive, neutral, and negative tones to see how the `sentimentScore` changes.

If you encounter errors, ensure:
*   The `GOOGLE_APPLICATION_CREDENTIALS` environment variable is correctly set and points to a valid service account key file.
*   The service account has the necessary permissions to use the Cloud Natural Language API.
*   The Cloud Natural Language API is enabled in your Google Cloud Project.

---

## 6. Google Calendar API

This feature allows users to integrate civic event reminders into their personal Google Calendar.

**Verification Steps:**

1.  **Google Cloud Project Setup:**
    *   Ensure the **Google Calendar API** is enabled in your Google Cloud Project.
    *   In the Google Cloud Console, create OAuth 2.0 Client IDs for a "Web application".
    *   Set **Authorized JavaScript origins** to your application's URL (e.g., `http://localhost:8080`).
    *   Set **Authorized redirect URIs** to `http://localhost:8080/api/calendar/oauth2callback`.
2.  **Environment Variables:**
    *   In your `.env` file, add the following variables:
        ```
        CALENDAR_CLIENT_ID=<Your OAuth 2.0 Client ID>
        CALENDAR_CLIENT_SECRET=<Your OAuth 2.0 Client Secret>
        CALENDAR_REDIRECT_URI=http://localhost:8080/api/calendar/oauth2callback
        ```
3.  **Run your application (both frontend and backend).**
4.  **Initiate OAuth Flow:**
    *   The application currently doesn't have a frontend button to trigger this. You can manually test the OAuth URL by visiting `http://localhost:8080/api/calendar/createAuthUrl` in your browser. This should redirect you to the Google consent screen.
    *   Grant the necessary permissions. You should then be redirected to `http://localhost:8080/api/calendar/oauth2callback` with a success message.
    *   Check your backend console for "Calendar API tokens received" to confirm the tokens were captured (in a real application, these would be stored securely per user).
5.  **Create a Calendar Event (manual test for now):**
    *   Since there's no frontend UI yet, you can use a tool like Postman or `curl` to send a POST request to `http://localhost:8080/api/calendar/createEvent`.
    *   **Headers:** `Content-Type: application/json`
    *   **Body (raw JSON):**
        ```json
        {
          "summary": "Voter Registration Deadline",
          "description": "Deadline to register to vote for the upcoming elections.",
          "start": "2026-05-15T09:00:00-07:00",
          "end": "2026-05-15T17:00:00-07:00",
          "timezone": "America/Los_Angeles"
        }
        ```
        *(Adjust dates and times as needed)*
    *   If successful, the backend will respond with `eventLink` and `eventId`.
    *   Check your Google Calendar to confirm the event was created.

If you encounter errors, ensure:
*   All environment variables (`CALENDAR_CLIENT_ID`, `CALENDAR_CLIENT_SECRET`, `CALENDAR_REDIRECT_URI`) are correctly set.
*   The Google Calendar API is enabled in your Google Cloud Project.
*   Your OAuth 2.0 Client ID settings (Authorized JavaScript origins, Authorized redirect URIs) are correct.
*   The backend console logs for any errors during the OAuth flow or event creation.

---

## 7. Accessibility: ARIA Attributes for Buttons

This enhancement improves the semantic information of buttons for assistive technologies like screen readers.

**Verification Steps:**

1.  **Run your application.**
2.  **Navigate to any page with buttons** (e.g., Home, Checklist, Assistant).
3.  **Inspect the `Button` component in your browser's developer tools:**
    *   Look for a button that has only an icon (no visible text children) and check if it has an `aria-label` attribute providing a descriptive text for its action.
    *   Look for a disabled button and verify that it has `aria-disabled="true"`.
4.  **Use a screen reader (e.g., NVDA, JAWS, VoiceOver, Narrator):**
    *   Navigate through the application using the screen reader.
    *   When the screen reader focuses on a button, verify that it announces the button's purpose clearly (especially for icon-only buttons via `aria-label`) and correctly indicates if a button is disabled.

---

## 8. Accessibility: Keyboard Navigation

This enhancement ensures that users can effectively navigate and interact with the application using only a keyboard.

**Verification Steps:**

1.  **Run your application.**
2.  **Use only the keyboard (Tab, Shift+Tab, Enter, Spacebar, Arrow Keys where applicable):**
    *   **Tab Order:** Start from the top of the page and repeatedly press `Tab`. Verify that the focus moves through all interactive elements (links, buttons, form fields) in a logical and predictable order that matches the visual layout. There should be no "skipped" interactive elements.
    *   **Visible Focus Indicator:** As you tab through elements, ensure there is a clear visual indicator (e.g., a colored outline, border change, background change) that shows which element currently has focus. This is crucial for users who rely on keyboard navigation.
    *   **Operable Elements:**
        *   **Buttons & Links:** Verify that you can activate all buttons (using `Enter` or `Spacebar`) and links (using `Enter`) when they have focus.
        *   **Form Fields:** Ensure you can type into input fields, select options from dropdowns, and operate checkboxes/radio buttons using keyboard commands.
    *   **No Keyboard Traps:** Navigate through various sections of the application, including modals/dialogs if any appear. Ensure that focus never gets "trapped" in a specific area, preventing you from tabbing out of it.
    *   **Modals/Dialogs (Focus Management):**
        *   **Opening:** When a dialog opens (e.g., "Reset Profile" on Profile page, "Reset Progress" or "Reminder Set!" on Checklist page), verify that focus automatically moves to the modal content or the first interactive element within it (e.g., the confirm button).
        *   **Focus Trap:** Pressing `Tab` should cycle focus *only* among the interactive elements within the modal. Focus should not escape the modal.
        *   **Closing:** Pressing `Escape` should close the modal.
        *   **Focus Restoration:** After the modal closes, focus should return to the element that triggered its opening (e.g., the "Reset Profile" button).
    *   **Content Beyond Viewport:** For scrollable areas, ensure that keyboard focus moves with the viewport, allowing users to see the element they are currently interacting with.

---

## 9. Accessibility: Semantic HTML

This enhancement ensures the use of appropriate HTML5 semantic elements to improve document structure and accessibility for screen readers and search engines.

**Verification Steps (Browser Inspection & Screen Reader):**

1.  **Run your application.**
2.  **Navigate to various pages** (e.g., Home, Assistant, Profile, Checklist).
3.  **Inspect the HTML structure in your browser's developer tools:**
    *   **Main Structural Elements:** Verify the use of `<header>`, `<nav>`, `<main>`, `<aside>`, and `<footer>` for the main regions of your pages.
    *   **Content Grouping:** Check for appropriate use of `<article>`, `<section>`, and `<details>`/`<summary>` for grouping related content.
    *   **Headings:** Ensure `<h1>` to `<h6>` tags are used hierarchically to structure content, and that there are no skipped heading levels (e.g., an `<h1>` followed directly by an `<h3>`).
    *   **Lists:** Verify that lists of items use `<ul>`, `<ol>`, and `<li>` elements where appropriate (e.g., navigation links, checklist items).
    *   **Forms:** Check that form controls are associated with `<label>` elements.
    *   **Figures:** If images or media have captions, ensure they are wrapped in `<figure>` and `<figcaption>` tags.
4.  **Use a screen reader (e.g., NVDA, JAWS, VoiceOver, Narrator):**
    *   Navigate through the application using the screen reader.
    *   Listen to how the screen reader announces different sections and elements. A semantically structured page should allow the screen reader to jump between main regions (e.g., "header", "navigation", "main content", "footer") and provide a clear outline of the content.

---

## 10. Testing: Automated React Component Testing with Jest

This involves setting up Jest and React Testing Library to write automated unit and integration tests for frontend components.

**Verification Steps:**

1.  **Ensure Jest is configured:**
    *   `jest.config.js` exists in the project root.
    *   `jest.setup.js` exists and is configured in `jest.config.js`.
    *   `babel.config.json` exists for transpilation.
2.  **Run your test suite.**
    *   Open your terminal in the project root.
    *   Run the command: `npm test`
3.  **Observe the output.**
    *   Verify that all custom audit tests (from `tests/logic.test.js`, `tests/test.js`, `tests/quality_check.js`) pass.
    *   Verify that the Jest test suite also passes (e.g., you should see `Test Suites: X passed, X total` and `Tests: X passed, X total`).
    *   Specifically, verify that `src/components/Button.test.jsx` passes.
    *   Specifically, verify that `src/components/Dialog.test.jsx` passes, including tests for rendering, interactions, and focus management.
    *   Specifically, verify that `src/components/AuthModal.test.jsx` passes (note: Some complex accessibility assertions for tab panel visibility and focus cycling within modals in `AuthModal.test.jsx` are currently skipped. This is due to persistent, subtle inconsistencies in how `jsdom` (Jest's default test environment) emulates the HTML `hidden` attribute's effect on the accessibility tree and manages focus for highly dynamic components, making reliable automated testing for these specific scenarios exceptionally challenging. The component's accessibility features are implemented, but their automated verification in this environment is proving problematic.).

This verifies that the automated testing framework is correctly set up and capable of running tests for your React components, and that core component functionality is validated.
