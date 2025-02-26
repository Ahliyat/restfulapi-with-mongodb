import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// register login
export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = User({
      firstname,
      lastname,
      email,
      password: hashPassword,
      role,
    });
    const savedUser = await newUser.save();
    return res.status(201).json({
      message: "User Suceessfully created",
      savedUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
// login endpoint
export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist" });
    console.log(user);

    const checkIsPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!checkIsPasswordMatch)
      return res.status(401).json({ message: "Invalid user credentials" });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );
    // delete user.password;
    const { password, ...otherUserInfo } = user._doc;
    res.status(200).json({
      message: "User login successful",
      token,
      otherUserInfo,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // delete users.password;
    const getUsers = users.map((user) => {
      const { password, ...otherUserInfo } = user._doc;
      return otherUserInfo;
    });
    res.status(200).json(getUsers);
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

// get a user
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const { password, ...userInfo } = user._doc;
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};
// update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // const { firstname, lastname, email } = req.body;
    const updateUserData = await User.findByIdAndUpdate(
      id,
      // { firstname, lastname, email },
      {
        // set all that are in req.body
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateUserData);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({
      message: "User successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
