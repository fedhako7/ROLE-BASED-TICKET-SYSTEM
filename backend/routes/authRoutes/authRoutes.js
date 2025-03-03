const router = require("express").Router()
const {
  loginController,
  signUpController
} = require("../../controllers/authControllers/authControllers")


router.post('/sign-up', signUpController)
router.get("/login", loginController)


module.exports = router
