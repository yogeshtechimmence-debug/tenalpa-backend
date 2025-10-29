import Job from "../../Model/UserModel/JobPostModel.js";
import User from "../../Model/UserAuthModel.js";
import Quote from "../../Model/VenderModel/SendQuotModel.js";

//Post job
export const PostJob = async (req, res) => {
  try {
    const {
      user_id,
      category,
      job_title,
      description,
      budget,
      location,
      date,
      time,
    } = req.query;

    const image = req.files
      ? req.files.map(
          (file) =>
            `https://tenalpa-backend.onrender.com/uploads/UserImage/PostJobImage/${file.filename}`
        )
      : [];

    if (
      !user_id ||
      !category ||
      !job_title ||
      !description ||
      !budget ||
      !location ||
      !date ||
      !time ||
      image.length === 0
    ) {
      return res.status(400).json({
        status: 0,
        message:
          "All fields (user_id, category, job_title, description, budget, location, date, time, image) are required",
      });
    }

    //  Use findOne for numeric IDs
    const user = await User.findOne({ id: user_id });

    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "User not found with this user_id",
      });
    }

    // Find last job ID safely
    const lastJob = await Job.findOne().sort({ id: -1 });
    const newId = lastJob ? lastJob.id + 1 : 1;

    const newJob = new Job({
      id: newId,
      user_id,
      name: `${user.first_name} ${user.last_name}`,
      category,
      job_title,
      description,
      budget,
      location,
      date,
      time,
      image,
    });

    await newJob.save();

    res.status(201).json({
      status: 1,
      message:
        "Your job has been posted successfully! Vendors will send you quotes soon.",
      result: newJob,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while posting job",
      error: error.message,
    });
  }
};

// DELETE
export const DeleteJob = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "Job id is required",
      });
    }

    // Find and delete job by numeric id
    const deletedJob = await Job.findOneAndDelete({ id: id });

    if (!deletedJob) {
      return res.status(404).json({
        status: 0,
        message: "Job not found with this id",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Job deleted successfully",
      result: deletedJob,
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while deleting job",
      error: error.message,
    });
  }
};

// GET QUOTES
export const getQuotes = async (req, res) => {
  try {
    const { job_id } = req.query;

    if (!job_id) {
      return res.status(400).json({
        status: 0,
        message: "job_id is required",
      });
    }

    const quotes = await Quote.find({ job_id: Number(job_id) }).sort({ id: 1 });

    if (quotes.length === 0) {
      return res.status(404).json({
        status: 0,
        message: "No quotes found for this job_id",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Quotes retrieved successfully",
      total_quotes: quotes.length,
      data: quotes,
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while retrieving quotes",
      error: error.message,
    });
  }
};
