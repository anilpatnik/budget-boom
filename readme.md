#### Postgres

- Create Postgres and pgAdmin `docker-compose up -d`
- Push Prisma changes to database `npx prisma db push`
- Seed database `npx prisma db seed`
- Browse database `npx prisma studio`
- Browse [pgadmin](http://localhost:8085)
  - Login with `admin@domain.com ~ password`
- Drop Postgres and pgAdmin **post dev** `docker-compose down --rmi all -v`

#### Frontend

- Create `.env` in **client**
  - VITE_SECRET=
  - VITE_FIREBASE_API_KEY=
  - VITE_FIREBASE_PROJECT_ID=
  - VITE_FIREBASE_MESSAGING_SENDER_ID=
  - VITE_FIREBASE_APP_ID=
  - VITE_CAPTCHA_SITE=
  - VITE_API=[url](https://localhost:44455)
- Browse [app](https://localhost:44454)

#### Backend

- Create `firebase.config.json` in **server**
- Create `.env` in **server**
  - ENVIRONMENT=development
  - CAPTCHA_SECRET=
  - DATABASE_URL=[url](postgresql://postgres:password@localhost:5432/postgres)
  - GOOGLE_APPLICATION_CREDENTIALS=./firebase.config.json
  - _optional_ GOOGLE_CREDENTIALS=`base64 string on one line`
    ```bash
      cat ./firebase.config.json | base64
    ```
- Browse [swagger](https://localhost:44455/docs)

#### Firebase

- `firebase logout`
- `firebase login`
- `firebase projects:list`

- `firebase use <project-id>`
- `firebase functions:list`
- `firebase functions:delete <api>`

- `firebase emulators:start --only functions`
- `firebase deploy --only functions:<api>`

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
