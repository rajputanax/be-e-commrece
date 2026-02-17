// ================================================================================
// ============================= [ START ] ========================================
// ================================================================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connection from './config/db.js'
import morgan from "morgan"
import { authMiddleware } from './middlewares/auth-middleware.js'

// =========================== [ Route Imports ] ==================================
import userRoutes from "./routes/userRoutes.js";
import routerRole from "./routes/roleBaseRoute.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import stripeRouter from "./routes/stripe.js";
import orderRoutes from "./routes/orderRoutes.js";


// ============================ [ Config ] ========================================
dotenv.config();

const app = express();




// Enable Cross-Origin Resource Sharing
// Replace app.use(cors()) with this:
app.use(cors({
  origin: [
    "http://localhost:5173", // For local development
    "https://fe-e-com-8lz6.vercel.app" // Your EXACT Vercel URL
  ],
  credentials: true, // Crucial because you are using cookie-parser
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
   allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"]
}));

// ================================================================================
// ============================ [ Middlewares ] ===================================
// ================================================================================



// Parse JSON bodies
app.use(express.json());


// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// using coockie-parser
app.use(cookieParser());

// HTTP request logger middleware

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ================================================================================
// ============================== [ Endpoints ] ===================================
// ================================================================================

app.use("/api/user", userRoutes);        // User routes
app.get("/api/check-auth", authMiddleware, (req, res) => {
  res.status(200).json({ msg: "Authenticated", user: req.user });
});
app.use('/api', stripeRouter);
app.use("/api/products",authMiddleware, productRoutes); // Product routes
app.use('/api/current', authMiddleware,routerRole);      // current user/ & stuff
app.use("/api/admin",authMiddleware, adminRoutes);      // Admin routes
app.use("/api/orders", authMiddleware, orderRoutes);    // Order routes
  
// ================================================================================
// ========================== [ DB Connection ] ===================================
// ================================================================================

connection();

// ================================================================================
// ============================ [ Start Server ] ==================================
// ================================================================================

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ================================================================================
// ============================== [ END ] =========================================
// ================================================================================
