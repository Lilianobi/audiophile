
🎧 Audiophile E-commerce - Setup Guide
 Project Foundation
Setting up Next.js project with proper structure

1. Initialize Next.js Project
npx create-next-app@latest audiophile-ecommerce
cd audiophile-ecommerce

# Install dependencies
npm install convex
npm install resend
npm install react-hook-form
2. Project Structure
audiophile-ecommerce/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Homepage
│   ├── globals.css        # Global styles
│   ├── category/
│   │   └── [slug]/
│   │       └── page.js    # Category pages
│   ├── product/
│   │   └── [id]/
│   │       └── page.js    # Product detail
│   ├── checkout/
│   │   └── page.js        # Checkout page
│   └── confirmation/
│       └── page.js        # Order confirmation
├── components/
│   ├── layout/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   └── Navigation.js
│   ├── product/
│   │   ├── ProductCard.js
│   │   ├── ProductDetail.js
│   │   └── ProductGallery.js
│   ├── cart/
│   │   ├── Cart.js
│   │   └── CartItem.js
│   ├── checkout/
│   │   ├── CheckoutForm.js
│   │   └── OrderSummary.js
│   └── common/
│       ├── Button.js
│       └── Input.js
├── styles/
│   ├── variables.css      # Design tokens
│   ├── header.css
│   ├── footer.css
│   └── ...
├── lib/
│   ├── cartUtils.js
│   └── validation.js
├── convex/
│   ├── _generated/
│   ├── schema.ts
│   ├── orders.ts
│   └── products.ts
├── public/
│   └── assets/
│       ├── images/
│       └── icons/
└── package.json
3. Design Tokens (From Figma)
Primary
#D87D4A

Black
#101010

Light Grey
#F1F1F1

White
#FAFAFA

4. Typography
Font Family: Manrope
H1: 56px / Bold / 58px line-height / 2px letter-spacing
H2: 40px / Bold / 44px line-height / 1.5px letter-spacing
H3: 32px / Bold / 36px line-height / 1.15px letter-spacing
H4: 28px / Bold / 38px line-height / 2px letter-spacing
H5: 24px / Bold / 33px line-height / 1.7px letter-spacing
H6: 18px / Bold / 24px line-height / 1.3px letter-spacing
Body: 15px / Medium / 25px line-height
5. Responsive Breakpoints
/* Mobile: 375px */
/* Tablet: 768px */
/* Desktop: 1440px */

@media (max-width: 767px) { /* Mobile */ }
@media (min-width: 768px) and (max-width: 1439px) { /* Tablet */ }
@media (min-width: 1440px) { /* Desktop */ }

✅ Next Steps
Create the files shown in the structure above
Set up Convex backend (convex dev)
Request Batch 2: Header & Navigation components

