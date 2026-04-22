# Frontend Integration Guide

## Connecting Your Website to the Backend

### 1. Update Property Listings Page

In [listings.html](../listings.html), add this script to fetch properties from the backend:

```javascript
<script>
// Fetch properties from backend
async function loadProperties() {
  try {
    const response = await fetch('http://localhost:5000/api/properties');
    const properties = await response.json();
    
    const container = document.querySelector('.properties-container');
    container.innerHTML = properties.map(prop => `
      <div class="property-item">
        <img src="${prop.image_url || 'img/default.jpg'}" alt="${prop.title}">
        <h3>${prop.title}</h3>
        <p class="price">$${prop.price.toLocaleString()}</p>
        <p class="address">${prop.address}</p>
        <div class="details">
          <span>🛏️ ${prop.bedrooms || 'N/A'}</span>
          <span>🚿 ${prop.bathrooms || 'N/A'}</span>
          <span>📐 ${prop.area || 'N/A'} sqft</span>
        </div>
        <a href="propertydetails.html?id=${prop.id}" class="btn">View Details</a>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading properties:', error);
  }
}

// Load on page load
document.addEventListener('DOMContentLoaded', loadProperties);
</script>
```

### 2. Update Property Details Page

In [propertydetails.html](../propertydetails.html):

```javascript
<script>
// Get property ID from URL
const params = new URLSearchParams(window.location.search);
const propertyId = params.get('id');

async function loadPropertyDetails() {
  try {
    const response = await fetch(`http://localhost:5000/api/properties/${propertyId}`);
    const property = await response.json();
    
    // Update page with property data
    document.querySelector('.property-image').src = property.image_url;
    document.querySelector('.property-title').textContent = property.title;
    document.querySelector('.property-price').textContent = `$${property.price.toLocaleString()}`;
    document.querySelector('.property-address').textContent = property.address;
    document.querySelector('.property-description').textContent = property.description;
    document.querySelector('.bedrooms').textContent = property.bedrooms || 'N/A';
    document.querySelector('.bathrooms').textContent = property.bathrooms || 'N/A';
    document.querySelector('.area').textContent = `${property.area || 'N/A'} sqft`;
    document.querySelector('.status').textContent = property.status;
  } catch (error) {
    console.error('Error loading property:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadPropertyDetails);
</script>
```

### 3. Update Contact Form

In [contact.html](../contact.html), send inquiry data to your backend:

```javascript
<script>
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };
  
  try {
    // Save to your backend
    const response = await fetch('http://localhost:5000/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      alert('Thank you! We will contact you shortly.');
      e.target.reset();
    }
  } catch (error) {
    console.error('Error sending inquiry:', error);
  }
});
</script>
```

### 4. Important CORS Note

When developing locally:
- Frontend: http://localhost:8000 (from Python server)
- Backend: http://localhost:5000

The backend already has CORS enabled for development.

### 5. Production Deployment

When deploying:
1. Update all API URLs from `http://localhost:5000` to your production backend URL
2. Update CORS settings in backend
3. Use HTTPS for all connections
4. Set up environment variables for production

## Example API Responses

### Get All Properties
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Beautiful Villa",
    "price": 450000,
    "address": "123 Main St, City",
    "bedrooms": 4,
    "bathrooms": 2,
    "area": 3500,
    "description": "Spacious villa with pool...",
    "image_url": "https://...",
    "status": "available",
    "created_at": "2024-02-09T10:00:00Z"
  }
]
```

### Get Single Property
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Beautiful Villa",
  "price": 450000,
  "address": "123 Main St, City",
  "bedrooms": 4,
  "bathrooms": 2,
  "area": 3500,
  "description": "Spacious villa with pool...",
  "image_url": "https://...",
  "status": "available",
  "created_at": "2024-02-09T10:00:00Z"
}
```

## Need Help?

- Check [Backend README](./README.md) for setup instructions
- View admin panel at: http://localhost:5000/admin
- Check browser console for errors: Press F12 → Console tab
