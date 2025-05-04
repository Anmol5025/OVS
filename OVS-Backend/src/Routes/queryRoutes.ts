import express, { Request, Response } from "express";
import { QueryModel } from "../models/Query";
import { authenticateUser, authenticateAdmin } from "../middleware/auth";

const router = express.Router();

// Client raises a query
router.post("/raise", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { subject, message } = req.body;
    const newQuery = await QueryModel.create({
      userId: req.userId,
      subject,
      message,
    });
    res.json({ msg: "Query submitted successfully", query: newQuery });
  } catch (err) {
    res.status(500).json({ msg: "Error submitting query" });
  }
});

// Admin fetches all queries
router.get("/admin/all", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const queries = await QueryModel.find().populate("userId", "username email");
    res.json({ queries });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching queries" });
  }
});

// Admin responds to a query
router.post("/admin/respond/:id", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { response, status } = req.body;
    const updated = await QueryModel.findByIdAndUpdate(
      req.params.id,
      { response, status },
      { new: true }
    );
    res.json({ msg: "Query updated", updated });
  } catch (err) {
    res.status(500).json({ msg: "Error updating query" });
  }
});

export default router;
