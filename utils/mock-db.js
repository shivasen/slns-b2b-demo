import { faker } from '@faker-js/faker';

// --- DATA GENERATION ---

const USERS = [];
const PRODUCTS = [];
const ORDERS = [];
const SHIPPING_ADDRESSES = [];

const CATEGORIES = ['Sarees', 'Churidars', 'Half Sarees', 'Pavadai Davani', "Men's Dhotis", "Kids' Dhotis"];

// Create Users
const adminUser = {
  id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  email: 'admin@slns.in',
  password: 'password123',
  role: 'admin',
  approved: true,
  approved_at: faker.date.past(),
  full_name: 'Admin User',
  company_name: 'SLNS Admin',
  business_type: 'Wholesaler',
  gstin: '22ADMIN0000A1Z5',
  created_at: faker.date.past(),
  default_shipping_address: null,
};
USERS.push(adminUser);

const approvedUser = {
  id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
  email: 'user@slns.in',
  password: 'password123',
  role: 'user',
  approved: true,
  approved_at: faker.date.past(),
  full_name: 'Priya Sharma',
  company_name: 'Rani Boutique',
  business_type: 'Boutique',
  gstin: '22PRIYA0000A1Z5',
  created_at: faker.date.past(),
  default_shipping_address: null,
};
USERS.push(approvedUser);

const pendingUser = {
  id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
  email: 'pending@slns.in',
  password: 'password123',
  role: 'user',
  approved: false,
  approved_at: null,
  full_name: 'Ankit Desai',
  company_name: 'Ethnic Weaves',
  business_type: 'Retailer',
  gstin: '22ANKIT0000A1Z5',
  created_at: new Date().toISOString(),
  default_shipping_address: null,
};
USERS.push(pendingUser);

// Create Products
for (let i = 1; i <= 30; i++) {
  const category = faker.helpers.arrayElement(CATEGORIES);
  PRODUCTS.push({
    id: i,
    name: `${faker.commerce.productAdjective()} ${category.slice(0, -1)}`,
    category: category,
    image_url: `https://picsum.photos/seed/${i}/400/600`,
    price: parseFloat(faker.commerce.price({ min: 800, max: 5000 })),
    stock: faker.number.int({ min: 10, max: 500 }),
    moq: faker.helpers.arrayElement([5, 10, 15]),
    fabric: faker.commerce.productMaterial(),
    color: faker.color.human(),
    tags: faker.helpers.arrayElements(['new', 'bestseller', 'limited'], { min: 0, max: 2 }),
    created_at: faker.date.past(),
    order_items: [], // for compatibility with api.js logic
  });
}

// Create Shipping Addresses
USERS.forEach(user => {
  for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
    const address = {
      id: SHIPPING_ADDRESSES.length + 1,
      user_id: user.id,
      address_line_1: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      pincode: faker.location.zipCode(),
      created_at: faker.date.past(),
    };
    SHIPPING_ADDRESSES.push(address);
    if (!user.default_shipping_address) {
      user.default_shipping_address = address.id;
    }
  }
});
// Update user profiles with the full address object
USERS.forEach(user => {
    user.default_shipping_address = SHIPPING_ADDRESSES.find(a => a.id === user.default_shipping_address) || null;
});


// Create Orders
let orderIdCounter = 1000;
USERS.filter(u => u.approved).forEach(user => {
  for (let i = 0; i < faker.number.int({ min: 2, max: 10 }); i++) {
    const orderItems = [];
    let subtotal = 0;
    const numItems = faker.number.int({ min: 1, max: 5 });
    for (let j = 0; j < numItems; j++) {
      const product = faker.helpers.arrayElement(PRODUCTS);
      const quantity = product.moq * faker.number.int({ min: 1, max: 4 });
      subtotal += product.price * quantity;
      orderItems.push({
        order_id: orderIdCounter,
        product_id: product.id,
        quantity: quantity,
        price: product.price,
        products: product, // Simulate join
      });
    }
    
    const total_amount = subtotal * 1.18; // 18% GST
    
    ORDERS.push({
      id: orderIdCounter,
      user_id: user.id,
      profiles: user, // Simulate join
      created_at: faker.date.past(),
      total_amount: total_amount,
      status: faker.helpers.arrayElement(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
      shipping_address: faker.helpers.arrayElement(SHIPPING_ADDRESSES.filter(a => a.user_id === user.id)),
      order_items: orderItems,
    });
    orderIdCounter++;
  }
});

// --- MOCK API FUNCTIONS ---

export const db = {
  users: USERS,
  products: PRODUCTS,
  orders: ORDERS,
  shipping_addresses: SHIPPING_ADDRESSES,
};
