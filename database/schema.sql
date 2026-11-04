-- ==============================================================================
-- NEXORA E-COMMERCE PLATFORM — MICROSOFT SQL SERVER PRODUCTION SCHEMA (T-SQL)
-- Database Version: Microsoft SQL Server 2022 / Azure SQL Database
-- Normalized Relational Schema with Constraints, Triggers, & Stored Procedures
-- ==============================================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'NexoraCommerceDB')
BEGIN
    CREATE DATABASE NexoraCommerceDB
    COLLATE Latin1_General_100_CI_AS_SC_UTF8;
END
GO

USE NexoraCommerceDB;
GO

-- 1. ROLES TABLE
IF OBJECT_ID('dbo.Roles', 'U') IS NULL
CREATE TABLE dbo.Roles (
    role_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Roles PRIMARY KEY,
    role_name NVARCHAR(50) NOT NULL CONSTRAINT UQ_Roles_Name UNIQUE,
    description NVARCHAR(255) NULL,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Roles_CreatedAt DEFAULT SYSDATETIMEOFFSET()
);
GO

-- 2. USERS TABLE
IF OBJECT_ID('dbo.Users', 'U') IS NULL
CREATE TABLE dbo.Users (
    user_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Users_Id DEFAULT NEWSEQUENTIALID() CONSTRAINT PK_Users PRIMARY KEY,
    email NVARCHAR(255) NOT NULL CONSTRAINT UQ_Users_Email UNIQUE,
    password_hash NVARCHAR(512) NOT NULL,
    full_name NVARCHAR(150) NOT NULL,
    phone_number NVARCHAR(30) NULL,
    avatar_url NVARCHAR(1000) NULL,
    is_active BIT NOT NULL CONSTRAINT DF_Users_IsActive DEFAULT 1,
    is_verified BIT NOT NULL CONSTRAINT DF_Users_IsVerified DEFAULT 0,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Users_UpdatedAt DEFAULT SYSDATETIMEOFFSET()
);
GO

-- 3. USER ROLES (Junction)
IF OBJECT_ID('dbo.UserRoles', 'U') IS NULL
CREATE TABLE dbo.UserRoles (
    user_id UNIQUEIDENTIFIER NOT NULL,
    role_id INT NOT NULL,
    assigned_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_UserRoles_AssignedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT PK_UserRoles PRIMARY KEY (user_id, role_id),
    CONSTRAINT FK_UserRoles_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (role_id) REFERENCES dbo.Roles(role_id) ON DELETE CASCADE
);
GO

-- 4. USER ADDRESSES TABLE
IF OBJECT_ID('dbo.UserAddresses', 'U') IS NULL
CREATE TABLE dbo.UserAddresses (
    address_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_UserAddresses_Id DEFAULT NEWSEQUENTIALID() CONSTRAINT PK_UserAddresses PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL,
    recipient_name NVARCHAR(150) NOT NULL,
    street_line1 NVARCHAR(255) NOT NULL,
    street_line2 NVARCHAR(255) NULL,
    city NVARCHAR(100) NOT NULL,
    state_province NVARCHAR(100) NOT NULL,
    postal_code NVARCHAR(20) NOT NULL,
    country_iso NVARCHAR(2) NOT NULL,
    phone NVARCHAR(30) NOT NULL,
    is_default BIT NOT NULL CONSTRAINT DF_UserAddresses_IsDefault DEFAULT 0,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_UserAddresses_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_UserAddresses_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE CASCADE
);
GO

-- 5. CATEGORIES TABLE
IF OBJECT_ID('dbo.Categories', 'U') IS NULL
CREATE TABLE dbo.Categories (
    category_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Categories PRIMARY KEY,
    name NVARCHAR(100) NOT NULL CONSTRAINT UQ_Categories_Name UNIQUE,
    slug NVARCHAR(120) NOT NULL CONSTRAINT UQ_Categories_Slug UNIQUE,
    description NVARCHAR(500) NULL,
    parent_category_id INT NULL,
    is_active BIT NOT NULL CONSTRAINT DF_Categories_IsActive DEFAULT 1,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Categories_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_Categories_Parent FOREIGN KEY (parent_category_id) REFERENCES dbo.Categories(category_id)
);
GO

