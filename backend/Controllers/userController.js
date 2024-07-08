const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const UserModel = require('../modals/userModels');
const { generateToken } = require('../Config/generateToken');

const SALT_ROUNDS = 10; 

const loginController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log(req.body);
    console.log("Invalid request: email or password missing");
    return res.status(400).send("Invalid request: email or password missing");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    console.log("User not found");
    return res.status(400).send("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    console.log("Invalid password");
    res.status(400).send("Invalid email or password");
  }
});

const registerController = expressAsyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("All necessary details are not filled");
    }

    const userEmail = await UserModel.findOne({ email });
    if (userEmail) {
      return res.status(400).send("User email already exists");
    }

    const nameExists = await UserModel.findOne({ name });
    if (nameExists) {
      return res.status(400).send("Username already exists. Try keeping a different username");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("Error during registration:", error);
    return res.status(400).send("Some error occurred");
  }
});

const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: "i"}},
      { email: { $regex: req.query.search, $options: "i"}}
    ]
  } : {};

  const users = await UserModel.find();
  if(users)
  res.send(users);
});

module.exports = { loginController, registerController,fetchAllUsersController };
