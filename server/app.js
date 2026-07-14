const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const fs = require('fs');

const app = express();

// Security Middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); // Allow images to load cross origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
// Express 5+ compatibility issue with express-mongo-sanitize modifying req.query
// app.use(mongoSanitize({ replaceWith: '_' }));

// Data sanitization against XSS
// Express 5+ compatibility issue
// app.use(xss());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files (PDFs, QRs, etc)
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));

// Swagger Documentation
const swaggerPath = path.join(__dirname, 'docs', 'swagger.yaml');
if (fs.existsSync(swaggerPath)) {
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/verify', require('./routes/verifyRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Error handling middleware
app.use(require('./middleware/errorHandler'));

module.exports = app;
