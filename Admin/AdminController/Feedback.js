// controllers/feedbackController.js
import Feedback from "../models/Feedback.js";

/**
 * Create feedback
 * req.body: { name, email, message, rating?, userId? }
 */
export const createFeedback = async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;

    const fb = await Feedback.create({
      name,
      email,
      message,
      rating,
      userId: req.body.userId || null,
      meta: {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      },
    });

    return res.status(201).json({ success: true, data: fb });
  } catch (err) {
    console.error("createFeedback:", err);
    // Basic error handling; adapt for your error middleware.
    return res.status(400).json({ success: false, error: err.message });
  }
};

/**
 * Get list of feedbacks with pagination + filter + search
 * Query params:
 *   page, limit, status, minRating, maxRating, q (search name/email/message)
 */
export const getFeedbacks = async (req, res) => {
  try {
    let { page = 1, limit = 20, status, minRating, maxRating, q } = req.query;
    page = parseInt(page);
    limit = Math.min(parseInt(limit) || 20, 100); // max 100

    const filter = {};
    if (status) filter.status = status;
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = Number(minRating);
      if (maxRating) filter.rating.$lte = Number(maxRating);
    }
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ name: regex }, { email: regex }, { message: regex }];
    }

    const total = await Feedback.countDocuments(filter);
    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      data: feedbacks,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("getFeedbacks:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get single feedback by id
 */
export const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const fb = await Feedback.findById(id);
    if (!fb) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: fb });
  } catch (err) {
    console.error("getFeedbackById:", err);
    return res.status(400).json({ success: false, error: "Invalid id" });
  }
};

/**
 * Update feedback (admin or owner)
 * req.body may include: status, adminReply, message, rating, name, email
 */
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If adminReply is present, also set repliedAt if missing
    if (updates.adminReply && typeof updates.adminReply === "object") {
      updates["adminReply.repliedAt"] = updates.adminReply.repliedAt || new Date();
      // if repliedBy provided or from req.user, set repliedBy
      if (!updates.adminReply.repliedBy && req.user?.id) {
        updates["adminReply.repliedBy"] = req.user.id;
      }
    }

    const fb = await Feedback.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!fb) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: fb });
  } catch (err) {
    console.error("updateFeedback:", err);
    return res.status(400).json({ success: false, error: err.message });
  }
};

/**
 * Delete feedback (soft-delete could be added instead)
 */
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const fb = await Feedback.findByIdAndDelete(id);
    if (!fb) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("deleteFeedback:", err);
    return res.status(400).json({ success: false, error: "Invalid id" });
  }
};

/**
 * Admin reply convenience endpoint:
 * req.body: { text }
 */
export const replyToFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: "Reply text required" });

    const updates = {
      status: "in_progress",
      "adminReply.text": text,
      "adminReply.repliedAt": new Date(),
      "adminReply.repliedBy": req.user?.id || null,
    };

    const fb = await Feedback.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!fb) return res.status(404).json({ success: false, error: "Not found" });

    // TODO: optionally send email/notification to user using fb.email
    return res.json({ success: true, data: fb });
  } catch (err) {
    console.error("replyToFeedback:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
