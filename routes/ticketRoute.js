const express = require("express");
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");
const { protect, isAgentOrOwner } = require("../middleware/auth");

router.post("/tickets", protect, createTicket);

router.get("/tickets", protect, isAgentOrOwner, getAllTickets);

router.get("/tickets/my", protect, getMyTickets);

router.get("/tickets/:id", protect, getTicketById);

router.put("/tickets/:id", protect, isAgentOrOwner, updateTicket);

router.delete("/tickets/:id", protect, isAgentOrOwner, deleteTicket);

module.exports = router;
