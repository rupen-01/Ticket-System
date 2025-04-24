const Ticket = require("../models/ticketModel");

// Create ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, createdBy } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      createdBy,
    });

    res.status(201).json({ msg: "Ticket created", ticket });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get all tickets (agent only)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("createdBy", "name email");
    res.status(200).json({ tickets });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get my tickets
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id });
    res.status(200).json({ tickets });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get single ticket
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    if (
      req.user.role !== "agent" &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.status(200).json({ ticket });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Update ticket
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    const { title, description, status } = req.body;
    if (title !== undefined) ticket.title = title;
    if (description !== undefined) ticket.description = description;
    if (status !== undefined) ticket.status = status;

    await ticket.save();
    res.status(200).json({ msg: "Ticket updated", ticket });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    await ticket.deleteOne();
    res.status(200).json({ msg: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

