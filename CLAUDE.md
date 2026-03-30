# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

TypeScript · Node.js · Express · PostgreSQL · Sequelize ORM

## Commands

```bash
npm run dev          # Start dev server with hot reload (ts-node-dev)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled output

npm run db:migrate   # Run pending migrations
npm run db:migrate:undo  # Rollback last migration
npm run db:seed      # Run all seeders

npm test             # Run all tests
npm run test:watch   # Watch mode
```

## Architecture

Strict **Controller → Service → Repository** layering:
- **Controller**: HTTP only — parse request, call service, return response. No business logic.
- **Service**: All business logic, throws domain errors, orchestrates repositories.
- **Repository**: Only layer that touches Sequelize models.

## Folder structure

Layer-based organization under `src/`:

```
src/
├── models/       Sequelize model definitions (one file per entity)
├── repositories/ DB queries only, one class per model
├── services/     Business logic, orchestrates repositories
├── controllers/  HTTP request/response, no business logic
├── routes/       Route definitions + middleware wiring
├── types/        Zod schemas and DTO types (one file per feature)
├── middlewares/  authenticate, authorize, validate, errorHandler
├── shared/       errors/, utils/, enums
├── config/       env.ts, database.ts
└── database/     associations.ts, migrations/, seeders/
```

Current features: `auth`, `users`, `brands`, `products`, `promotions`

## Key files

- `src/config/env.ts` — Zod-validated env vars. App exits immediately if any required var is missing.
- `src/config/database.ts` — Sequelize instance.
- `src/database/associations.ts` — All model associations defined in one place (avoids circular imports). Must be called before DB connect.
- `src/server.ts` — Entry point: registers associations → connects DB → starts Express.
- `src/app.ts` — Express setup: middleware chain, route mounting, global error handler.

## Error handling

All errors extend `AppError` (in `src/shared/errors/`). Throw them from services; the global `errorHandler` middleware catches everything and returns:
```json
{ "status": "error", "statusCode": 404, "message": "Product not found" }
```
`express-async-errors` is imported at the top of `app.ts` so async controller errors propagate automatically — no try/catch needed in controllers.

## Auth & roles

- `authenticate` middleware: verifies JWT, attaches `req.user = { id, email, role }`.
- `authorize(...roles)` middleware factory: guards routes by role.
- Roles: `ADMIN`, `EMPLOYEE`, `USER` (defined in `src/shared/types/enums.ts`).
- Read endpoints on products/brands/promotions are public. Writes require auth.
- Delete operations require `ADMIN` only.

## Data model

**Products** match the frontend's shape: `productName`, `presentation` (e.g. "Caja x 5kg"), `category` (congelados/refrigerados/secos), `subcategory`, `imageUrl`, `brandId`.

**Brands** are a separate entity — products belong to a brand.

**Promotions** belong to a product with `discountType` (PERCENTAGE | FIXED), `discountValue`, `startsAt`, `endsAt`.

All entities use UUID primary keys and soft-delete via `isActive` boolean.

## Validation

Use `validate(zodSchema)` middleware in routes. Schemas live in `*.types.ts` and wrap `{ body, params, query }`. Example:
```ts
router.post('/', authenticate, authorize(Role.ADMIN), validate(createProductSchema), ctrl.create.bind(ctrl));
```

## API prefix

All routes are versioned: `/api/v1/...`

## Environment

Copy `.env.example` to `.env` and fill in values before running.
