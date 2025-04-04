# Eleanor Beauty Salon 💄✨

Eleanor is a professional beauty salon website with integrated e-commerce capabilities, allowing customers to purchase beauty products online.

**Live Website**: [https://eleanor.pt](https://eleanor.pt)

## Features

- **E-commerce Shop**: Browse and purchase beauty products with secure checkout using Stripe
- **Admin Dashboard**: Complete salon management system
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Google Map**: Google Maps integration to obtain directions

## 🛠️ Technologies

- **Frontend**: 
  - [Next.js]
  - [TypeScript]
  - [Tailwind CSS]

- **Backend**:
  - [Next.js API Routes]
  - [MongoDB]

- **Payment Processing**:
  - [Stripe] - Secure payment infrastructure

## 🎨 Design & Branding

The design follows a clean, elegant aesthetic using the following color scheme:

- Primary: `#ECACA1` - Soft coral/peach
- Secondary: `#F3CEC6` - Light blush pink
- Accents: Shades of white and gray for a clean, professional look

## 🚀 Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- MongoDB connection

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/eleanor.git
   cd eleanor
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
