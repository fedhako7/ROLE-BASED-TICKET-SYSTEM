const Ticket = require("../../models/ticketModels/ticketModels");
const status_codes = require("http-status-codes");
const roles = require("../roles/roles");


const createTicketController = async (req, res) => {
  const { title, description } = req.body;
  const user_id = req.user.userId;

  try {
    const newTicket = new Ticket({
      user_id,
      title,
      description,
    });

    await newTicket.save();
    res.status(status_codes.CREATED).json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    console.error(error);
    res.status(status_codes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


const getTicketController = async (req, res) => {
  try {
    let tickets;

    if (req.user.role === roles.ADMIN) {
      tickets = await Ticket.find().populate("user_id", "username fname lname");
    } else if (req.user.role === roles.USER) {
      tickets = await Ticket.find({ user_id: req.user.userId }).populate("user_id", "username fname lname");
    }

    res.status(status_codes.OK).json({ tickets });
  } catch (error) {
    console.error(error);
    res.status(status_codes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


const updateTicketController = async (req, res) => {
}

module.exports = { createTicketController, getTicketController, updateTicketController} 
