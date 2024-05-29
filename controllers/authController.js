import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, resp) => {
  try {
    const { name, email, password, phone, address, question } = req.body;
    //validations
    if (!name) {
      return resp.send({ message: "Name is Required" });
    }
    if (!email) {
      return resp.send({ message: "Email is Required" });
    }
    if (!password) {
      return resp.send({ message: "Password is Required" });
    }
    if (!phone) {
      return resp.send({ message: "Phone is Required" });
    }
    if (!address) {
      return resp.send({ message: "Address is Required" });
    }
    if (!question) {
      return resp.send({ message: "Question is Required" });
    }

    //check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return resp.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);

    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      question,
    }).save();
    resp.status(201).send({
      success: true,
      message: "User register successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

//Post Login
export const loginController = async (req, resp) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return resp.status(404).send({
        success: false,
        message: "invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "Email is not register",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return resp.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    resp.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgotPasswordController

export const forgotPasswordController = async (req, resp) => {
  try {
    const { email, question, newpassword } = req.body;
    if (!email) {
      resp.status(400).send({ message: "Email is required" });
    }
    if (!question) {
      resp.status(400).send({ message: "question is required" });
    }
    if (!newpassword) {
      resp.status(400).send({ message: "New Password is required" });
    }

    //check
    const user = await userModel.findOne({ email, question });
    //validation
    if (!user) {
      resp.status(404).send({
        success: false,
        message: "Wrong Email or Question",
      });
    }
    const hashed = await hashPassword(newpassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    resp.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, resp) => {
  resp.send("Protected Route");
};
