# Alt Text Auditor

Scan the current tab and list every `<img>` missing useful `alt` text. Built for quick a11y triage.

# What it checks

- Flags `<img>` where `alt` is **missing** or **empty**.
- Skips decorative images that declare `role="presentation"` or `aria-hidden="true"`.
- Scans all frames on the page and aggregates results.
- Shows a thumbnail, a CSS path to the element, and intrinsic dimensions.

# Why it matters

`alt` enables screen readers, improves search, and documents intent. Empty `alt` is valid only for true decoration.

# Install (from source)

1. Download the repo or the zip of the extension folder.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the folder with `manifest.json`.

# Usage

1. Open any page.
2. Click the Alt Text Auditor icon.
3. Press **Scan**.
4. Review the list. Each card shows a thumbnail, the element path, and image size. If nothing is flagged you will see a single “No missing alt text found.” item.

> What counts as missing: Lists images where `alt` is missing or empty. Ignores images marked decorative with `role="presentation"` or `aria-hidden="true"`.

# Permissions

- `activeTab` — run on the current tab after you click the action.
- `scripting` — inject the scanner into the page and its iframes.
- `host_permissions: <all_urls>` — allow scanning across origins in iframes when permitted by Chrome.

# Limitations

- CSS background images are not scanned. Only `<img>` elements are checked.
- Some cross-origin iframes may not return results if Chrome blocks injection.
- Thumbnails use the image URL. Some servers block hotlinking. In that case the card still lists the element path and size.
- Shadow DOM images are only found if they are in open shadow roots.

# Development

- Manifest V3.
- Popup injects a content function with `chrome.scripting.executeScript({ allFrames: true })`.
- Element locator uses a short CSS path with `:nth-of-type` segments.
- Thumbnails use `referrerpolicy="no-referrer"` to reduce cross-site issues.

## Run locally

No build step. Edit `popup.html`, `popup.css`, and `popup.js`. Reload the extension in `chrome://extensions`.

# Package for the Chrome Web Store

1. Ensure version in `manifest.json` is updated.
2. Zip the folder contents (do not zip the parent folder).
3. Upload in the Developer Dashboard. Choose **Unlisted** if you do not want it public.
4. Fill out listing text and privacy details. Submit.

# Privacy

- No data is collected, stored, or sent off the device.
- All work happens in the browser on the current tab.

# License

MIT © R3HAB MEDIA Web Tools
