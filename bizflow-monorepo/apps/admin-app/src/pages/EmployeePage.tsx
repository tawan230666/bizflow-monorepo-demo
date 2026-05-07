import React from 'react';

type EmployeeStatus = 'working' | 'available' | 'resting';

interface Employee {
  id: string;
  name: string;
  role: string;
  status: EmployeeStatus;
}

const mockEmployees: Employee[] = [
  { id: 'E001', name: 'สมชาย รักดี', role: 'แคชเชียร์', status: 'working' },
  { id: 'E002', name: 'สมหญิง ขยันยิ่ง', role: 'พนักงานจัดสต๊อก', status: 'available' },
  { id: 'E003', name: 'วิชัย ใจสู้', role: 'ผู้จัดการสาขา', status: 'resting' },
];

const statusConfig = {
  working: { label: 'ทำงานอยู่', color: '#10b981', bg: '#d1fae5' }, // Green
  available: { label: 'ว่างอยู่', color: '#3b82f6', bg: '#dbeafe' }, // Blue
  resting: { label: 'พักงาน/ลางาน', color: '#f59e0b', bg: '#fef3c7' }, // Yellow/Orange
};

export default function EmployeePage() {
  return (
    <div className="page-container">
      <h2>👥 รายชื่อพนักงานและสถานะ</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อ-นามสกุล</th>
            <th>ตำแหน่ง</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {mockEmployees.map((emp) => {
            const statusStyle = statusConfig[emp.status];
            return (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.role}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ color: statusStyle.color, backgroundColor: statusStyle.bg }}
                  >
                    {statusStyle.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
