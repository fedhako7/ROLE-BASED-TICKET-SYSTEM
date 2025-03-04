const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Open", "In Progress", "Closed"], default: "Open" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    last_updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "last_updated_at" } }
);


module.exports = mongoose.model("Ticket", TicketSchema);
