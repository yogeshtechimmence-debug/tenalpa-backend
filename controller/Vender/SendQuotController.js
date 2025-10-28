import Quote from "../../Model/VenderModel/SendQuotModel.js";
import Job from "../../Model/UserModel/JobPostModel.js";
import User from "../../Model/UserAuthModel.js";

export const SendQuote = async (req, res) => {
  try {
    const { job_id, vendor_id, quote_amount, message, time } = req.body;

    const image = req.files
      ? req.files.map(
          (file) =>
            `https://tenalpa-backend.onrender.com/uploads/VenderImage/QuotImage/${file.filename}`
        )
      : [];

    // Validate required fields
    if ((!job_id, !vendor_id || !quote_amount || !message || !time)) {
      return res.status(400).json({
        status: 0,
        message:
          "All fields (job_id, vendor_id, quote_amount, message) are required",
      });
    }

    // Check if job exists
    const job = await Job.findOne({ id: job_id });
    if (!job) {
      return res.status(404).json({
        status: 0,
        message: "Job not found with this job_id",
      });
    }

    // Check if vendor exists
    const vendor = await User.findOne({ id: vendor_id });
    if (!vendor) {
      return res.status(404).json({
        status: 0,
        message: "Vendor not found with this vendor_id",
      });
    }

    // Find last quote safely
    const lastQuote = await Quote.findOne().sort({ id: -1 });
    const newId = lastQuote ? lastQuote.id + 1 : 1;

    // Create quote entry
    const newQuote = new Quote({
      id: newId,
      job_id: job.id,
      user_id: job.user_id,
      vendor_id,
      quote_amount,
      message,
      time,
      image,
      vendor_name: `${vendor.first_name} ${vendor.last_name}`,
      vendor_phone: vendor.phone || vendor.mobile,
      vendor_email: vendor.email,
    });

    await newQuote.save();

    res.status(201).json({
      status: 1,
      message: "Quote sent successfully!",
      result: newQuote,
    });
  } catch (error) {
    console.error("Error sending quote:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while sending quote",
      error: error.message,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ id: 1 }); // ascending order by id

    if (!jobs.length) {
      return res.status(404).json({
        success: false,
        message: "No job posts found",
      });
    }

    res.status(200).json({
      success: true,
      total_jobs: jobs.length,
      result: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching jobs",
      error: error.message,
    });
  }
};

