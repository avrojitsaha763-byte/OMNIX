# OMNIX — Platform Operator & Client User Manual
## Complete Operational Playbook for Owners & Operators of the OMNIX Commerce OS

---

## Welcome to OMNIX
Thank you for purchasing **OMNIX**, the most advanced commerce operating ecosystem ever engineered. This manual provides a step-by-step operational guide to configure, launch, and manage your new platform.

---

## Module 1: System Onboarding & Dashboard Overview

### Accessing the Administrative Console
To configure backend systems, access the main administration panel:
1. Navigate to: `https://admin.yourdomain.com`
2. Authenticate using your security credentials.
3. Review the **Overview Dashboard** containing monthly sales, live logistics maps, active AI negotiations, and creator payouts.

---

## Module 2: Managing Catalogs & Sourcing

### 1. Consumer Products (E-Commerce)
- **Adding Items**: Go to `Catalog` -> `Products` -> `Add Product`. Specify title, pricing variables, brand tags, categories, and stock limits.
- **AI Recommendation Tuning**: In `Settings` -> `AI engine`, configure the match score threshold. Default recommendation filters align with users' search histories and visual tag selections.

### 2. B2B Sourcing & RFQs
- **Vetting Suppliers**: Navigate to `B2B Sourcing` -> `Verified Factories`. Click `Approve` on newly registered manufacturers once audit logs are verified.
- **RFQ Monitoring**: Review live bids submitted by factories on client RFQs. Administrators can cancel bids that violate target pricing boundaries.

---

## Module 3: Hyperlocal Logistics & Quick Commerce

### 1. Setting Up Dark Stores
1. Go to `Logistics` -> `Dark Stores` -> `New Store Node`.
2. Input target coordinates, local H3 grid cell indexing, and storage capacities.
3. Hook up IoT scales or RFID readers to sync physical stock metrics instantly with inventory databases.

### 2. Dispatching Fleet Couriers
- Couriers use the mobile application to receive orders.
- The **Dynamic Router** automatically groups local orders and paths couriers. You can override routes manually in the `Logistics Map Console`.

---

## Module 4: Social Commerce & Creator Hub

### 1. Tagging Reels & Media
- Creators upload video reels directly from the client application.
- To tag items, creators select a timestamp, choose a product from the database catalog, and place a visual shopping tag.
- Payments and commissions are processed automatically through secure escrows.

### 2. Managing Payouts
- Set standard affiliate commission default cuts in `Settings` -> `Commission Cuts`.
- The ledger updates creator metrics in real time. Pay out accumulated balances manually or configure monthly auto-wire options.

---

## Module 5: Configuring the AI Sourcing Engine

### 1. Negotiation Boundaries
You can govern how the **AI Negotiator** functions on your system:
- **Max Discount Allowed**: Specify the maximum percentage off list price the AI can offer a buyer (default is 15%).
- **Vendor Margins Protection**: The AI automatically checks vendor transaction histories to ensure negotiated prices remain above target margins.

### 2. Auto-Replenishment (Smart Pantry)
- Users toggle auto-reorder switches on grocery essentials.
- System agents check usage cycles and build checkout orders when predictions indicate items are low.

---

## Module 6: Theme Customization & Fintech Setup

### 1. Branding Assets
Update style variables inside `css/omnix-design-system.css`:
- **Main Colors**: Swap CSS color variables (`--violet`, `--cyan`, `--amber`) to match your organization's palette.
- **Logo Icon**: Replace the SVGs or emojis in the navigation headers of each HTML file.

### 2. Connecting Payment Systems
1. Go to `Fintech Panel` -> `Escrow Credentials`.
2. Link your payment providers (Stripe, Razorpay, or custom crypto vaults).
3. The platform automatically separates transaction payouts, shipping costs, commissions, and escrow splits.
