# Image Disappearing After Upload - Debug Guide

## Issue Description
After selecting and uploading an image, the preview disappears immediately after the upload completes.

## Root Cause Analysis Checklist

### Step 1: Enable Console Logging
1. Open `http://localhost:5000/admin/addproperty.html` in browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Keep the browser window side-by-side with the form so you can see both

### Step 2: Select and Upload an Image

Watch the console for these logs in order:

```
[Config] API_BASE: http://localhost:5000/api
[Config] Token from localStorage: YES
[File Input] Slot 2 selected: photo.jpg, size: 524288, type: image/jpeg
[File Input] Slot 2 - local preview loaded
[File Input] Slot 2 - calling handleSlotChange...
[handleSlotChange] Slot 2: starting upload for photo.jpg
[uploadImage] Starting upload for slot 2...
[uploadImage] Upload response status: 200
[uploadImage] Upload successful, URL: /uploads/image-1709600000000.jpg
[handleSlotChange] Slot 2: upload completed successfully, URL: /uploads/image-1709600000000.jpg
[handleSlotChange] Slot 2: imageUrls[1] = /uploads/image-1709600000000.jpg
[handleSlotChange] Slot 2: propertyImageUrls field updated, total images: 1
[updatePreview] Slot 2: setting preview to /uploads/image-1709600000000.jpg
[handleSlotChange] Slot 2: preview updated with uploaded URL
[handleSlotChange] Slot 2: file input cleared
```

### Step 3: Find Where It Breaks

**If you see all logs but image still disappears:**
This means the HTML is being updated but something is visually clearing it.

Check:
1. Does the preview container have the correct HTML?
   - Right-click preview area → Inspect Element
   - Should show: `<img src="/uploads/image-...">`
   - If you see: `<span class="no-image">No image</span>` → Something is resetting it

2. Look for logs AFTER the "_updated with uploaded URL" log
   - Any `[updatePreview] Slot 2:` message?
   - Any error messages?
   - These would indicate the preview is being cleared AFTER it was set

**If logs stop before upload completes:**
Check the specific failed step from logs above

**If no logs appear at all:**
Check console for errors and verify:
- Backend is running: `netstat -ano | findstr :5000`
- You're logged in (token in localStorage)

### Step 4: Network Tab Analysis

1. Open DevTools → **Network** tab
2. Select an image
3. Look for the POST request to `/api/upload`
4. Check:
   - Status: Should be 200
   - Response: Should show `{"url":"/uploads/image-..."}`
   - Timing: Should complete quickly (< 2 seconds)

If upload is slow or fails, that's a different issue than "disappearing".

### Step 5: Element Inspector

While image is visible (right after upload):
1. Right-click the preview image
2. Click **Inspect** or **Inspect Element**
3. Note what the HTML shows:
   ```html
   <div id="preview2" class="preview-container">
     <img src="/uploads/image-1709600000000.jpg" alt="Property Image 2" style="...">
   </div>
   ```

Wait 2-3 seconds, then refresh the Inspector (F5 while inspector is open):
- Does the HTML still show `<img src="/uploads/...">`?
- Or did it change to `<span class="no-image">No image</span>`?

If it changed, something is actively clearing it.

## Potential Causes

### 1. Preview Container Is Too Small
**Symptom:** Image uploads but preview area looks empty
**Fix:** Check if preview-container CSS constrains the image
**Test:** Use browser inspector to check preview container size
```
Should be: width: 100px; height: 80px;
If not, adjust CSS in styles
```

### 2. Image URL Is Invalid
**Symptom:** Preview shows broken image icon
**Check:** In Network tab, try to access the image directly
```
http://localhost:5000/uploads/image-1709600000000.jpg
```
Should download the file without error

### 3. CORS Issue
**Symptom:** Image uploads but won't display due to CORS
**Check:** Network tab → find the image request → look for CORS-related errors
**Console:** Look for errors like "Access to image blocked by CORS policy"

### 4. Preview Being Reset by Another Function
**Symptom:** All logs show success but preview still disappears
**Check:** 
- Is there any other code in the page that touches preview containers?
- Are there any async operations that might be resetting things?
- Look for any page reload happening

**Debug:** Add this to console (F12):
```javascript
// Monitor preview container changes
const preview = document.getElementById('preview1');
const observer = new MutationObserver(mutations => {
    console.log('[OBSERVER] Preview1 changed:', mutations);
});
observer.observe(preview, { subtree: true, childList: true, innerHTMLl: true });
```

Then upload an image. If this logs mutations after the preview is set, something is changing it.

### 5. File Input Value Not Clearing Properly
**Symptom:** File input still has selection, preview shows local preview, then disappeared
**Check:** After upload, check if file input has a value
```javascript
// In console:
console.log(document.getElementById('propertyImage1').value);
// Should be empty after upload
```

## Quick Test

Run this in the browser console **after** a failed upload:

```javascript
// Check imageUrls array
console.log('imageUrls array:', imageUrls);

// Check preview HTML
for (let i = 1; i <= 6; i++) {
    const preview = document.getElementById(`preview${i}`);
    if (preview && preview.innerHTML.includes('img')) {
        console.log(`Slot ${i} has image:`, preview.innerHTML.substring(0, 100));
    }
}

// Check form field
console.log('propertyImageUrls value:', document.getElementById('propertyImageUrls').value);
```

This should show you the current state of the image storage.

## Solution Steps (Based on Root Cause)

**If preview HTML is being cleared:**
- Add CSS to force preview-container to stay visible
- Add check in code to prevent clearing

**If URL is invalid:**
- Check backend upload route is saving files correctly
- Verify `/uploads` directory exists and is accessible

**If another function is resetting:**
- Find and remove any conflicting code
- Ensure no form reset happening

## Report Format

When reporting the issue with logs, include:
1. Full console logs from selection to disappearance
2. What the Inspector shows for the preview element
3. Whether the propertyImageUrls form field has the URL in it
4. Any error messages in console
