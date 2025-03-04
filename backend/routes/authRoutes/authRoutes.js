const router = require("express").Router()
const authMiddleware = require("../../authMiddleWare/authMiddleWare")
const {
  signUpController,
  loginController,
  checkController,
} = require("../../controllers/authControllers/authControllers")


router.post('/sign-up', signUpController)
router.post("/login", loginController)
router.get("/check", authMiddleware, checkController)


module.exports = router
