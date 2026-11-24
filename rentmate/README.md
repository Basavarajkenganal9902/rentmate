# RentMate – Peer-to-Peer Rental Platform 🤝

RentMate is a peer-to-peer rental web platform where users can rent out items such as cameras, power tools, bicycles, electronic equipment, and more.

## 🚀 Key Features Implemented

1. **List Items for Rent** (`ListItemPage.jsx`)
   - Interactive item creation form with photo URL preview and gallery management.
   - Pricing setup (price per day/week, minimum and maximum rental days).
   - Refundable security deposit setting.
   - Dynamic specifications key-value builder (Brand, condition, model, accessories).
   - Handover/pickup location, categories, and searchable tags.

2. **Search and Filter** (`BrowsePage.jsx`)
   - Instant real-time search across titles, descriptions, and tags.
   - Category filtering (Cameras, Tools, Bicycles, Electronics, Sports, Camping, Music).
   - Multi-facet filters: Min/Max price per day, minimum star rating, verified owners only, availability toggle.
   - Grid and List layout switcher.
   - Sort by Featured, Price (Low to High / High to Low), Rating, and Newest.

3. **Check Availability & Request Rental** (`ItemDetailPage.jsx`)
   - High-definition image carousel with active indicator.
   - Real-time availability indicator and date range selector.
   - Automatic duration calculation with instant pricing breakdown (Rental cost, 10% platform service fee, refundable security deposit escrow).
   - "Request Rental" interactive modal with note to owner, pre-authorization details, and submission workflow.

4. **Owner Approval Workflow** (`DashboardPage.jsx` - Tab: Owner Approvals)
   - Incoming rental requests inbox for owners.
   - View renter details, requested dates, renter notes, and projected payout.
   - One-click **Approve** or **Reject** actions that dynamically update request statuses across the application.

5. **Rental History** (`DashboardPage.jsx` - Tab: My Rental History)
   - Comprehensive history of all past, active, and pending rentals.
   - Filter by status: All, Active, Pending, Completed.
   - Rental item summary, dates, tracking ID, and payment breakdown.

6. **Return Tracking Hub** (`DashboardPage.jsx` - Tab: Return Tracking Hub)
   - Step-by-step progress tracking:
     1. Booked & Picked Up
     2. Return Scheduled
     3. Return Handover / In Transit
     4. Condition Verified & Inspected
     5. Completed & Security Deposit Released
   - Digital handover QR code simulation.
   - Status updates for return handovers and damage-free deposit release.

7. **User Profile & Trust Badges** (`UserProfilePage.jsx`)
   - Verified credentials: ID verification, email confirmation, Stripe escrow status.
   - Community reviews and star rating breakdown.
   - Renter reliability stats (on-time returns, zero damage claims).

---

## 🛠️ Tech Stack

- **React 18** (Modern functional components with custom Hooks)
- **Vite 6** (Blazing fast bundling & HMR)
- **Lucide React** (Clean, modern icon set)
- **Custom Modern CSS System** (Responsive flex/grid layout, smooth animations, toast notifications)

---

## 💻 Running the Application

To run the development server:

```bash
cd rentmate
npm run dev
```

Open your browser at `http://localhost:5173`.
