## Set up .env:
PORT=5000
DB_HOST=db
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=mydatabase
JWT_SECRET=your-secret-key

## Run with Docker:
docker-compose up --build

## API endpoint
- USER
 - POST
http://localhost:5000/users/sign-up
http://localhost:5000/users/sign-in
http://localhost:5000/users/sign-out
http://localhost:5000/users/refresh-token

- PRODUCT
 - POST
http://localhost:5000/products

 - GET
http://localhost:5000/products?limit=2&sort=createdAt:asc&search=Fo&page=0
http://localhost:5000/products/:id

 - PUT
http://localhost:5000/products/:id
http://localhost:5000/products/delete/:id