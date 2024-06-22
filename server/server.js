require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const database = require('./database');
const userController = require('./userController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.post('/register', userController.registerUser);
app.post('/login', userController.loginUser);
app.get('/GetUser', userController.getUser);
app.put('/UpdateUser', userController.updateUser);
app.delete('/DeleteUser', userController.deleteUser);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
