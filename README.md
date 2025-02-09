# MiFi Frontend

This project is a social media aimed for handmade artist communication. 

## Key Features

### `Authentication and authorization`
Configured axios intercepter that stores token on successful login and for each request adds the token from local storage as Authorization Header. If any API is return unauthenicated status then the page is navigated to login.

### `Dynamic username check`
On registration checks if username is unique on typing.

### `Reusable components`
Various reusable components including Navbar, Success and Error Popups and few cards.
