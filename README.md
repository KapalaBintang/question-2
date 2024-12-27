# API Documentation

## Base URL


## Authentication Endpoints
### 1. Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "name": "string",
        "email": "string",
        "password": "string"
    }
    ```
- **Response**:
    - **201 Created**:
    ```json
    {
        "id": "string",
        "name": "string",
        "email": "string"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
        "message": "All fields are required"
    }
    ```
    - **409 Conflict**:
    ```json
    {
        "message": "User  already exists"
    }
    ```

### 2. Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
        "name": "string",
        "email": "string",
        "accessToken": "string"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
        "message": "All fields are required"
    }
    ```
    - **401 Unauthorized**:
    ```json
    {
        "message": "Invalid credentials"
    }
    ```

### 3. Logout
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Response**:
    - **200 OK**:
    ```json
    {
        "message": "Logged out successfully"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
        "message": "No refresh token provided"
    }
    ```

### 4. Refresh Token
- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Response**:
    - **200 OK**:
    ```json
    {
        "accessToken": "string"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
        "message": "No refresh token provided"
    }
    ```
    - **401 Unauthorized**:
    ```json
    {
        "message": "Invalid refresh token"
    }
    ```

## User Endpoints
### 1. Get Profile
- **URL**: `/users`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
    ```json
    {
        "user": {
            "id": "string",
            "name": "string",
            "email": "string"
        }
    }
    ```

### 2. Update Profile
- **URL**: `/users`
- **Method**: `PUT`
- **Request Body**:
    ```json
    {
        "name": "string",
        "email": "string",
        "password": "string"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
        "message": "Profile updated successfully",
        "user": {
            "id": "string",
            "name": "string",
            "email": "string"
        }
    }
    ```

### 3. Get All Users
- **URL**: `/users/getAll`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
    ```json
    {
        "users": [
            {
                "id": "string",
                "name": "string",
                "email": "string",
                "role": "string"
            }
        ]
    }
    ```

### 4. Update User
- **URL**: `/users/:id`
- **Method**: `PUT`
- **Request Body**:
    ```json
    {
        "name": "string",
        "email": "string",
        "role": "string"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
        "name": "string",
        "email": "string",
        "role": "string"
    }
    ```

### 5. Delete User
- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Response**:
    - **200 OK**:
    ```json
    {
        "message": "User  deleted successfully"
    }
    ```

##

## Product Endpoints
### 1. Create Product
- **URL**: `/products`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "name": "string",
        "description": "string",
        "price": "number",
        "condition": "string",
        "stock": "number",
        "categoryId": "string"
    }
    ```
- **Response**:
    - **201 Created**:
    ```json
    {
        "message": "Product created successfully",
        "product": {
            "id": "string",
            "name": "string",
            "description": "string",
            "price": "number",
            "condition": "string",
            "stock": "number",
            "categoryId": "string",
            "userId": "string"
        }
    }
    ```
    - **400 Bad Request**:
    ```json
    {
        "message": "All fields are required"
    }
    ```

### 2. Get All Products
- **URL**: `/products`
- **Method**: `GET`
- **Query Parameters**:
    - `page`: (optional) number
    - `limit`: (optional) number
    - `search`: (optional) string
- **Response**:
    - **200 OK**:
    ```json
    {
        "message": "Products fetched successfully",
        "products": [
            {
                "id": "string",
                "name": "string",
                "description": "string",
                "price": "number",
                "condition": "string",
                "stock": "number",
                "categoryId": "string"
            }
        ]
    }
    ```

### 3. Get Product by ID
- **URL**: `/products/:id`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
    ```json
    {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "condition": "string",
        "stock": "number",
        "categoryId": "string"
    }
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "Product not found"
    }
    ```

### 4. Update Product
- **URL**: `/products/:id`
- **Method**: `PUT`
- **Request Body**:
    ```json
    {
        "name": "string",
        "description": "string",
        "price": "number",
        "condition": "string",
        "stock": "number",
        "categoryId": "string"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
        "message": "Product updated successfully",
        "product": {
            "id": "string",
            "name": "string",
            "description": "string",
            "price": "number",
            "condition": "string",
            "stock": "number",
            "categoryId": "string"
        }
    }
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "Product not found"
    }
    ```

### 5. Delete Product
- **URL**: `/products/:id`
- **Method**: `DELETE`
- **Response**:
    - **200 OK**:
    ```json
    {
        "message": "Product deleted successfully"
    }
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "Product not found"
    }
    ```

## Category Endpoints
### 1. Create Category
- **URL**: `/categories`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "name": "string",
        "description": "string"
    }
    ```
- **Response**:
    - **201 Created**:
    ```json
    {
        "message": "Category created successfully",
        "category": {
            "id": "string",
            "name": "string",
            "description": "string"
        }
    }
    ```
    - **400 Bad Request**:
    ```json
    {
        "message": "All fields are required"
    }
    ```

### 2. Get All Categories
- **URL**: `/categories`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
    ```json
    {
        "categories": [
            {
                "id": "string",
                "name": "string",
                "description": "string"
            }
        ]
    }
    ```

### 3. Get Category by ID
- **URL**: `/categories/:id`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
    ```json
    {
        "id": "string",
        "name": "string",
        "description": "string"
    }
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "Category not found"
    }
    ```

