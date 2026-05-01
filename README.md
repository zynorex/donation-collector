# University Student Donation Portal

A full-stack web application for university students to browse and donate towards university events. Built with Next.js 14, Tailwind CSS, shadcn/ui, Prisma, NextAuth, and Razorpay.

## Features
- **Public**: Browse events, view details, progress bars, and donate via Razorpay.
- **Students**: Login/Signup, view donation history, earn badges.
- **Admin**: Create campaigns, view overall stats, manage events.
- **Payments**: Razorpay integration with webhooks for secure validation.
- **Media**: Cloudinary integration for banner image uploads.

## Prerequisites
- Node.js 18+
- PostgreSQL Database
- Razorpay Account
- Cloudinary Account

## Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/donation_portal?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-nextauth-key"

RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

*Note: For Cloudinary, you must create an "unsigned" upload preset named `unifund_preset` in your Cloudinary settings.*

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Seed Database**
   This will create categories and an initial admin user (`admin@university.edu` / `admin123`).
   ```bash
   npm run prisma db seed
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture
- `app/` - Next.js App Router (pages and API endpoints)
- `components/` - Reusable React components (shadcn/ui + custom)
- `lib/` - Prisma client, NextAuth configuration, Razorpay instance
- `prisma/` - Database schema and seed script
