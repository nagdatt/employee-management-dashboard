import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { deleteEmployee, toggleEmployeeStatus } from '../store/employeeSlice';
import { Employee } from '../types';
import { Edit2, Trash2, Printer, Search, MoreVertical, ToggleLeft, ToggleRight, User, Eye, EyeOff } from 'lucide-react';
import EmployeeForm from './EmployeeForm';

interface EmployeeListProps {
  onEdit: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ onEdit }) => {
  const employees = useSelector((state: RootState) => state.employees.employees);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'All' || emp.gender === filterGender;
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Active' && emp.isActive) || 
                         (filterStatus === 'Inactive' && !emp.isActive);
    return matchesSearch && matchesGender && matchesStatus;
  });

  const handleDelete = (id: string) => {
    dispatch(deleteEmployee(id));
    setDeleteConfirmId(null);
  };

  const handlePrintRow = (employee: Employee) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Employee Details - ${employee.firstName} ${employee.lastName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
              .profile-img { width: 150px; height: 150px; object-fit: cover; border-radius: 50%; margin: 0 auto; display: block; }
              .details { margin-top: 20px; }
              .row { display: flex; margin-bottom: 10px; }
              .label { font-weight: bold; width: 150px; }
              .status { font-weight: bold; color: ${employee.isActive ? 'green' : 'red'}; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Employee Profile</h1>
            </div>
            ${employee.photo ? `<img src="${employee.photo}" class="profile-img" alt="Profile" />` : ''}
            <div class="details">
              <div class="row"><span class="label">Employee ID:</span> <span>${employee.id}</span></div>
              <div class="row"><span class="label">Full Name:</span> <span>${employee.firstName} ${employee.lastName}</span></div>
              <div class="row"><span class="label">Email:</span> <span>${employee.email}</span></div>
              <div class="row"><span class="label">Gender:</span> <span>${employee.gender}</span></div>
              <div class="row"><span class="label">Date of Birth:</span> <span>${employee.dob}</span></div>
              <div class="row"><span class="label">State:</span> <span>${employee.state}</span></div>
              <div class="row"><span class="label">Status:</span> <span class="status">${employee.isActive ? 'Active' : 'Inactive'}</span></div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Search and Filters */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center print:hidden">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="block w-full md:w-auto pl-3 pr-8 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-900"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="block w-full md:w-auto pl-3 pr-8 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-900"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Gender</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">DOB</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">State</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider print:hidden">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {employee.photo ? (
                          <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={employee.photo} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{employee.firstName} {employee.lastName}</div>
                        <div className="text-sm text-slate-500">{employee.email}</div>
                        <div className="text-xs text-slate-400">ID: {employee.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {employee.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {employee.dob}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {employee.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                      onClick={() => dispatch(toggleEmployeeStatus(employee.id))}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        employee.isActive 
                        ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                      } transition-colors cursor-pointer`}
                    >
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium print:hidden">
                    <div className="flex items-center justify-end space-x-3">
                       <button onClick={() => onEdit(employee)} className="text-blue-600 hover:text-blue-900" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handlePrintRow(employee)} className="text-slate-500 hover:text-slate-800" title="Print Details">
                        <Printer size={18} />
                      </button>
                      <button onClick={() => setDeleteConfirmId(employee.id)} className="text-red-500 hover:text-red-800" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                  No employees found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Delete</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;