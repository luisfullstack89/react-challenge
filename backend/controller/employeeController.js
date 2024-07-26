const Employee = require("../model/employeeModel");

exports.getEmployees = async (req, res, next) => {
  try {
    const { categories } = req.query;
    console.log("These are the categories:", categories);

    const getEmp = await Employee.find({ categories: categories });
    console.log("This is the employee:", getEmp);

    res.json({
      message: "Got the employee",
      emp: getEmp,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.postEmployee = async (req, res, next) => {
  try {
    const {
      name,
      department,
      email,
      phoneNumber,
      joiningDate,
      gender,
      employementStatus,
      experience,
      position,
    } = req.body;

    const employee = await Employee.create({
      name,
      department,
      email,
      phoneNumber,
      joiningDate,
      gender,
      employementStatus,
      experience,
      position,
    });

    await employee.save();

    res.json({
      message: "employee Created!",
      employee: employee,
    });
  } catch (error) {
    next(error);
  }
};
