# NEXORA — 3D Animated Spatial E-Commerce Platform
## System Architecture & Technical Specification

### 1. Architectural Overview
NEXORA delivers a high-fidelity, spatial 3D e-commerce experience running WebGL at 60 FPS, paired with enterprise RESTful APIs, Microsoft SQL Server 2022 normalized persistence, and an interactive React Native / Expo mobile application.

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                         │
│  - React 19 + TypeScript + Tailwind CSS               │
│  - Three.js r187 PBR Engine (RoomEnvironment PMREM)   │
│  - Procedural Multi-Part 3D Models (3-12 parts)       │
│  - Camera-Based Augmented Reality (LiDAR Anchor)      │
│  - React Native / Expo Mobile App Simulator           │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (JWT Auth)
┌───────────────────────────▼────────────────────────────┐
│                   SERVICES & API LAYER                 │
│  - NexoraAPIService (Products, Cart, Orders, Coupons)  │
│  - Tokenized Payment Gateway Engine (Stripe/Razorpay)  │
│  - Admin Analytics & Real-Time Low-Stock Monitor       │
└───────────────────────────┬────────────────────────────┘
                            │ ACID Transactions & Locking
┌───────────────────────────▼────────────────────────────┐
│             MICROSOFT SQL SERVER 2022                  │
│  - 23 Normalized Relational Tables                     │
│  - Stored Procedures (e.g. sp_CreateOrderWithLock)     │
│  - Atomic Inventory Locking & Idempotent Audits        │
└────────────────────────────────────────────────────────┘
```

---

### 2. Microsoft SQL Server Normalized Tables (23 Entities)
1. `dbo.Users`: User accounts with sequential GUIDs, salted hashes, and profile metadata.
2. `dbo.Roles`: Role-based access control (SuperAdmin, Customer, Dispatcher).
3. `dbo.UserRoles`: Composite junction table for many-to-many role binding.
4. `dbo.UserAddresses`: Shipping and billing addresses with default priority indices.
5. `dbo.Categories`: Hierarchical catalog categories with URL slugs.
6. `dbo.Products`: Master product definitions with `DECIMAL(18,2)` pricing and 3D model links.
7. `dbo.ProductImages`: Multi-resolution product photography with display order.
8. `dbo.ProductVariants`: SKUs, finish names, hexadecimal colors, and price deltas.
9. `dbo.ProductCategories`: Product-to-category relational mapping.
10. `dbo.Inventory`: Atomic inventory units (`quantity_available`, `quantity_reserved`).
11. `dbo.Carts`: Guest and user shopping carts.
12. `dbo.CartItems`: Line items linked to variant SKUs.
13. `dbo.Wishlists`: 3D spatial bookmarks.
14. `dbo.WishlistItems`: Individual product references per wishlist.
15. `dbo.Orders`: ACID-compliant transactional order master record.
16. `dbo.OrderItems`: Persisted computed totals with variant specifications.
17. `dbo.Payments`: Secure tokenized gateway references (Stripe, Razorpay, UPI).
18. `dbo.Coupons`: Promotional engine rules, percentage/fixed discounts, and date validity.
19. `dbo.CouponUsage`: Idempotent per-user coupon redemption history.
20. `dbo.Reviews`: Customer ratings, verified purchase flags, and helpful vote counts.
21. `dbo.Shipments`: Carrier manifests, waybills, and dispatch statuses.
22. `dbo.Notifications`: Transactional push and order updates.
23. `dbo.AuditLogs`: Immutable system security and order audit trail.

---

### 3. Three.js PBR Rendering Pipeline
- **Studio Lighting**: Key directional light (warm 3.0 intensity with soft PCF shadows), cool rim light (1.8 intensity), and subtle hemisphere fill.
- **RoomEnvironment Reflection**: Baked zero-dependency procedural PMREM HDR map for realistic metalness reflections on brushed titanium, gold, and chrome.
- **Exploded View Disassembly**: Dynamic layer separation along local normal axes allowing customers to inspect acoustic planar drivers, skeleton tourbillons, and air-cell soles.
- **Augmented Reality Pass-Through**: Simulated camera feed with ground reticle locking and real-world 1:1 scaling.
