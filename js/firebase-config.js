// ============================================================
//  FIREBASE CONFIGURATION
//  Ube & Sand Halo-Halo Shop — Inventory System
//
//  HOW TO SET UP:
//  1. Go to https://console.firebase.google.com/
//  2. Create a new project (or use existing)
//  3. Add a Web App to the project
//  4. Copy your config values below
//  5. Enable Authentication → Email/Password
//  6. Enable Firestore Database
//  7. Create the first admin user under Authentication → Users
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyCczfqVC-9-4RJrcwz2jLvmhyJUl6QGpSA",
    authDomain: "halo-halo-inventory.firebaseapp.com",
    projectId: "halo-halo-inventory",
    storageBucket: "halo-halo-inventory.firebasestorage.app",
    messagingSenderId: "553413055984",
    appId: "1:553413055984:web:96e531fc488c9d9c643935",
    measurementId: "G-KYGD3X56YT"
  };

// ============================================================
//  FIRESTORE COLLECTIONS STRUCTURE
// ============================================================
//
//  /products/{productId}
//    - name: string
//    - category: string (categoryId)
//    - categoryName: string
//    - price: number
//    - stock: number
//    - lowStockThreshold: number (default: 10)
//    - description: string
//    - emoji: string
//    - createdAt: timestamp
//    - updatedAt: timestamp
//
//  /categories/{categoryId}
//    - name: string
//    - emoji: string
//    - description: string
//    - createdAt: timestamp
//
//  /inventory_logs/{logId}
//    - type: "stock_in" | "stock_out"
//    - productId: string
//    - productName: string
//    - quantity: number
//    - previousStock: number
//    - newStock: number
//    - notes: string
//    - createdAt: timestamp
//    - createdBy: string (uid)
//
//  /sales/{saleId}
//    - orderNumber: string
//    - items: array of { productId, productName, quantity, price, subtotal }
//    - totalAmount: number
//    - totalQuantity: number
//    - notes: string
//    - createdAt: timestamp
//    - createdBy: string (uid)
//
//  /users/{uid}
//    - displayName: string
//    - email: string
//    - role: "admin" | "staff"
//    - createdAt: timestamp
// ============================================================
