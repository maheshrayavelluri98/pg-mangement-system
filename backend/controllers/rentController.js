const Rent = require("../models/Rent");
const Tenant = require("../models/Tenant");
const Room = require("../models/Room");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all rent records for logged in admin
// @route   GET /api/v1/rents
// @access  Private
exports.getRents = asyncHandler(async (req, res, next) => {
  // Add adminId filter to only get rents for the logged-in admin
  req.query.adminId = req.admin.id;

  // Build query
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Rent.find(JSON.parse(queryStr))
    .populate({
      path: "tenantId",
      select: "name phone",
    })
    .populate({
      path: "roomId",
      select: "floorNumber roomNumber",
    });

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-year -month");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Rent.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const rents = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: rents.length,
    pagination,
    data: rents,
  });
});

// @desc    Get single rent record
// @route   GET /api/v1/rents/:id
// @access  Private
exports.getRent = asyncHandler(async (req, res, next) => {
  const rent = await Rent.findById(req.params.id)
    .populate({
      path: "tenantId",
      select: "name phone",
    })
    .populate({
      path: "roomId",
      select: "floorNumber roomNumber",
    });

  if (!rent) {
    return next(
      new ErrorResponse(
        `Rent record not found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure admin owns the rent record
  if (rent.adminId.toString() !== req.admin.id) {
    return next(
      new ErrorResponse(`Admin not authorized to access this rent record`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: rent,
  });
});

// @desc    Create new rent record
// @route   POST /api/v1/rents
// @access  Private
exports.createRent = asyncHandler(async (req, res, next) => {
  // Add adminId to request body
  req.body.adminId = req.admin.id;

  // Check if tenant exists and belongs to admin
  const tenant = await Tenant.findById(req.body.tenantId);

  if (!tenant) {
    return next(
      new ErrorResponse(`Tenant not found with id of ${req.body.tenantId}`, 404)
    );
  }

  // Make sure admin owns the tenant
  if (tenant.adminId.toString() !== req.admin.id) {
    return next(
      new ErrorResponse(
        `Admin not authorized to create rent for this tenant`,
        401
      )
    );
  }

  // Add roomId from tenant
  req.body.roomId = tenant.roomId;

  // Check if rent record already exists for this tenant, month, and year
  const existingRent = await Rent.findOne({
    tenantId: req.body.tenantId,
    month: req.body.month,
    year: req.body.year,
  });

  if (existingRent) {
    return next(
      new ErrorResponse(
        `Rent record already exists for this tenant for ${req.body.month}/${req.body.year}`,
        400
      )
    );
  }

  const rent = await Rent.create(req.body);

  res.status(201).json({
    success: true,
    data: rent,
  });
});

// @desc    Update rent record (mark as paid/unpaid)
// @route   PUT /api/v1/rents/:id
// @access  Private
exports.updateRent = asyncHandler(async (req, res, next) => {
  let rent = await Rent.findById(req.params.id);

  if (!rent) {
    return next(
      new ErrorResponse(
        `Rent record not found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure admin owns the rent record
  if (rent.adminId.toString() !== req.admin.id) {
    return next(
      new ErrorResponse(`Admin not authorized to update this rent record`, 401)
    );
  }

  // If marking as paid, add payment date
  if (req.body.isPaid && !rent.isPaid) {
    req.body.paymentDate = Date.now();
  }

  rent = await Rent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: rent,
  });
});

// @desc    Delete rent record
// @route   DELETE /api/v1/rents/:id
// @access  Private
exports.deleteRent = asyncHandler(async (req, res, next) => {
  const rent = await Rent.findById(req.params.id);

  if (!rent) {
    return next(
      new ErrorResponse(
        `Rent record not found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure admin owns the rent record
  if (rent.adminId.toString() !== req.admin.id) {
    return next(
      new ErrorResponse(`Admin not authorized to delete this rent record`, 401)
    );
  }

  await rent.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Create rent records automatically for tenants
// @route   POST /api/v1/rents/create-auto
// @access  Private
exports.createAutoRents = asyncHandler(async (req, res, next) => {
  const adminId = req.admin.id;
  const { rentData } = req.body;

  if (!rentData || !Array.isArray(rentData) || rentData.length === 0) {
    return next(new ErrorResponse("Please provide valid rent data", 400));
  }

  const createdRents = [];
  const errors = [];

  // Process each rent record
  for (const rentItem of rentData) {
    try {
      // Validate required fields
      if (
        !rentItem.tenantId ||
        !rentItem.month ||
        !rentItem.year ||
        !rentItem.amount ||
        !rentItem.dueDate
      ) {
        errors.push({
          message: "Missing required fields",
          data: rentItem,
        });
        continue;
      }

      // Check if tenant exists and belongs to admin
      const tenant = await Tenant.findById(rentItem.tenantId);
      if (!tenant) {
        errors.push({
          message: `Tenant not found with id of ${rentItem.tenantId}`,
          data: rentItem,
        });
        continue;
      }

      // Make sure admin owns the tenant
      if (tenant.adminId.toString() !== adminId) {
        errors.push({
          message: "Admin not authorized to create rent for this tenant",
          data: rentItem,
        });
        continue;
      }

      // Check if rent record already exists for this tenant, month, and year
      const existingRent = await Rent.findOne({
        tenantId: rentItem.tenantId,
        month: rentItem.month,
        year: rentItem.year,
      });

      if (existingRent) {
        errors.push({
          message: `Rent record already exists for this tenant for ${rentItem.month}/${rentItem.year}`,
          data: rentItem,
          existingRentId: existingRent._id,
        });
        continue;
      }

      // Create the rent record
      const newRent = await Rent.create({
        tenantId: rentItem.tenantId,
        roomId: tenant.roomId,
        adminId,
        amount: rentItem.amount,
        month: rentItem.month,
        year: rentItem.year,
        dueDate: new Date(rentItem.dueDate),
        isPaid: false,
      });

      createdRents.push(newRent);
    } catch (err) {
      errors.push({
        message: err.message,
        data: rentItem,
      });
    }
  }

  res.status(201).json({
    success: true,
    count: createdRents.length,
    data: createdRents,
    errors: errors.length > 0 ? errors : undefined,
  });
});

// @desc    Mark rent as paid
// @route   PUT /api/v1/rents/:id/pay
// @access  Private
exports.markRentAsPaid = asyncHandler(async (req, res, next) => {
  let rent = await Rent.findById(req.params.id);

  if (!rent) {
    return next(
      new ErrorResponse(
        `Rent record not found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure admin owns the rent record
  if (rent.adminId.toString() !== req.admin.id) {
    return next(
      new ErrorResponse(`Admin not authorized to update this rent record`, 401)
    );
  }

  // Set payment details
  const paymentData = {
    isPaid: true,
    paymentDate: new Date(),
    paymentMethod: req.body.paymentMethod || "Cash",
    paymentReference: req.body.paymentReference || "",
  };

  rent = await Rent.findByIdAndUpdate(req.params.id, paymentData, {
    new: true,
    runValidators: true,
  });

  // Calculate next month's rent due date
  const dueDate = new Date(rent.dueDate);
  let nextMonth = dueDate.getMonth() + 1;
  let nextYear = dueDate.getFullYear();

  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear += 1;
  }

  const nextDueDate = new Date(dueDate);
  nextDueDate.setMonth(nextMonth);
  nextDueDate.setFullYear(nextYear);

  // Check if next month's rent record already exists
  const existingNextRent = await Rent.findOne({
    tenantId: rent.tenantId,
    month: nextMonth + 1, // Convert from 0-indexed to 1-indexed
    year: nextYear,
  });

  // If next month's rent doesn't exist, create it
  let nextRent = null;
  if (!existingNextRent) {
    // Get tenant details to get room ID and rent amount
    const tenant = await Tenant.findById(rent.tenantId);
    if (tenant && tenant.active) {
      const room = await Room.findById(tenant.roomId);
      if (room) {
        nextRent = await Rent.create({
          tenantId: rent.tenantId,
          roomId: tenant.roomId,
          adminId: req.admin.id,
          amount: room.rentAmount,
          month: nextMonth + 1, // Convert from 0-indexed to 1-indexed
          year: nextYear,
          dueDate: nextDueDate,
          isPaid: false,
        });
      }
    }
  }

  res.status(200).json({
    success: true,
    data: rent,
    nextRent: nextRent,
  });
});
