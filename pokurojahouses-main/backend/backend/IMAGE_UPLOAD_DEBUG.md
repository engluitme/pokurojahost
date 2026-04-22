# Image Upload Debugging Guide

## Issue: Image Upload Failing

The image upload functionality in `addproperty.html` has been enhanced with detailed logging to help identify the exact failure point.

## How to Debug

### Step 1: Open Developer Tools
1. In `addproperty.html`, press **F12** to open Developer Tools
2. Go to the **Console** tab
3. Keep this visible while testing uploads

### Step 2: Select an Image File

When you select an image from the file picker, you should see console logs like:

```
[File Input] Slot 2 selected: photo.jpg, size: 524288, type: image/jpeg
[File Input] Slot 2 - local preview loaded
[File Input] Slot 2 - calling handleSlotChange...
[handleSlotChange] Slot 2: starting upload for photo.jpg
[uploadImage] Starting upload for slot 2, file: photo.jpg, size: 524288 bytes
```

### Step 3: Check Upload Response

After selecting the image, you should see:

**SUCCESS:**
```
[uploadImage] Upload response status: 200
[uploadImage] Upload successful, URL: /uploads/image-1709600000000-123456789.jpg
[handleSlotChange] Slot 2: upload completed successfully, URL: /uploads/image-1709600000000-123456789.jpg
[handleSlotChange] Slot 2: imageUrls updated, total images: 1
```

**FAILURE:**
```
[uploadImage] Upload response status: 401
Error uploading image: Error: Upload failed: Unauthorized
Failed to upload image 2: Upload failed: Unauthorized
```

## Common Error Messages and Solutions

### Error: "Upload failed: Unauthorized" (Status 401)

**Cause:** Authentication token is missing or invalid

**Check:**
1. Verify you're logged in
2. Open Console → check if there's an "Auth verification successful" message on page load
3. Check localStorage: Open DevTools → Application → LocalStorage → look for `token` key
4. If no token, you need to login first

**Solution:**
- Go back to login page (`login.html`)
- Login again with: admin@pokuroja.com / admin123
- Then return to Add Property page

### Error: "Upload failed: Only image files are allowed" (Status 400)

**Cause:** File type is not an image

**Check:**
1. Verify you selected an actual image file (JPG, PNG, GIF, WebP)
2. Check the console log shows: `type: image/jpeg` or `type: image/png` etc.

**Solution:**
- Select a valid image file
- Supported formats: JPG, JPEG, PNG, GIF, WebP

### Error: "Upload failed: HTTP 413"

**Cause:** File is too large (limit is 10MB)

**Check:**
1. Check console shows: `size: [NUMBER] bytes`
2. Calculate if larger than 10,485,760 bytes (10MB)

**Solution:**
- Compress the image to under 10MB
- Use tools like ImageOptimizer or online compressors

### Error: "Upload failed: HTTP 500"

**Cause:** Server error

**Check:**
1. Open the terminal where Node.js is running
2. Look for error messages containing `[/api/upload]`

**Solution:**
- Check that `/backend/uploads` directory exists
- Verify Node.js server has write permissions
- Restart the backend server

### Error: "No message" or Network Error

**Cause:** Backend server not responding

**Check:**
1. Can you access `http://localhost:5000` in browser?
2. Does backend terminal show it's running on port 5000?

**Solution:**
```powershell
# Check if server is running
netstat -ano | findstr :5000

# If not running, restart it:
cd backend
npm start
```

## Backend Logs

While you're uploading, watch the Node.js terminal for messages like:

```
[/api/upload] incoming request headers: {
  authorization: '[present]',
  'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary...'
}
[/api/upload] uploaded file saved as image-1709600000000-123456789.jpg
```

**If you see auth error:**
```
[/api/upload] incoming request headers: {
  authorization: '[missing]',
  ...
}
```
This means the token isn't being sent from frontend.

## Full Upload Flow

Here's what should happen:

```
1. User selects image file
   ↓ (Console shows: "[File Input] Slot X selected")
   
2. Local preview shown immediately
   ↓ (Console shows: "[File Input] Slot X - local preview loaded")
   
3. File sent to backend via POST /api/upload
   ↓ (Console shows: "[uploadImage] Starting upload for slot X")
   
4. Backend receives, validates, and saves file
   ↓ (Terminal shows: "[/api/upload] uploaded file saved as image-...")
   
5. Backend responds with file URL
   ↓ (Console shows: "[uploadImage] Upload response status: 200")
   
6. Frontend updates the form with image URL
   ↓ (Console shows: "[handleSlotChange] upload completed successfully")
   
7. Preview updated with real uploaded image
   ↓ (Image appears in the preview box)
```

## Testing Checklist

- [ ] Can login successfully
- [ ] After login, token visible in localStorage
- [ ] Can navigate to Add Property page
- [ ] Auth verification message shows in console
- [ ] Can select image file (browser file picker works)
- [ ] Local preview appears immediately
- [ ] "[uploadImage] Starting upload..." appears in console
- [ ] Backend logs show upload request received
- [ ] "[uploadImage] Upload response status: 200" appears
- [ ] Image preview updates with uploaded image
- [ ] Toast shows "Image X uploaded successfully!"
- [ ] Can add multiple images (up to 6 slots)
- [ ] Form can be submitted with images

## Advanced Debugging

### Check Network Tab
1. Open DevTools → Network tab
2. Select an image
3. Look for POST request to `localhost:5000/api/upload`
4. Click on it and check:
   - **Status:** Should be 200
   - **Headers → Request Headers:** Should have `Authorization: Bearer <token>`
   - **Response:** Should show `{"url":"/uploads/image-..."}`

### Check Upload Directory
```powershell
# See uploaded files
Get-ChildItem "C:\Users\eng lui\Desktop\PokuRoja Houses\backend\uploads" -Recurse

# Check permissions
icacls "C:\Users\eng lui\Desktop\PokuRoja Houses\backend\uploads"
```

### Restart Backend to Clear Issues
```powershell
# Stop the server (Ctrl+C in Node terminal)
# Then restart:
cd "C:\Users\eng lui\Desktop\PokuRoja Houses\backend"
npm start
```

## Quick Test

1. Open test page: `http://localhost:5000/admin/test-integration.html`
2. Run all 5 tests to verify backend is working
3. Then try uploading image in `addproperty.html`

If tests pass but upload still fails, the issue is specific to the upload route or the form's use of it.
