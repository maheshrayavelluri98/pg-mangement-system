const Room = require("../models/Room");
const Tenant = require("../models/Tenant");
const Rent = require("../models/Rent");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get admin ID from authenticated user
  const adminId = req.admin.id;

  // Get total rooms count
  const totalRooms = await Room.countDocuments({ adminId });

  // Get rooms with at least one bed occupied
  const occupiedRooms = await Room.countDocuments({
    adminId,
    occupiedBeds: { $gt: 0 },
  });

  // Get total tenants count
  const totalTenants = await Tenant.countDocuments({ adminId });

  // Get pending rents count
  const pendingRents = await Rent.countDocuments({
    adminId,
    isPaid: false,
    // Only count rents for the current month or past months
    dueDate: { $lte: new Date() },
  });

  // Get upcoming and overdue rents
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day

  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30); // Show dues for the next 30 days

  // Get past due date (30 days ago)
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Get all active tenants
  const tenants = await Tenant.find({
    adminId,
    active: true,
  }).populate("roomId");

  // Get all existing rent records for the date range
  const existingRents = await Rent.find({
    adminId,
    dueDate: {
      $gte: thirtyDaysAgo,
      $lte: thirtyDaysFromNow,
    },
  });

  // Map of tenant ID to rent record
  const tenantRentMap = {};
  existingRents.forEach((rent) => {
    const tenantId = rent.tenantId.toString();
    if (!tenantRentMap[tenantId]) {
      tenantRentMap[tenantId] = [];
    }
    tenantRentMap[tenantId].push(rent);
  });

  // Array to store upcoming due rents
  const upcomingDueRents = [];
  // Array to store overdue rents
  const overdueRents = [];

  // Process each tenant
  for (const tenant of tenants) {
    // Check if tenant has a join date
    if (tenant.joiningDate) {
      const joinDate = new Date(tenant.joiningDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set to beginning of day

      // Calculate months between join date and current date
      const monthsDiff =
        (currentDate.getFullYear() - joinDate.getFullYear()) * 12 +
        (currentDate.getMonth() - joinDate.getMonth());

      // Calculate the next due date (join date + X months)
      const nextDueDate = new Date(joinDate);
      nextDueDate.setMonth(joinDate.getMonth() + monthsDiff + 1);
      nextDueDate.setHours(0, 0, 0, 0); // Set to beginning of day

      // If the due date has already passed, adjust to the current month
      if (nextDueDate < currentDate) {
        nextDueDate.setMonth(currentDate.getMonth());
        nextDueDate.setFullYear(currentDate.getFullYear());
        // Set the day to match the original join date day
        nextDueDate.setDate(joinDate.getDate());
      }

      // If we're past that day in the current month, move to next month
      if (nextDueDate < currentDate) {
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      }

      // Check if there's already a rent record for this tenant for the calculated due date month/year
      const tenantRents = tenantRentMap[tenant._id.toString()] || [];

      // Find if there's a rent record for the calculated due date month/year
      const dueMonth = nextDueDate.getMonth() + 1; // JavaScript months are 0-indexed
      const dueYear = nextDueDate.getFullYear();

      const existingRentForDueDate = tenantRents.find(
        (rent) => rent.month === dueMonth && rent.year === dueYear
      );

      // If there's no existing rent record for the due date, or it's not paid
      if (!existingRentForDueDate) {
        // This is an upcoming due rent that needs to be created
        if (nextDueDate <= thirtyDaysFromNow && nextDueDate >= today) {
          upcomingDueRents.push({
            tenant: {
              _id: tenant._id,
              name: tenant.name,
              phone: tenant.phone,
              joiningDate: tenant.joiningDate,
            },
            room: {
              _id: tenant.roomId._id,
              floorNumber: tenant.roomId.floorNumber,
              roomNumber: tenant.roomId.roomNumber,
              rentAmount: tenant.roomId.rentAmount,
            },
            dueDate: nextDueDate,
            amount: tenant.roomId.rentAmount,
            month: dueMonth,
            year: dueYear,
          });
        }
      } else if (!existingRentForDueDate.isPaid) {
        // This is an existing rent record that's not paid
        if (existingRentForDueDate.dueDate < today) {
          // It's overdue
          overdueRents.push({
            _id: existingRentForDueDate._id,
            tenant: {
              _id: tenant._id,
              name: tenant.name,
              phone: tenant.phone,
              joiningDate: tenant.joiningDate,
            },
            room: {
              _id: tenant.roomId._id,
              floorNumber: tenant.roomId.floorNumber,
              roomNumber: tenant.roomId.roomNumber,
              rentAmount: tenant.roomId.rentAmount,
            },
            dueDate: existingRentForDueDate.dueDate,
            amount: existingRentForDueDate.amount,
            month: existingRentForDueDate.month,
            year: existingRentForDueDate.year,
            daysPastDue: Math.floor(
              (today - new Date(existingRentForDueDate.dueDate)) /
                (1000 * 60 * 60 * 24)
            ),
          });
        } else {
          // It's upcoming but already created
          upcomingDueRents.push({
            _id: existingRentForDueDate._id,
            tenant: {
              _id: tenant._id,
              name: tenant.name,
              phone: tenant.phone,
              joiningDate: tenant.joiningDate,
            },
            room: {
              _id: tenant.roomId._id,
              floorNumber: tenant.roomId.floorNumber,
              roomNumber: tenant.roomId.roomNumber,
              rentAmount: tenant.roomId.rentAmount,
            },
            dueDate: existingRentForDueDate.dueDate,
            amount: existingRentForDueDate.amount,
            month: existingRentForDueDate.month,
            year: existingRentForDueDate.year,
            existingRecord: true,
          });
        }
      }

      // Also check for any other unpaid rents for this tenant
      tenantRents.forEach((rent) => {
        if (
          !rent.isPaid &&
          (rent.month !== dueMonth || rent.year !== dueYear) && // Not the one we just processed
          rent.dueDate < today
        ) {
          // It's in the past

          // Add to overdue rents if not already included
          if (
            !overdueRents.some(
              (overdue) => overdue._id.toString() === rent._id.toString()
            )
          ) {
            overdueRents.push({
              _id: rent._id,
              tenant: {
                _id: tenant._id,
                name: tenant.name,
                phone: tenant.phone,
                joiningDate: tenant.joiningDate,
              },
              room: {
                _id: tenant.roomId._id,
                floorNumber: tenant.roomId.floorNumber,
                roomNumber: tenant.roomId.roomNumber,
                rentAmount: tenant.roomId.rentAmount,
              },
              dueDate: rent.dueDate,
              amount: rent.amount,
              month: rent.month,
              year: rent.year,
              daysPastDue: Math.floor(
                (today - new Date(rent.dueDate)) / (1000 * 60 * 60 * 24)
              ),
            });
          }
        }
      });
    }
  }

  // Sort upcoming due rents by due date (ascending)
  upcomingDueRents.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Sort overdue rents by days past due (descending)
  overdueRents.sort((a, b) => b.daysPastDue - a.daysPastDue);

  res.status(200).json({
    success: true,
    data: {
      totalRooms,
      occupiedRooms,
      totalTenants,
      pendingRents,
      upcomingDueRents,
      overdueRents,
    },
  });
});
