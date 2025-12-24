// src/controllers/sessionController.js
const sessionService = require("../services/session.service");

exports.createSession = async (req, res) => {
  try {
    const result = await sessionService.createSession(
      req.user.id,
      req.body,
      req.body.timeslots
    );

    res.status(201).json({
      message: "Session created successfully!",
      sessionId: result.session.id,
      timeslotsCreated: result.timeslotsCreated
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMySessions = async (req, res) => {
  try {
    const sessions = await sessionService.getMySessions(req.user.id);
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editSession = async (req, res) => {
  try {
    const { price, location_name, location_map_url, position_id, new_timeslots } = req.body;

    const updates = { price, location_name, location_map_url, position_id };

    const result = await sessionService.editSession(
      req.params.sessionId,
      req.user.id,
      updates,
      new_timeslots
    );

    res.json({
      message: "Session updated successfully!",
      addedTimeslots: result.addedCount
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAvailableSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getAvailableSessions();
    res.json({
      message: "Available sessions retrieved",
      count: sessions.length,
      sessions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};