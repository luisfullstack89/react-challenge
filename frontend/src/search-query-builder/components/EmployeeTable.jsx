// EmployeeTable.js
import React from 'react';
import './EmployeeTable.css';

const EmployeeTable = ({employees}) => {
  

  return (
    <div className="table-container">
      <div className="table-row header">
        <div className="table-cell">Employee Name</div>
        <div className="table-cell">Technology</div>
        <div className="table-cell">Contact</div>
      </div>
      {employees.map((employee, index) => (
        <div className="table-row" key={index}>
          <div className="table-cell">{employee.name}</div>
          <div className="table-cell">{employee.categories}</div>
          <div className="table-cell">{employee.phoneNumber}</div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeTable;
