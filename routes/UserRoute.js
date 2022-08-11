const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const UserDb = require("../models/User");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;


//registering the user for the first time
router.post("/register",[
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 8 characters').isLength({ min: 8 }),
  body('mobile','Mobile should be 10 characters long').isLength({ min: 10 }),
] ,async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await UserDb.findOne({ email: req.body.email });
      if (user) {
        res.json({
            status:"error",
             error: "User Already registered" });
      }
      else{
        const salt = await bcrypt.genSalt(10);
        const uid=(new Date()).getTime().toString(36) + Math.random().toString(36).slice(8);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await UserDb.create({
          uid:uid,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: secPass,
          mobile: req.body.mobile,
          role: req.body.role,
          status: req.body.status,
        });
        // console.log(user)
        const data = {
          user: {
            id: user.id,
          },
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ 
          status:"success",
          data:user,
         
         });
      
        }}catch (error) {
          
          // console.error(error.message);
          res.status(500).send("Internal Server Error");
        }
      }
      
);


router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists()], async (req, res) => {
    // If there are errors, return Bad request and the error message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    try {
      let user = await UserDb.findOne({ email:email });
      if (!user) {
      
        return res.json({
           status:"error",
          error: "user not register" 
          });
      }
      //comparing the passwords
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
       
        return res.json({
          status:"error",
            error: "password wrong" 
          });
      }
  const data1=user;
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(email, JWT_SECRET, {expiresIn: "30d"});
      
      res.json({ 
        status:"success", 
        token:authtoken ,
        data1:data1
      })
  
    } catch (error) {
      // console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  
  });

// ROUTE 3: Get loggedin User Details using: POST "/api/v1/getuser". Login required
router.get('/getuser/:id',  async (req, res) => {

    try {
      const id = req.params.id;
      const user = await UserDb.find({_id:id})
      res.send(user)
    } catch (error) {
      // console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })  

// ROUTE 4: Get all User Details using: POST "/api/v1/getalluser"
router.get('/getalluser',  async (req, res) => {

  try {
    const user = await UserDb.find()
    res.send(user)
  } catch (error) {
    // console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
  

module.exports = router;
