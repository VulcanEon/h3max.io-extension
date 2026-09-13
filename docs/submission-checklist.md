# Chrome Web Store Submission Checklist

## Package Contents

- `manifest.json`
- `service-worker.js`
- `popup.html`
- `popup.css`
- `popup.js`
- `assets/logo.png`
- `assets/favicon.ico`
- `assets/icons/icon-16.png`
- `assets/icons/icon-32.png`
- `assets/icons/icon-48.png`
- `assets/icons/icon-128.png`

Store screenshots and documentation should not be included in the upload ZIP.

## Single Purpose

H3 Max Video Prompt Studio helps users plan structured MiniMax H3 Max video prompts from reusable shot starters and explicit video controls.

## Permission Justifications

### storage

Used only to remember the user's latest selected starter, scene description, duration, resolution, camera movement, and synchronized-audio preference inside Chrome.

### sidePanel

Used to display the prompt studio in Chrome's side panel when the user clicks the toolbar icon.

## Remote Code

No. All HTML, CSS, and JavaScript are packaged with the extension.

## Data Use Answers

- Personally identifiable information: not collected
- Health information: not collected
- Financial and payment information: not collected
- Authentication information: not collected
- Personal communications: not collected
- Location: not collected
- Web history: not collected
- User activity: not collected
- Website content: not collected

## URLs

- Homepage: https://h3max.io
- Support: https://h3max.io/contact
- Privacy policy: https://h3max.io/privacy-policy
- Source repository: https://github.com/VulcanEon/h3max.io-extension

## Store Assets

- 1280 × 720 screenshot: `assets/store/popup-screenshot.png`
- 1280 × 720 screenshot with a completed prompt: `assets/store/popup-screenshot-filled.png`
- 440 × 280 small promotional tile: `assets/store/small-promo-440x280.png`

## Before Publishing

- verify the unpacked extension in the latest stable Chrome
- confirm both buttons and all controls work
- confirm there are no extension console errors
- ensure listing copy matches the current feature set
- ensure the public privacy policy URL is available
- upload the ZIP from `dist/h3max-video-prompt-studio-1.0.1.zip`
