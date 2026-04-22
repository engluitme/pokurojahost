// Shared sample data for admin pages (in-memory demo)
window.properties = [
  {
    id: 1,
    title: "Luxury Villa Serenity",
    price: 450000,
    address: "123 Beachfront Ave, Malibu, CA",
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    status: "available",
    image: null,
    description: "Beautiful beachfront villa with panoramic ocean views"
  },
  {
    id: 2,
    title: "Downtown Apartment",
    price: 280000,
    address: "456 Main St, New York, NY",
    bedrooms: 2,
    bathrooms: 2,
    area: 900,
    status: "sold",
    image: null,
    description: "Modern apartment in the heart of downtown"
  },
  {
    id: 3,
    title: "Beachfront Cottage",
    price: 320000,
    address: "789 Ocean Drive, Miami, FL",
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    status: "available",
    image: null,
    description: "Cozy cottage steps away from the beach"
  }
];

// Simple helper to find a property by id
window.findPropertyById = function(id) {
  return window.properties.find(p => String(p.id) === String(id));
};
