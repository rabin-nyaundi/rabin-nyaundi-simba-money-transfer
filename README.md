This is a [next.Js project for sending and receiving money](https://nextjs.org/).
## Getting Started 

1. First, run install the dependencies:
```bash
npm install
```

2. Second run the development server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Create .env file in the root directory of the project.

Add the following variables to the .env file:

```bash DATABASE_URL=postgres://user:password@host:port/database
NEXTAUTH_URL=http://localhost:3000
```

run the following to apply migrations and seed the database:
```bash 
npx prisma migrate
npx prisma db push
npx prisma studio
```

open [http://localhost:5555](http://localhost:5555) and see your database schema.



Send/convert money to users registered in the system.
# About Money-money-transfer
Send money in 3 currencies USD, EUR and NGN. 