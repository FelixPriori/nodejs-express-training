# Node.js Course

This is the code for [ACADEMIND](https://academind.com/)'s [Node.js](https://www.udemy.com/course/nodejs-the-complete-guide/) course on udemy.

## Topics covered so far

### Express.js

Basic overview over [Express.js](https://expressjs.com/)

### Dynamic Content & Template Engines

- [Pug](https://pugjs.org/api/getting-started.html)
- [Handlebars](https://handlebarsjs.com/)
- [EJS](https://ejs.co/) (in use)

### MVC

[Model View Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern overview and implementation

### Dynamic Routes

- Routing using route params & queries
- CRUD operations with a local JSON file

### Databases Overview

#### SQL

- [MySQL](https://www.mysql.com/)
- [Sequelize ORM](https://sequelize.org/)

#### NoSQL

- [MongoDB](https://www.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/) (in use)

### Cookies & Sessions

- Using [express-session](https://www.npmjs.com/package/express-session) for creating session
- Using [connect-mongodb-session](https://www.npmjs.com/package/connect-mongodb-session) for storing session in MongoDB

### Authentication

- Using [bcrypyjs](https://www.npmjs.com/package/bcryptjs) to encrypt and decrypt user password
- Route protection for logged out users
- Protecting against [CSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) Attacks with [csrf-csrf](https://www.npmjs.com/package/csrf-csrf)
- Show user a feedback message with [connect-flash](https://www.npmjs.com/package/connect-flash) when authentication fails
