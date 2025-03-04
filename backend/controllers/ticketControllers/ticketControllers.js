const Ticket = require("../../models/ticketModels/ticketModels");
const status_codes = require("http-status-codes");
const roles = require("../roles/roles");


const createTicketController = async (req, res) => {
  const { title, description } = req.body;
  const user_id = req.user.userId;

  if (!title || !description || !user_id) {
    return res.status(status_codes.BAD_REQUEST).json({msg: "title, descriptions or user_id not provided."})
  }

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
  if (!req?.user) {
    return res.status(status_codes.BAD_REQUEST).json({msg: "No user provided."})
  }

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
  const { id } = req.params;
  const { status } = req.body;
  const admin_id = req.user.userId;

  if (!id || !status || !admin_id) {
    return res.status(status_codes.BAD_REQUEST).json({msg: "id, new status or admin_id not provided."})
  }

  try {
    if (req.user.role !== roles.ADMIN) {
      return res.status(status_codes.FORBIDDEN).json({ message: "Access denied. Only admins can update ticket status." });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      console.log("[UpdateTicket] error: ", "ticket not found" )
      return res.status(status_codes.NOT_FOUND).json({ message: "Ticket not found" });
    }

    ticket.status = status;
    ticket.last_updated_by = admin_id;
    await ticket.save();

    res.status(status_codes.OK).json({ message: "Ticket status updated successfully", ticket });
  } catch (error) {
    console.log("[UpdateTicket] error: ", error)
    console.error(error);
    res.status(status_codes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


module.exports = { createTicketController, getTicketController, updateTicketController} 
