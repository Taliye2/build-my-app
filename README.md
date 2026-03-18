# Kafiskey Universal Service Ops

Kafiskey is the universal, compliance-friendly SaaS platform for organizations offering hourly, session, or program-based services. It provides configurable tools and technical safeguards designed to support robust documentation, audit-ready workflows, flexible workspaces, and enterprise operational clarity.

By offering a platform that supports compliance through administrative controls, Kafiskey enables organizations to streamline operations within a multi-tenant environment secured by RLS. Compliance remains a shared responsibility, with Kafiskey providing the tools and organizations serving as the Covered Entities responsible for configuration and oversight.

## Environment Variables

### Required for Email (Resend)

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Your Resend API key | `re_xxxxx` |
| `RESEND_FROM_EMAIL` | Sender email address (must use verified domain) | `invites@kafiskey.com` |
| `RESEND_FROM_NAME` | Sender display name | `Kafiskey` |

**Important**: All outgoing emails MUST use the `@kafiskey.com` domain. The `RESEND_FROM_EMAIL` environment variable must end with `@kafiskey.com` to work with the verified Resend domain.

### Testing Email Configuration

You can test the email configuration using the send-email function:

```bash
# Check current configuration
curl https://3r3oth6a--send-email.functions.blink.new

# Send a test email
curl "https://3r3oth6a--send-email.functions.blink.new?action=test&email=yourtest@gmail.com"
```

### Other Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `QUICKBOOKS_CLIENT_ID` | QuickBooks OAuth client ID |
| `QUICKBOOKS_CLIENT_SECRET` | QuickBooks OAuth client secret |

## Tech Stack

- Frontend: Vite + React + TypeScript + Tailwind CSS + shadcn/ui
- Database: Supabase (PostgreSQL)
- Payments: Stripe
- Email: Resend
- Accounting: QuickBooks Online integration
- Hosting: Blink

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Run development server: `npm run dev`

Created with [Blink](https://blink.new)
