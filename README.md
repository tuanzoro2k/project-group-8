**ProjectDatabase**
How to run this project
1. Run `npm install`
2. Create file .env then copy the below code to .env file and save:
```
ACCESS_TOKEN_SECRET = 5947e4e029d1e8817e09730a88f2ee217e51b5b47e1cf7dcef704bffa92a2b0e021eff6907b5809e48411217b6522659b932e8f80e47147a0c4b268ed74a42a0
REFRESH_TOKEN_SECRET = 5947e4e029d1e8817e09730a88f2ee217e51b5b47e1cf7dcef704bffa92a2b0e021eff6907b5809e48411217b6522659b932e8f80e47147a0c4b268ed74a42a0
SESS_NAME = 'semail'
SESS_SECRET = process.env.ACCESS_TOKEN_SECRET
SESS_LIFETIME = 3600000
```
3. Open MySql WorkBench and execute file FinalQuery to initialize database.
4. Run the project by command: `npm run devStart`
