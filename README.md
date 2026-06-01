# SSG Distribuidora — Backend

REST API for **SSG Distribuidora**, a B2B food distribution company based in Bahía Blanca, Argentina. Manages products, brands, categories, promotions, delivery zones, employees, and marketing content (banners and announcements).

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js + TypeScript 5 |
| Framework | Express.js 4 |
| ORM | Sequelize 6 |
| Database | PostgreSQL (Neon cloud) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod |
| File Upload | Multer + Cloudinary |
| Security | Helmet, CORS |
| Logging | Morgan |
| Dev Server | ts-node-dev |
| Testing | Jest + Supertest |

---

## Project Structure

```
ssg-distribuidora-backend/
├── src/
│   ├── server.ts                  # Entry point: DB connect, sync, server start
│   ├── app.ts                     # Express config, middleware, route mounting
│   │
│   ├── config/
│   │   ├── env.ts                 # Zod-validated environment variables
│   │   ├── database.ts            # Sequelize instance & connection
│   │   └── cloudinary.ts          # Cloudinary client setup
│   │
│   ├── models/                    # Sequelize model definitions (one per entity)
│   │   ├── user.model.ts
│   │   ├── product.model.ts
│   │   ├── brand.model.ts
│   │   ├── category.model.ts
│   │   ├── promotion.model.ts
│   │   ├── zone.model.ts
│   │   ├── userSchedule.model.ts
│   │   ├── banner.model.ts
│   │   └── announcement.model.ts
│   │
│   ├── repositories/              # Data access layer — DB queries only
│   ├── services/                  # Business logic layer
│   ├── controllers/               # HTTP handlers — request/response only
│   ├── routes/                    # Route definitions with middleware wiring
│   │
│   ├── middlewares/
│   │   ├── authenticate.ts        # JWT verification, attaches req.user
│   │   ├── authorize.ts           # Role-based access control
│   │   ├── validate.ts            # Zod request validation
│   │   ├── errorHandler.ts        # Global error handler
│   │   └── upload.ts              # Multer + Cloudinary file handling
│   │
│   ├── types/                     # Zod schemas & DTOs per domain
│   │
│   ├── shared/
│   │   ├── errors/                # AppError, NotFoundError, UnauthorizedError, ForbiddenError
│   │   ├── types/
│   │   │   ├── enums.ts           # Role, ContentUnit, DiscountType, DayOfWeek, etc.
│   │   │   └── express.d.ts       # Augmented Express Request (req.user)
│   │   └── utils/
│   │       ├── hash.ts            # Password hashing
│   │       └── pagination.ts      # Pagination helpers
│   │
│   └── database/
│       ├── associations.ts        # All Sequelize model relationships
│       ├── seed.ts                # Demo data seeder
│       └── import.ts              # External data import
│
├── dist/                          # Compiled JS output
├── .env.example
├── tsconfig.json
└── package.json
```

---

## Architecture

Strict layered architecture — no layer can skip another:

```
Request → Route → Middleware → Controller → Service → Repository → Database
```

- **Controller** — HTTP only. Parses request, calls service, returns response.
- **Service** — All business logic. Throws domain errors. Orchestrates repositories.
- **Repository** — Only layer touching Sequelize. Pure data access.

**Error handling:** Services throw `AppError` subclasses. `express-async-errors` propagates them to the global `errorHandler` automatically — no try/catch needed in controllers.

**Validation:** Every route is validated with a Zod schema via `validate()` middleware before reaching the controller.

---

## API Endpoints

Base URL: `/api/v1`

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | `/auth/login` | Public |

### Products
| Method | Route | Access |
|--------|-------|--------|
| GET | `/products` | Public |
| GET | `/products/admin` | Admin/Employee |
| GET | `/products/:id` | Public |
| POST | `/products` | Admin |
| PUT | `/products/:id` | Admin |
| PATCH | `/products/:id/image` | Admin |
| DELETE | `/products/:id` | Admin (soft delete) |
| DELETE | `/products/:id/permanent` | Admin |

