const router = require("express").Router()
const {
  createTicketController,
  getTicketController,
  updateTicketController
} = require("../../controllers/ticketControllers/ticketControllers")


router.post("/", createTicketController)
router.get("/", getTicketController)
router.put("/", updateTicketController)


module.exports = router