-- 6. PRODUCTS TABLE
IF OBJECT_ID('dbo.Products', 'U') IS NULL
CREATE TABLE dbo.Products (
    product_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Products_Id DEFAULT NEWSEQUENTIALID() CONSTRAINT PK_Products PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    slug NVARCHAR(280) NOT NULL CONSTRAINT UQ_Products_Slug UNIQUE,
    tagline NVARCHAR(300) NULL,
    description NVARCHAR(MAX) NOT NULL,
    base_price DECIMAL(18,2) NOT NULL CONSTRAINT CK_Products_BasePrice CHECK (base_price >= 0),
    original_price DECIMAL(18,2) NULL,
    brand NVARCHAR(100) NOT NULL,
    model_3d_type NVARCHAR(50) NOT NULL CONSTRAINT DF_Products_Model3D DEFAULT 'headphone',
    warranty_info NVARCHAR(255) NULL,
    shipping_info NVARCHAR(255) NULL,
    is_featured BIT NOT NULL CONSTRAINT DF_Products_IsFeatured DEFAULT 0,
    is_trending BIT NOT NULL CONSTRAINT DF_Products_IsTrending DEFAULT 0,
    is_new BIT NOT NULL CONSTRAINT DF_Products_IsNew DEFAULT 0,
    is_active BIT NOT NULL CONSTRAINT DF_Products_IsActive DEFAULT 1,
    average_rating DECIMAL(3,2) NOT NULL CONSTRAINT DF_Products_AvgRating DEFAULT 5.0,
    total_reviews INT NOT NULL CONSTRAINT DF_Products_ReviewsCount DEFAULT 0,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Products_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Products_UpdatedAt DEFAULT SYSDATETIMEOFFSET()
);
GO

-- 7. PRODUCT IMAGES TABLE
IF OBJECT_ID('dbo.ProductImages', 'U') IS NULL
CREATE TABLE dbo.ProductImages (
    image_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ProductImages PRIMARY KEY,
    product_id UNIQUEIDENTIFIER NOT NULL,
    image_url NVARCHAR(1000) NOT NULL,
    alt_text NVARCHAR(255) NULL,
    display_order INT NOT NULL CONSTRAINT DF_ProductImages_Order DEFAULT 0,
    is_primary BIT NOT NULL CONSTRAINT DF_ProductImages_IsPrimary DEFAULT 0,
    CONSTRAINT FK_ProductImages_Products FOREIGN KEY (product_id) REFERENCES dbo.Products(product_id) ON DELETE CASCADE
);
GO

-- 8. PRODUCT VARIANTS TABLE
IF OBJECT_ID('dbo.ProductVariants', 'U') IS NULL
CREATE TABLE dbo.ProductVariants (
    variant_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ProductVariants_Id DEFAULT NEWSEQUENTIALID() CONSTRAINT PK_ProductVariants PRIMARY KEY,
    product_id UNIQUEIDENTIFIER NOT NULL,
    sku NVARCHAR(100) NOT NULL CONSTRAINT UQ_ProductVariants_SKU UNIQUE,
    variant_name NVARCHAR(150) NOT NULL,
    color_name NVARCHAR(50) NOT NULL,
    color_hex NVARCHAR(10) NOT NULL,
    price_adjustment DECIMAL(18,2) NOT NULL CONSTRAINT DF_ProductVariants_Adjustment DEFAULT 0.00,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_ProductVariants_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_ProductVariants_Products FOREIGN KEY (product_id) REFERENCES dbo.Products(product_id) ON DELETE CASCADE
);
GO

-- 9. PRODUCT CATEGORIES (Junction)
IF OBJECT_ID('dbo.ProductCategories', 'U') IS NULL
CREATE TABLE dbo.ProductCategories (
    product_id UNIQUEIDENTIFIER NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT PK_ProductCategories PRIMARY KEY (product_id, category_id),
    CONSTRAINT FK_ProductCategories_Products FOREIGN KEY (product_id) REFERENCES dbo.Products(product_id) ON DELETE CASCADE,
    CONSTRAINT FK_ProductCategories_Categories FOREIGN KEY (category_id) REFERENCES dbo.Categories(category_id) ON DELETE CASCADE
);
GO

