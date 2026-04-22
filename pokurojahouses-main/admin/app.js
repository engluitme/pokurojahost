// Dynamically set API base URL based on current domain
const API_BASE = window.location.origin + '/api';

// 🔥 ALWAYS GET FRESH TOKEN
function getToken() {
  return localStorage.getItem('token');
}

let currentEditingId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (getToken()) {
    verifyToken();
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const propertyForm = document.getElementById('propertyForm');
  if (propertyForm) propertyForm.addEventListener('submit', handlePropertySubmit);

  const propertyImage = document.getElementById('propertyImage');
  if (propertyImage) propertyImage.addEventListener('change', handleImageUpload);

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  const searchProperties = document.getElementById('searchProperties');
  if (searchProperties) searchProperties.addEventListener('input', filterProperties);

  const filterStatus = document.getElementById('filterStatus');
  if (filterStatus) filterStatus.addEventListener('change', filterProperties);
});

// ================= AUTH =================

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error('Invalid credentials');

    const data = await response.json();

    localStorage.setItem('token', data.token);

    window.location.href = 'Dashboard.html';

  } catch (error) {
    document.getElementById('loginError').textContent = error.message;
    document.getElementById('loginError').style.display = 'block';
  }
}

async function verifyToken() {
  try {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    if (!response.ok) throw new Error('Token invalid');

    const data = await response.json();
    document.getElementById('userEmail').textContent = data.user.email;

  } catch (error) {
    handleLogout();
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// ================= IMAGE UPLOAD (FIXED) =================

async function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const token = getToken();

  if (!token) {
    alert('Please login first');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    console.log('Uploading image...');
    console.log('Token:', token);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log('Upload status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    // ✅ SET IMAGE
    document.getElementById('propertyImageUrl').value = data.url;
    document.getElementById('previewImg').src = data.url;
    document.getElementById('previewImg').style.display = 'block';
    document.getElementById('uploadStatus').textContent = '✅ Image uploaded!';

    console.log('Image URL:', data.url);

  } catch (error) {
    console.error('Upload error:', error);
    document.getElementById('uploadStatus').textContent =
      '❌ Upload failed: ' + error.message;
  }
}

// ================= PROPERTY SUBMIT =================

async function handlePropertySubmit(e) {
  e.preventDefault();

  const propertyData = {
    title: document.getElementById('propertyTitle').value,
    price: parseFloat(document.getElementById('propertyPrice').value),
    address: document.getElementById('propertyAddress').value,
    status: document.getElementById('propertyStatus').value,
    bedrooms: document.getElementById('propertyBedrooms').value ? parseInt(document.getElementById('propertyBedrooms').value) : null,
    bathrooms: document.getElementById('propertyBathrooms').value ? parseInt(document.getElementById('propertyBathrooms').value) : null,
    area: document.getElementById('propertyArea').value ? parseInt(document.getElementById('propertyArea').value) : null,
    description: document.getElementById('propertyDescription').value,
    image_url: document.getElementById('propertyImageUrl').value
  };

  try {
    const method = currentEditingId ? 'PUT' : 'POST';
    const url = currentEditingId
      ? `${API_BASE}/properties/${currentEditingId}`
      : `${API_BASE}/properties`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(propertyData)
    });

    if (!response.ok) throw new Error('Error saving property');

    alert('✅ Property saved successfully!');

  } catch (error) {
    document.getElementById('formError').textContent = error.message;
    document.getElementById('formError').classList.add('show');
  }
}

// ================= DELETE =================

async function deleteProperty(id) {
  if (!confirm('Are you sure?')) return;

  try {
    const response = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) throw new Error('Delete failed');

    alert('Deleted!');
    loadProperties();

  } catch (error) {
    alert(error.message);
  }
}
