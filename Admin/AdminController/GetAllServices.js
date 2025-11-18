import vendorServices from "../../Model/VendorModel/AddServicesModel.js";

// export const getAllServices = async (req, res) => {
//   try {
//     let { page = 1, limit = 10, search = "" } = req.query;

//     page = Number(page);
//     limit = Number(limit);

//     const matchStage = {};

//     if (search) {
//       matchStage["userData.id"] = Number(search);
//     }

//     const allServices = await vendorServices.aggregate([
//       {
//         $lookup: {
//           from: "authusers",
//           localField: "user_id",
//           foreignField: "id",
//           as: "userData",
//         },
//       },
//       { $unwind: "$userData" },

//       //  Apply search filter
//       { $match: matchStage },

//       //  Pagination
//       { $skip: (page - 1) * limit },
//       { $limit: limit },
//     ]);

//     //  Total count
//     const totalCountArray = await vendorServices.aggregate([
//       {
//         $lookup: {
//           from: "authusers",
//           localField: "user_id",
//           foreignField: "id",
//           as: "userData",
//         },
//       },
//       { $unwind: "$userData" },
//       { $match: matchStage },
//       { $count: "total" },
//     ]);

//     const total = totalCountArray[0]?.total || 0;

//     res.status(200).json({
//       status: "1",
//       message: "Services fetched successfully",
//       result: allServices,
//       totalPages: Math.ceil(total / limit),
//       totalItems: total,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: "0",
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

export const getAllServices = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", id } = req.query;

    page = Number(page);
    limit = Number(limit);

    const matchStage = {};

    // If ID is provided, filter by user_id
    if (id) {
      matchStage["user_id"] = Number(id);
    }

    // If search term is provided (only when no specific ID is provided)
    if (search && !id) {
      matchStage["userData.id"] = Number(search);
    }

    const aggregationPipeline = [
      {
        $lookup: {
          from: "authusers",
          localField: "user_id",
          foreignField: "id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
    ];

    if (Object.keys(matchStage).length > 0) {
      aggregationPipeline.push({ $match: matchStage });
    }

    // Add pagination
    aggregationPipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    const allServices = await vendorServices.aggregate(aggregationPipeline);

    const countPipeline = [
      {
        $lookup: {
          from: "authusers",
          localField: "user_id",
          foreignField: "id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
    ];

    if (Object.keys(matchStage).length > 0) {
      countPipeline.push({ $match: matchStage });
    }

    countPipeline.push({ $count: "total" });

    const totalCountArray = await vendorServices.aggregate(countPipeline);
    const total = totalCountArray[0]?.total || 0;

    res.status(200).json({
      status: "1",
      message: id
        ? "Vendor services fetched successfully"
        : "All services fetched successfully",
      result: allServices,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      isVendorSpecific: !!id, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteMultipleServices = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        status: "0",
        message: "No IDs provided",
      });
    }

    await vendorServices.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      status: "1",
      message: "Selected services deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "0",
      message: "Error deleting services",
      error: error.message,
    });
  }
};
