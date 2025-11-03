import VenderServices from "../../Model/VenderModel/AddServicesModel.js";

// ADD SERVICES
export const AddServices = async (req, res) => {
  try {
    const {
      user_id,
      services_category,
      sub_category,
      servies_price,
      description,
    } = req.query;

    const image = req.files
      ? req.files.map(
          (file) =>
            `https://tenalpa-backend.onrender.com/uploads/VenderImage/servicesImage/${file.filename}`
        )
      : [];

    if (
      !user_id ||
      !services_category ||
      !sub_category ||
      !servies_price ||
      !description
    ) {
      return res.status(400).json({
        status: 0,
        message: "All fields are required.",
      });
    }

    //  Find last document safely
    const lastService = await VenderServices.findOne().sort({ id: -1 }).lean();

    //  Safe numeric increment
    const lastId =
      lastService && Number.isFinite(lastService.id) ? lastService.id : 0;

    const newId = lastId + 1;

    const newService = new VenderServices({
      id: newId,
      user_id,
      services_category,
      sub_category,
      servies_price,
      description,
      image,
    });

    await newService.save();

    res.status(200).json({
      status: 1,
      message: "Service added successfully.",
      result: newService,
    });
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while adding service.",
      error: error.message,
    });
  }
};


// Get All Services
export const getAllServices = async (req, res) => {
  try {
    const allServices = await VenderServices.find(); // 👈 sab data le aayega

    res.status(200).json({
      status: "1",
      message: "All vendor services fetched successfully",
      result: allServices,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      status: "0",
      message: "Server error while fetching vendor services",
      error: error.message,
    });
  }
};

// fetch service
export const GetServicesByVender = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        status: 0,
        message: "user_id is required",
      });
    }

    // Fetch all services
    const services = await VenderServices.find({ user_id });

    if (services.length === 0) {
      return res.status(404).json({
        status: 0,
        message: "No services found for this vendor",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Services fetched successfully",
      result: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while fetching services",
      error: error.message,
    });
  }
};

//  UPDATE SERVICES
export const UpdateServices = async (req, res) => {
  try {
    const { id } = req.query; // numeric id
    const { services_category, sub_category, servies_price, description } =
      req.body;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "id is required",
      });
    }

    // Handle new uploaded images (if any)
    const newImages = req.files
      ? req.files.map(
          (file) =>
            `https://tenalpa-backend.onrender.com/uploads/VenderImage/servicesImage/${file.filename}`
        )
      : [];

    //  Fetch service by numeric ID
    const existingService = await VenderServices.findOne({ id: Number(id) });

    if (!existingService) {
      return res.status(404).json({
        status: 0,
        message: "Service not found",
      });
    }

    //  Update fields if provided
    if (services_category)
      existingService.services_category = services_category;
    if (sub_category) existingService.sub_category = sub_category;
    if (servies_price) existingService.servies_price = servies_price;
    if (description) existingService.description = description;

    //  Merge new images with existing ones (optional)
    if (newImages.length > 0) {
      existingService.image = [...existingService.image, ...newImages];
    }

    await existingService.save();

    res.status(200).json({
      status: 1,
      message: "Service updated successfully",
      result: existingService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while updating service",
      error: error.message,
    });
  }
};

//  DELETE SERVICES
export const DeleteServices = async (req, res) => {
  try {
    const { id } = req.query; // this is your custom numeric ID

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "id is required",
      });
    }

    // Convert id to number to match schema
    const deletedService = await VenderServices.findOneAndDelete({
      id: Number(id),
    });

    if (!deletedService) {
      return res.status(404).json({
        status: 0,
        message: "Service not found or already deleted",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Service deleted successfully",
      result: deletedService,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while deleting service",
      error: error.message,
    });
  }
};
