# PulseBoard

> **Real-time Metrics Monitoring & Alerting Platform**

PulseBoard is a powerful backend API that monitors your critical business metrics in real-time, automatically detects threshold breaches, and sends instant email alerts when things go wrong. Perfect for tracking KPIs, system health, and business analytics.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## Features

### Core Functionality
- **JWT Authentication** - Secure user registration and login with httpOnly cookies
- **Data Source Management** - Connect multiple data sources (API, Database, File)
- **Metric Cards** - Create and track custom metrics with thresholds
- **Automated Updates** - Cron jobs update metrics every 5 minutes
- **Smart Alerts** - Automatic alert generation for threshold breaches
- **Email Notifications** - Instant email alerts for critical/warning statuses
- **Status Tracking** - Three-tier status system (Normal, Warning, Critical)

### Security & Performance
- **Helmet.js** - Security headers protection
- **CORS Enabled** - Ready for frontend integration
- **Rate Limiting** - Brute force attack prevention (100 req/15min)
- **Password Hashing** - Bcrypt encryption for user passwords
- **Multi-tenancy** - User-isolated data architecture

---

## Architecture

```
src/
├── config/           # Database & environment configuration
├── controllers/      # Request handlers (Auth, DataSource, MetricCard)
├── models/           # MongoDB schemas (User, DataSource, MetricCard, Alert)
├── routes/           # API endpoints
├── middlewares/      # Authentication & error handling
├── jobs/             # Cron jobs (metric updates, email alerts)
├── services/         # External services (Nodemailer)
└── utils/            # Helpers (ApiError, ApiResponse, asyncHandler, statusCalc)
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **Bcrypt** | Password encryption |
| **Node-Cron** | Scheduled jobs |
| **Nodemailer** | Email service |
| **Helmet** | Security middleware |
| **Express Rate Limit** | API throttling |

---

## Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email alerts

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Kiran-sai-hub/Pulseboard.git
cd Pulseboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Database
DB_URL=your_atlas_cluster_uri

# Server
PORT=your_port

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=how_much_time_you_need_this_token_to_survive

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Note:** For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

4. **Start the server**
```bash
npm run dev
```

The server will start on `http://localhost:{your_port}`

---

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Check Auth Status
```http
GET /api/auth/check
Authorization: Bearer <token>
```

---

### Data Sources

#### Create Data Source
```http
POST /api/data-sources
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sales API",
  "type": "api",
  "endpoint": "https://api.example.com/sales",
  "description": "Daily sales metrics",
  "updateFrequency": 15,
  "mockData": { "value": 1000 }
}
```

#### Get All Data Sources
```http
GET /api/data-sources
Authorization: Bearer <token>
```

#### Get Data Source by ID
```http
GET /api/data-sources/:id
Authorization: Bearer <token>
```

#### Update Data Source
```http
PUT /api/data-sources/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description",
  "isActive": true,
  "mockData": { "value": 1500 }
}
```

#### Delete Data Source
```http
DELETE /api/data-sources/:id
Authorization: Bearer <token>
```

---

### Metric Cards

#### Create Metric Card
```http
POST /api/metric-cards
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Daily Revenue",
  "dataSource": "64f1a2b3c4d5e6f7g8h9i0j1",
  "value": 5000,
  "unit": "USD",
  "threshold": 4000
}
```

#### Get All Metric Cards
```http
GET /api/metric-cards
Authorization: Bearer <token>
```

#### Get Metric Card by ID
```http
GET /api/metric-cards/:id
Authorization: Bearer <token>
```

#### Update Metric Card
```http
PUT /api/metric-cards/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "value": 5500,
  "threshold": 4500,
  "unit": "USD"
}
```

#### Delete Metric Card
```http
DELETE /api/metric-cards/:id
Authorization: Bearer <token>
```

---

## How It Works

### Status Calculation Logic

PulseBoard automatically calculates metric status based on value vs threshold:

| Status | Condition | Action |
|--------|-----------|--------|
| **Normal** | `value < threshold` | No alert |
| **Warning** | `threshold ≤ value < threshold * 1.2` | Alert generated |
| **Critical** | `value ≥ threshold * 1.2` | Alert generated |

### Automated Jobs

1. **Metric Update Job** (Every 5 minutes)
   - Fetches active data sources
   - Updates metric values with mock data
   - Recalculates status
   - Generates alerts for breaches

2. **Email Alert Job** (Every 2 minutes)
   - Checks for unsent alerts
   - Sends email notifications
   - Marks alerts as sent

---

## Security Features

- **JWT Tokens** - Secure, stateless authentication
- **HttpOnly Cookies** - XSS attack prevention
- **Password Hashing** - Bcrypt with salt rounds
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Helmet.js** - Sets security HTTP headers
- **Input Validation** - Prevents injection attacks
- **Owner Isolation** - Users can only access their own data

---

## Database Schema

### User
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### DataSource
```javascript
{
  name: String,
  type: Enum['database', 'api', 'file'],
  endpoint: String,
  description: String,
  updateFrequency: Number (minutes),
  isActive: Boolean,
  mockData: Object,
  owner: ObjectId (User),
  timestamps: true
}
```

### MetricCard
```javascript
{
  title: String,
  dataSource: ObjectId (DataSource),
  value: Number,
  unit: String,
  threshold: Number,
  status: Enum['normal', 'warning', 'critical'],
  lastUpdatedAt: Date,
  owner: ObjectId (User),
  timestamps: true
}
```

### Alert
```javascript
{
  metricCard: ObjectId (MetricCard),
  status: Enum['warning', 'critical'],
  value: Number,
  threshold: Number,
  triggeredAt: Date,
  sent: Boolean,
  owner: ObjectId (User),
  timestamps: true
}
```

---

## Testing with Postman/Thunder Client

1. Register a new user
2. Login and copy the JWT token
3. Add token to Authorization header: `Bearer <token>`
4. Create a data source with mock data
5. Create metric cards linked to the data source
6. Wait for cron jobs to run (or trigger manually)
7. Check your email for alerts!

---

## Future Enhancements

- [ ] Dashboard UI with React/Next.js
- [ ] WebSocket support for real-time updates
- [ ] Multiple notification channels (Slack, SMS, Webhook)
- [ ] Historical metric data & trend analysis
- [ ] Custom alert rules (e.g., consecutive breaches)
- [ ] Team collaboration & shared dashboards
- [ ] API documentation with Swagger
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Unit & integration tests

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

## Author

**Sai Kiran**

- GitHub: [@Kiran-sai](https://github.com/Kiran-sai-hub)

---

## Acknowledgments

- Built with Node.js and Express
- MongoDB Atlas for database hosting
- Nodemailer for email functionality

---

## Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub

---

<div align="center">

**Star this repo if you find it useful!**

Made with 💻 and ☕ by Sai Kiran

</div>