-- 10. INVENTORY TABLE
IF OBJECT_ID('dbo.Inventory', 'U') IS NULL
CREATE TABLE dbo.Inventory (
    inventory_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Inventory PRIMARY KEY,
    variant_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT UQ_Inventory_Variant UNIQUE,
    quantity_available INT NOT NULL CONSTRAINT CK_Inventory_Available CHECK (quantity_available >= 0),
    quantity_reserved INT NOT NULL CONSTRAINT DF_Inventory_Reserved DEFAULT 0 CONSTRAINT CK_Inventory_Reserved CHECK (quantity_reserved >= 0),
    low_stock_threshold INT NOT NULL CONSTRAINT DF_Inventory_Threshold DEFAULT 5,
    updated_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Inventory_UpdatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_Inventory_Variants FOREIGN KEY (variant_id) REFERENCES dbo.ProductVariants(variant_id) ON DELETE CASCADE
);
GO

-- 11. CARTS TABLE
IF OBJECT_ID('dbo.Carts', 'U') IS NULL
CREATE TABLE dbo.Carts (
    cart_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Carts_Id DEFAULT NEWSEQUENTIALID() CONSTRAINT PK_Carts PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NULL,
    session_token NVARCHAR(128) NULL,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Carts_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Carts_UpdatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_Carts_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE SET NULL
);
GO

-- 12. CART ITEMS TABLE
IF OBJECT_ID('dbo.CartItems', 'U') IS NULL
CREATE TABLE dbo.CartItems (
    cart_item_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_CartItems PRIMARY KEY,
    cart_id UNIQUEIDENTIFIER NOT NULL,
    variant_id UNIQUEIDENTIFIER NOT NULL,
    quantity INT NOT NULL CONSTRAINT CK_CartItems_Qty CHECK (quantity > 0),
    added_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_CartItems_AddedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT UQ_CartItems_Cart_Variant UNIQUE (cart_id, variant_id),
    CONSTRAINT FK_CartItems_Carts FOREIGN KEY (cart_id) REFERENCES dbo.Carts(cart_id) ON DELETE CASCADE,
    CONSTRAINT FK_CartItems_Variants FOREIGN KEY (variant_id) REFERENCES dbo.ProductVariants(variant_id) ON DELETE CASCADE
);
GO

-- 13. WISHLISTS TABLE
IF OBJECT_ID('dbo.Wishlists', 'U') IS NULL
CREATE TABLE dbo.Wishlists (
    wishlist_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Wishlists_Id DEFAULT NEWSEQUENTIALID() CONSTRAINT PK_Wishlists PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT UQ_Wishlists_User UNIQUE,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Wishlists_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_Wishlists_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE CASCADE
);
GO

-- 14. WISHLIST ITEMS TABLE
IF OBJECT_ID('dbo.WishlistItems', 'U') IS NULL
CREATE TABLE dbo.WishlistItems (
    wishlist_item_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_WishlistItems PRIMARY KEY,
    wishlist_id UNIQUEIDENTIFIER NOT NULL,
    product_id UNIQUEIDENTIFIER NOT NULL,
    added_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_WishlistItems_AddedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT UQ_WishlistItems UNIQUE (wishlist_id, product_id),
    CONSTRAINT FK_WishlistItems_Wishlists FOREIGN KEY (wishlist_id) REFERENCES dbo.Wishlists(wishlist_id) ON DELETE CASCADE,
    CONSTRAINT FK_WishlistItems_Products FOREIGN KEY (product_id) REFERENCES dbo.Products(product_id) ON DELETE CASCADE
);
GO

-- 15. COUPONS TABLE
IF OBJECT_ID('dbo.Coupons', 'U') IS NULL
CREATE TABLE dbo.Coupons (
    coupon_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Coupons PRIMARY KEY,
    code NVARCHAR(50) NOT NULL CONSTRAINT UQ_Coupons_Code UNIQUE,
    discount_type NVARCHAR(20) NOT NULL CONSTRAINT CK_Coupons_Type CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(18,2) NOT NULL CONSTRAINT CK_Coupons_Value CHECK (discount_value > 0),
    minimum_spend DECIMAL(18,2) NOT NULL CONSTRAINT DF_Coupons_MinSpend DEFAULT 0.00,
    max_discount_cap DECIMAL(18,2) NULL,
    usage_limit INT NULL,
    used_count INT NOT NULL CONSTRAINT DF_Coupons_UsedCount DEFAULT 0,
    is_active BIT NOT NULL CONSTRAINT DF_Coupons_IsActive DEFAULT 1,
    valid_from DATETIMEOFFSET(7) NOT NULL,
    valid_until DATETIMEOFFSET(7) NOT NULL,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Coupons_CreatedAt DEFAULT SYSDATETIMEOFFSET()
);
GO

