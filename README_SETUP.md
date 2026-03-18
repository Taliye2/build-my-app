# Kafiskey: Universal Service Ops Platform

## Setup Instructions

### 1. Supabase Configuration

Kafiskey relies on Supabase for Auth, Database (PostgreSQL), and Storage.

#### A. Run Migrations
Run the provided SQL migrations in your Supabase SQL Editor.
*Note: Ensure all tables mention in the requirements are created.*

#### B. Storage Buckets
Create the following storage buckets in Supabase:
1. `client-documents` (Private)
2. `public-assets` (Public)

#### C. Edge Functions
Deploy the following edge functions from the `/functions` directory:
*   `confirm-invited-user`
*   `send-email`
*   `stripe-checkout`
*   `stripe-portal`
*   `stripe-webhook`
*   `get-health-stats`

### 2. Environment Variables

Create a `.env.local` file in the root with the following keys:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Blink SDK
VITE_BLINK_PROJECT_ID=your_blink_project_id
VITE_BLINK_PUBLISHABLE_KEY=your_blink_publishable_key

# Stripe (Public)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Config
VITE_APP_URL=http://localhost:5173
```

### 3. Stripe Setup

1. Create a Stripe account.
2. Create three subscription products/prices:
    *   **Community**: $0/mo (Free)
    *   **Growth**: $XX/mo
    *   **Scale**: $XXX/mo
3. Set up a Webhook in Stripe pointing to your `stripe-webhook` edge function URL.
4. Add the following secrets to your Supabase Edge Functions:
    *   `STRIPE_SECRET_KEY`
    *   `STRIPE_WEBHOOK_SECRET`
    *   `RESEND_API_KEY` (for invitations and emails)

### 4. Seed Data (Optional)

Run the `seed.sql` script in your Supabase SQL Editor to populate a sample workspace named "Beacon Community Services".

### 5. Running Locally

```bash
bun install
bun dev
```

### 6. Development Workflow

1. **Clients**: Add clients in the Clients module.
2. **Services**: Create Service Types (Hourly/Session/Program) and Templates.
3. **Delivery**: Staff creates Service Events.
4. **Documentation**: Staff documents events in the Record Editor and signs them.
5. **Billing**: Approved records generate billing items. Managers generate invoices.
6. **Compliance**: Track document expirations and review Audit Logs.
