-- ==============================================================================
-- NEXORA COMMERCE PLATFORM — SAMPLE SEED SCRIPT FOR MICROSOFT SQL SERVER
-- Populates initial roles, categories, products, inventory, coupons, and test user
-- ==============================================================================

USE NexoraCommerceDB;
GO

SET NOCOUNT ON;

-- 1. SEED ROLES
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE role_name = 'SuperAdmin')
    INSERT INTO dbo.Roles (role_name, description) VALUES 
    ('SuperAdmin', 'Unrestricted administrative access to all systems'),
    ('Customer', 'Standard registered customer account');
GO

-- 2. SEED CATEGORIES
IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE slug = 'electronics')
BEGIN
    INSERT INTO dbo.Categories (name, slug, description) VALUES
    (N'Electronics', 'electronics', N'Next-gen audio, computing and optics'),
    (N'Smartphones', 'smartphones', N'Titanium flagships and folding displays'),
    (N'Sneakers', 'sneakers', N'Pneumatic and kinetic high-rebound footwear'),
    (N'Watches', 'watches', N'Grade-5 titanium and openworked tourbillons'),
    (N'Gaming', 'gaming', N'Low-latency competitive esports hardware'),
    (N'Fashion', 'fashion', N'Cyberpunk tactical streetwear and techwear');
END
GO

-- 3. SEED COUPONS
IF NOT EXISTS (SELECT 1 FROM dbo.Coupons WHERE code = 'NEXORA20')
BEGIN
    INSERT INTO dbo.Coupons (code, discount_type, discount_value, minimum_spend, is_active, valid_from, valid_until)
    VALUES 
    (N'NEXORA20', 'percentage', 20.00, 100.00, 1, SYSDATETIMEOFFSET(), DATEADD(month, 6, SYSDATETIMEOFFSET())),
    (N'CYBER50', 'fixed', 50.00, 250.00, 1, SYSDATETIMEOFFSET(), DATEADD(month, 6, SYSDATETIMEOFFSET())),
    (N'FIRSTNEXORA', 'percentage', 15.00, 50.00, 1, SYSDATETIMEOFFSET(), DATEADD(month, 6, SYSDATETIMEOFFSET()));
END
GO