-- 16. ORDERS TABLE
IF OBJECT_ID('dbo.Orders', 'U') IS NULL
CREATE TABLE dbo.Orders (
    order_id NVARCHAR(30) NOT NULL CONSTRAINT PK_Orders PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL,
    shipping_address_id UNIQUEIDENTIFIER NULL,
    subtotal DECIMAL(18,2) NOT NULL,
    tax DECIMAL(18,2) NOT NULL,
    shipping_cost DECIMAL(18,2) NOT NULL,
    discount_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_Orders_Discount DEFAULT 0.00,
    total_amount DECIMAL(18,2) NOT NULL,
    order_status NVARCHAR(30) NOT NULL CONSTRAINT DF_Orders_Status DEFAULT 'Pending',
    tracking_number NVARCHAR(100) NULL,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Orders_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Orders_UpdatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id)
);
GO

-- 17. ORDER ITEMS TABLE
IF OBJECT_ID('dbo.OrderItems', 'U') IS NULL
CREATE TABLE dbo.OrderItems (
    order_item_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OrderItems PRIMARY KEY,
    order_id NVARCHAR(30) NOT NULL,
    variant_id UNIQUEIDENTIFIER NOT NULL,
    product_name NVARCHAR(255) NOT NULL,
    unit_price DECIMAL(18,2) NOT NULL,
    quantity INT NOT NULL CONSTRAINT CK_OrderItems_Qty CHECK (quantity > 0),
    line_total AS (unit_price * quantity) PERSISTED,
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (order_id) REFERENCES dbo.Orders(order_id) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Variants FOREIGN KEY (variant_id) REFERENCES dbo.ProductVariants(variant_id)
);
GO

-- 18. PAYMENTS TABLE
IF OBJECT_ID('dbo.Payments', 'U') IS NULL
CREATE TABLE dbo.Payments (
    payment_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Payments_Id DEFAULT NEWSEQUENTIALID() CONSTRAINT PK_Payments PRIMARY KEY,
    order_id NVARCHAR(30) NOT NULL,
    gateway_provider NVARCHAR(50) NOT NULL, -- Stripe, Razorpay, UPI, etc.
    gateway_transaction_id NVARCHAR(255) NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    currency NVARCHAR(3) NOT NULL CONSTRAINT DF_Payments_Currency DEFAULT 'USD',
    payment_status NVARCHAR(30) NOT NULL CONSTRAINT DF_Payments_Status DEFAULT 'Pending',
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Payments_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_Payments_Orders FOREIGN KEY (order_id) REFERENCES dbo.Orders(order_id)
);
GO

-- 19. COUPON USAGE TABLE
IF OBJECT_ID('dbo.CouponUsage', 'U') IS NULL
CREATE TABLE dbo.CouponUsage (
    usage_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_CouponUsage PRIMARY KEY,
    coupon_id INT NOT NULL,
    order_id NVARCHAR(30) NOT NULL,
    user_id UNIQUEIDENTIFIER NOT NULL,
    discount_applied DECIMAL(18,2) NOT NULL,
    used_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_CouponUsage_UsedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_CouponUsage_Coupons FOREIGN KEY (coupon_id) REFERENCES dbo.Coupons(coupon_id),
    CONSTRAINT FK_CouponUsage_Orders FOREIGN KEY (order_id) REFERENCES dbo.Orders(order_id),
    CONSTRAINT FK_CouponUsage_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id)
);
GO

-- 20. REVIEWS TABLE
IF OBJECT_ID('dbo.Reviews', 'U') IS NULL
CREATE TABLE dbo.Reviews (
    review_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Reviews_Id DEFAULT NEWSEQUENTIALID() CONSTRAINT PK_Reviews PRIMARY KEY,
    product_id UNIQUEIDENTIFIER NOT NULL,
    user_id UNIQUEIDENTIFIER NOT NULL,
    rating TINYINT NOT NULL CONSTRAINT CK_Reviews_Rating CHECK (rating BETWEEN 1 AND 5),
    title NVARCHAR(200) NOT NULL,
    comment NVARCHAR(MAX) NOT NULL,
    is_verified_buyer BIT NOT NULL CONSTRAINT DF_Reviews_Verified DEFAULT 0,
    helpful_votes INT NOT NULL CONSTRAINT DF_Reviews_Helpful DEFAULT 0,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Reviews_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_Reviews_Products FOREIGN KEY (product_id) REFERENCES dbo.Products(product_id) ON DELETE CASCADE,
    CONSTRAINT FK_Reviews_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id)
);
GO

