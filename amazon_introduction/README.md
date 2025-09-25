# 🛒 Amazon Clone - E-Commerce Web Application

A full-stack Amazon clone built with **React**, **Firebase**, and **Stripe** for payment processing. This project demonstrates modern web development practices including authentication, state management, database integration, and payment processing.

## 🌟 Features

### 🔐 Authentication System

- **Firebase Authentication** for secure user login/signup
- Protected routes for authenticated users
- User session management with context API

### 🛍️ E-Commerce Functionality

- **Product Catalog** with real data from FakeStore API
- **Shopping Cart** with add/remove/quantity management
- **Product Categories** (Electronics, Jewelry, Clothing)
- **Product Search** and filtering capabilities

### 💳 Payment Processing

- **Stripe Integration** for secure payment processing
- **Axios** for API communication with backend
- **Firebase Firestore** for order storage
- Real-time order tracking and management

### 📱 User Interface

- **Responsive Design** that works on all devices
- **Amazon-inspired UI** with professional styling
- **Image Carousel** for promotional content
- **Modern React Components** with CSS Modules

## 🏗️ Project Structure

```
amazon_introduction/
├── src/
│   ├── API/                    # HTTP client configuration
│   │   ├── axios.jsx          # Axios instance setup
│   │   └── endPoint.js        # API endpoints
│   ├── Components/            # Reusable UI components
│   │   ├── Carousel/          # Image carousel component
│   │   ├── Category/          # Product categories
│   │   ├── CurrencyFormat/    # Price formatting
│   │   ├── DataProvider/      # Global state management
│   │   ├── Header/            # Navigation header
│   │   ├── LayOut/            # Page layout wrapper
│   │   ├── Loader/            # Loading spinner
│   │   └── Product/           # Product display components
│   ├── Pages/                 # Main application pages
│   │   ├── Auth/              # Login/Signup page
│   │   ├── Cart/              # Shopping cart page
│   │   ├── Landing/           # Home page
│   │   ├── Orders/            # Order history page
│   │   ├── Payments/          # Checkout and payment
│   │   ├── ProductDetail/     # Individual product page
│   │   ├── Results/           # Search results page
│   │   └── Router.jsx         # Application routing
│   ├── Utility/               # Helper functions and configs
│   │   ├── action.type.js     # Redux-style action types
│   │   ├── firebase.js        # Firebase configuration
│   │   └── reducer.js         # State reducer logic
│   ├── App.jsx                # Main application component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
├── functions/                 # Firebase Cloud Functions (Backend)
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

## 🚀 Technologies Used

### Frontend

- **React 19** - Modern UI library
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **React Context API** - State management
- **CSS Modules** - Scoped styling
- **React Responsive Carousel** - Image carousel
- **React Spinners** - Loading indicators

### Backend & Services

- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL database
- **Firebase Functions** - Serverless backend
- **Stripe** - Payment processing
- **Axios** - HTTP client for API calls
- **FakeStore API** - Product data source

### Development Tools

- **Vite** - Development server with HMR
- **Git** - Version control

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account
- Stripe account (for payments)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd amazon_introduction
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 4. Firebase Configuration

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication (Email/Password)
- Enable Firestore Database
- Add your Firebase config to `src/Utility/firebase.js`

### 5. Stripe Configuration

- Create a Stripe account at [Stripe Dashboard](https://dashboard.stripe.com/)
- Get your publishable key
- Add it to your environment variables

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 Application Pages

### 🏠 Home Page (`/`)

- Hero carousel with promotional images
- Product categories grid
- Featured products section
- Navigation header with search

### 🔐 Authentication (`/auth`)

- User login and signup forms
- Firebase authentication integration
- Redirect to protected pages after login

### 🛒 Shopping Cart (`/cart`)

- View cart items with quantities
- Update item quantities
- Remove items from cart
- Calculate total price
- Proceed to checkout

### 💳 Payment (`/payments`)

- Secure checkout process
- Stripe payment integration
- Order summary review
- Address information
- Payment confirmation

### 📦 Orders (`/orders`)

- View order history
- Order details and status
- Firebase database integration
- User-specific order filtering

### 🔍 Product Details (`/product/:id`)

- Individual product information
- Product images and descriptions
- Add to cart functionality
- Related products suggestions

### 📋 Search Results (`/category/:categoryName`)

- Category-based product filtering
- Search results display
- Product grid layout
- Sorting and filtering options

## 🔄 State Management

The application uses **React Context API** with **useReducer** for state management:

### Global State Structure

```javascript
{
  user: null | UserObject,     // Current authenticated user
  basket: [],                  // Shopping cart items
}
```

### Actions Available

- `SET_USER` - Set authenticated user
- `ADD_TO_BASKET` - Add product to cart
- `REMOVE_FROM_BASKET` - Remove product from cart
- `INCREMENT_ITEM` - Increase item quantity
- `DECREMENT_ITEM` - Decrease item quantity

## 💾 Database Structure

### Firebase Firestore Collections

#### Users Orders

```
/users/{userId}/orders/{orderId}
├── orderId: string
├── user_id: string
├── user_email: string
├── items: array
├── total_amount: number
├── order_date: timestamp
├── status: string
└── created_at: timestamp
```

#### Global Orders

```
/orders/{orderId}
├── orderId: string
├── user_id: string
├── user_email: string
├── items: array
├── total_amount: number
├── order_date: timestamp
└── status: string
```

## 🔐 Security Features

- **Firebase Authentication** for secure user management
- **Protected Routes** for authenticated-only pages
- **Stripe Secure Payments** with PCI compliance
- **Environment Variables** for sensitive data
- **Firebase Security Rules** for database access control

## 📱 Responsive Design

The application is fully responsive and works on:

- **Desktop** computers (1200px+)
- **Tablets** (768px - 1199px)
- **Mobile** devices (320px - 767px)

## 🚀 Deployment

The application can be deployed using:

```bash
npm run build
```

This creates a `dist` folder with production-ready files that can be deployed to any hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- **React Team** for the amazing library
- **Firebase** for backend services
- **Stripe** for payment processing
- **FakeStore API** for product data
- **Evangadi Tech** for guidance and education

---

## 🎯 Project Evaluation Criteria

This project demonstrates proficiency in:

### ✅ Technical Skills

- **React Development** - Component architecture, hooks, state management
- **API Integration** - RESTful API consumption, HTTP requests
- **Database Management** - Firebase Firestore operations
- **Authentication** - User management and security
- **Payment Processing** - E-commerce functionality
- **Responsive Design** - Mobile-first approach

### ✅ Best Practices

- **Code Organization** - Clean project structure
- **Component Reusability** - DRY principles
- **Error Handling** - Graceful error management
- **Performance** - Optimized rendering and loading
- **Security** - Protected routes and data validation
- **Documentation** - Comprehensive project documentation

### ✅ Advanced Features

- **Real-time Updates** - Firebase integration
- **State Persistence** - Cart state management
- **Payment Integration** - Stripe checkout flow
- **Image Optimization** - Responsive images
- **SEO Friendly** - Proper routing and meta tags

---

_Built with ❤️ for educational purposes_
