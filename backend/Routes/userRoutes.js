const express = require('express');
const Router = express.Router();
const { loginController, registerController, fetchAllUsersController } = require('../Controllers/userController');

const { protect } = require('../middleware/authMiddleware')

Router.get('/fetchUsers',protect, fetchAllUsersController); 

Router.post('/login', loginController);
Router.post('/register', registerController);

module.exports = Router;