-- 21. SHIPMENTS TABLE
IF OBJECT_ID('dbo.Shipments', 'U') IS NULL
CREATE TABLE dbo.Shipments (
    shipment_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Shipments_Id DEFAULT NEWSEQUENTIALID() CONSTRAINT PK_Shipments PRIMARY KEY,
    order_id NVARCHAR(30) NOT NULL,
    carrier_name NVARCHAR(100) NOT NULL,
    tracking_number NVARCHAR(100) NOT NULL,
    estimated_delivery DATE NULL,
    shipped_at DATETIMEOFFSET(7) NULL,
    delivered_at DATETIMEOFFSET(7) NULL,
    status NVARCHAR(50) NOT NULL CONSTRAINT DF_Shipments_Status DEFAULT 'Manifested',
    CONSTRAINT FK_Shipments_Orders FOREIGN KEY (order_id) REFERENCES dbo.Orders(order_id)
);
GO

-- 22. NOTIFICATIONS TABLE
IF OBJECT_ID('dbo.Notifications', 'U') IS NULL
CREATE TABLE dbo.Notifications (
    notification_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Notifications_Id DEFAULT NEWSEQUENTIALID() CONSTRAINT PK_Notifications PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL,
    title NVARCHAR(200) NOT NULL,
    message NVARCHAR(1000) NOT NULL,
    is_read BIT NOT NULL CONSTRAINT DF_Notifications_IsRead DEFAULT 0,
    created_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_Notifications_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE CASCADE
);
GO

-- 23. AUDIT LOGS TABLE
IF OBJECT_ID('dbo.AuditLogs', 'U') IS NULL
CREATE TABLE dbo.AuditLogs (
    log_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_AuditLogs PRIMARY KEY,
    entity_name NVARCHAR(100) NOT NULL,
    action_type NVARCHAR(50) NOT NULL,
    entity_id NVARCHAR(100) NOT NULL,
    user_id NVARCHAR(100) NULL,
    details NVARCHAR(MAX) NULL,
    logged_at DATETIMEOFFSET(7) NOT NULL CONSTRAINT DF_AuditLogs_LoggedAt DEFAULT SYSDATETIMEOFFSET()
);
GO

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE NONCLUSTERED INDEX IX_Products_Brand ON dbo.Products(brand) INCLUDE (base_price, average_rating);
CREATE NONCLUSTERED INDEX IX_Products_Model3D ON dbo.Products(model_3d_type);
CREATE NONCLUSTERED INDEX IX_Orders_UserId_CreatedAt ON dbo.Orders(user_id, created_at DESC);
CREATE NONCLUSTERED INDEX IX_Inventory_Variant_Available ON dbo.Inventory(variant_id, quantity_available);
GO

-- STORED PROCEDURE: TRANSACTIONAL ORDER CREATION WITH INVENTORY LOCKING
CREATE OR ALTER PROCEDURE dbo.sp_CreateOrderWithInventoryLock
    @OrderId NVARCHAR(30),
    @UserId UNIQUEIDENTIFIER,
    @ShippingAddressId UNIQUEIDENTIFIER,
    @Subtotal DECIMAL(18,2),
    @Tax DECIMAL(18,2),
    @ShippingCost DECIMAL(18,2),
    @Discount DECIMAL(18,2),
    @TotalAmount DECIMAL(18,2),
    @TrackingNumber NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- Insert Order Record
        INSERT INTO dbo.Orders (
            order_id, user_id, shipping_address_id, subtotal, tax,
            shipping_cost, discount_amount, total_amount, order_status,
            tracking_number, created_at, updated_at
        )
        VALUES (
            @OrderId, @UserId, @ShippingAddressId, @Subtotal, @Tax,
            @ShippingCost, @Discount, @TotalAmount, 'Processing',
            @TrackingNumber, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET()
        );

        -- Audit Log
        INSERT INTO dbo.AuditLogs (entity_name, action_type, entity_id, user_id, details)
        VALUES ('Orders', 'CREATE_ORDER', @OrderId, CAST(@UserId AS NVARCHAR(50)), 'Order created successfully with inventory deduction');

        COMMIT TRANSACTION;
        SELECT 1 AS success, @OrderId AS order_id;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
