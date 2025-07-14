#### Postgres

- Create Postgres and pgAdmin `docker-compose up -d`
- Create database schema `npx prisma db push`
- Seed database `npx prisma db seed`
- Browse database `npx prisma studio`
- Browse [pgadmin](http://localhost:8085)
  - Login with `admin@domain.com ~ password`
- Drop Postgres and pgAdmin **post dev** `docker-compose down --rmi all -v`

#### Frontend

- Create `.env` in **client**
  - NEXT_PUBLIC_FIREBASE_API_KEY=
  - NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
  - NEXT_PUBLIC_FIREBASE_APP_ID=
  - NEXT_PUBLIC_CAPTCHA_SITE=
  - NEXT_PUBLIC_API=[url](https://localhost:44455)
- Browse [app](https://localhost:44454)

#### Backend

- Create `firebase.config.json` in **server**
- Create `.env` in **server**
  - GOOGLE_APPLICATION_CREDENTIALS=./firebase.config.json
  - ENVIRONMENT=development
  - TOKEN_SECRET=
  - CAPTCHA_SECRET=
  - DATABASE_URL=[url](postgresql://postgres:password@localhost:5432/postgres)
- Browse [swagger](https://localhost:44455/docs)

#### Prisma

- Inspect Prisma vs database schema `npx prisma db pull --print`
- Generate SQL diff between Prisma vs database
  ```bash
    npx prisma migrate diff \
      --from-schema-datamodel=./prisma/schema.prisma \
      --to-url="postgresql://URL" \
      --script
  ```
- Push Prisma changes to database `npx prisma db push`
- Seed database `npx prisma db seed`
- Browse database `npx prisma studio`

#### Crypto

- node
- require('crypto').randomBytes(64).toString('hex')
