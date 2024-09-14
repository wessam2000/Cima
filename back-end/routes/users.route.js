const userController =require("../controllers/user.controller");
const authController =require("../controllers/auth.controller")
const express =require("express");
const Router = express.Router();

Router.get("/",userController.getUsers);
Router.post("/signup",authController.signUp);
Router.post("/login",authController.login);
module.exports=Router;