### Brands
| Method | Route | Access |
|--------|-------|--------|
| GET | `/brands` | Public |
| GET | `/brands/admin` | Admin/Employee |
| GET | `/brands/admin/all` | Admin/Employee |
| POST | `/brands` | Admin/Employee |
| PUT | `/brands/:id` | Admin/Employee |
| PATCH | `/brands/:id/status` | Admin/Employee |
| PATCH | `/brands/:id/image` | Admin/Employee |
| DELETE | `/brands/:id` | Admin |

### Categories
| Method | Route | Access |
|--------|-------|--------|
| GET | `/categories` | Public |
| GET | `/categories/roots` | Public |
| GET | `/categories/:id` | Public |
| POST | `/categories` | Admin |
| PUT | `/categories/:id` | Admin |
| DELETE | `/categories/:id` | Admin |

### Users
| Method | Route | Access |
|--------|-------|--------|
| GET | `/users` | Admin |
| POST | `/users` | Admin |
| PATCH | `/users/:id` | Admin |
| PATCH | `/users/:id/status` | Admin |
| PATCH | `/users/:id/role` | Admin |
| DELETE | `/users/:id` | Admin |
| GET | `/users/:id/schedule` | Admin |
| POST | `/users/:id/schedule` | Admin |
| DELETE | `/users/:id/schedule/:scheduleId` | Admin |

### Banners
| Method | Route | Access |
|--------|-------|--------|
| GET | `/banners` | Public |
| GET | `/banners/admin` | Admin |
| POST | `/banners` | Admin |
| PUT | `/banners/:id` | Admin |
| PATCH | `/banners/:id/media` | Admin |
| PATCH | `/banners/reorder` | Admin |
| DELETE | `/banners/:id` | Admin |

### Announcements
| Method | Route | Access |
|--------|-------|--------|
| GET | `/announcements/active` | Public |
| GET | `/announcements` | Admin |
| POST | `/announcements` | Admin |
| PUT | `/announcements/:id` | Admin |
| PATCH | `/announcements/:id/image` | Admin |
| DELETE | `/announcements/:id` | Admin |

### Promotions & Zones
| Method | Route | Access |
|--------|-------|--------|
| GET/POST/PUT/DELETE | `/promotions` | Admin/Employee |
| GET/POST/PUT/DELETE | `/zones` | Admin |

---

## Database Models

| Model | Key Fields |
|-------|------------|
| User | id, name, lastname, email, password, role (ADMIN/EMPLOYEE/CLIENT), isActive |
| Product | id, productName, productImage, brandId, categoryId, price, contentValue, contentUnit, packQuantity, stock, available, isFeatured |
| Brand | id, brandName, brandImage, isActive |
| Category | id, categoryName, parentCategoryId (self-reference for hierarchy) |
| Promotion | id, productId, title, discountType (PERCENTAGE/FIXED), discountValue, startsAt, endsAt, isActive |
| Zone | id, zoneName, isActive |
| UserSchedule | id, userId, zoneId, dayOfWeek |
| Banner | id, title, mediaUrl, mediaType (image/video), displayOrder, isActive |
| Announcement | id, title, description, imageUrl, isActive |

### Relationships
- Brand → Products (1:N)
- Category → Products (1:N)
- Category → Category (self-reference: parent/child)
- Product → Promotions (1:N)
- User → UserSchedules (1:N)
- Zone → UserSchedules (1:N)

---

## Authentication

1. `POST /api/v1/auth/login` with `{ email, password }`
2. Returns `{ token, user }` — JWT signed with `JWT_SECRET`, valid for 30 days
3. Include token in protected requests: `Authorization: Bearer <token>`

**Roles:**
- `ADMIN` — Full access to all operations
- `EMPLOYEE` — Can manage products, brands, promotions, schedules
- `CLIENT` — Public read endpoints only

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

# Auth
JWT_SECRET=your_secret_key_min_16_chars
JWT_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed demo data
npm run seed

# Run tests
npm test
```

The API runs at `http://localhost:3001`.