### 4. Update Category
- **URL**: `/categories/:id`
- **Method**: `PUT`
- **Request Body**:
    ```json
    {
        "name": "string",
        "description": "string"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
        "message": "Category updated successfully",
        "category": {
            "id": "string",
            "name": "string",
            "description": "string"
        }
    }
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "Category not found"
    }
    ```

### 5. Delete Category
- **URL**: `/categories/:id`
- **Method**: `DELETE`
- **Response**:
    - **200 OK**:
    ```json
    {
        "message": "Category deleted successfully"
    }
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "Category not found"
    }
    ```

## Cart Endpoints
### 1. Add to Cart
- **URL**: `/carts`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "productId": "string",
        "quantity": "number"
    }
    ```
- **Response**:
    - **201 Created**:
    ```json
    {
        "id": "string",
        "productId": "string",
        "quantity": "number"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
        "message": "Product ID and quantity are required"
    }
    ```

### 2. Get Cart Items
- **URL**: `/carts`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
    ```json
    {
        "cartItems": [
            {
                "id": "string",
                "productId": "string",
                "quantity": "number"
            }
        ]
    }
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "Cart is empty"
    }
    ```

### 3. Update Cart Item
- **URL**: `/carts/:id`
- **Method**: `PUT`
- **Request Body**:
    ```json
    {
        "quantity": "number"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
        "id": "string",
        "productId": "string",
        "quantity": "number"
    }
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "Cart item not found"
    }
    ```

### 4. Delete Cart Item
- **URL**: `/carts/:id`
- **Method**: `DELETE`
- **Response**:
    - **204 No Content**:
    ```json
    {}
    ```

### 5. Clear Cart
- **URL**: `/carts`
- **Method**: `DELETE`
- **Response**:
    - **204 No Content**:
    ```json
    {}
    ```

## Order Endpoints
### 1. Checkout
- **URL**: `/orders/checkout`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "shippingAddress": "string",
        "paymentMethod": "string"
    }
    ```
- **Response**:
    - **201 Created**:
    ```json
    {
        "id": "string",
        "totalPrice": "number",
        "status": "string"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
        "message": "Shipping address is required"
    }
    ```

## Order Endpoints (Continued)

### 2. Track Order
- **URL**: `/orders/track`
- **Method**: `GET`
- **Query Parameters**:
    - `orderId`: (required) string
- **Response**:
    - **200 OK**:
    ```json
    {
        "orderId": "string",
        "status": "string",
        "totalPrice": "number",
        "items": [
            {
                "productId": "string",
                "quantity": "number"
            }
        ],
        "shippingAddress": "string"
    }
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "Order not found"
    }
    ```

### 3. Get All Orders
- **URL**: `/orders`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
    ```json
    {
        "orders": [
            {
                "id": "string",
                "totalPrice": "number",
                "status": "string",
                "createdAt": "string"
            }
        ]
    }
    ```

### 4. Get Order by ID
- **URL**: `/orders/:id`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
    ```json
    {
        "id": "string",
        "totalPrice": "number",
        "status": "string",
        "items": [
            {
                "productId": "string",
                "quantity": "number"
            }
        ],
        "shippingAddress": "string",
        "createdAt": "string"
    }
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "Order not found"
    }
    ```

### 5. Cancel Order
- **URL**: `/orders/:id/cancel`
- **Method**: `POST`
- **Response**:
    - **200 OK**:
    ```json
    {
        "message": "Order canceled successfully"
    }
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "Order not found"
    }
    ```

## User Endpoints

### 1. Register User
- **URL**: `/users/register`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "username": "string",
        "email": "string",
        "password": "string"
    }
    ```
- **Response**:
    - **201 Created**:
    ```json
    {
        "message": "User  registered successfully",
        "user": {
            "id": "string",
            "username": "string",
            "email": "string"
        }
    }
    ```
    - **400 Bad Request**:
    ```json
    {
        "message": "All fields are required"
    }
    ```

### 2. Login User
- **URL**: `/users/login`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
        "message": "Login successful",
        "token": "string"
    }
    ```
    - **401 Unauthorized**:
    ```json
    {
        "message": "Invalid email or password"
    }
    ```

### 3. Get User Profile
- **URL**: `/users/profile`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
    ```json
    {
        "id": "string",
        "username": "string",
        "email": "string"
    }
    ```
    - **401 Unauthorized**:
    ```json
    {
        "message": "Unauthorized access"
    }
    ```

### 4. Update User Profile
- **URL**: `/users/profile`
- **Method**: `PUT`
- **Request Body**:
    ```json
    {
        "username": "string",
        "email": "string"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
        "message": "Profile updated successfully",
        "user": {
            "id": "string",
            "username": "string",
            "email": "string"
        }
    }
    ```
    - **400 Bad Request**:
    ```json
    {
        "message": "All fields are required"
    }
    ```

### 5. Delete User Account
- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Response**:
    - **204 No Content**:
    ```json
    {}
    ```
    - **404 Not Found**:
    ```json
    {
        "message": "User  not found"
    }
    ```

## Conclusion
This documentation provides a comprehensive overview of the API endpoints, including the expected request and response formats. Ensure to keep this documentation updated as the API evolves to maintain clarity for users and developers interacting with the API.