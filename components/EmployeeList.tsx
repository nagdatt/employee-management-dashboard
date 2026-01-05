import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { deleteEmployee, toggleEmployeeStatus } from '../store/employeeSlice';
import { Employee } from '../types';
import { Edit2, Trash2, Printer, Search, User, Users, Activity, CheckCircle, XCircle } from 'lucide-react';
import CustomSelect, { Option } from './CustomSelect';

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

  const genderOptions: Option[] = [
    { value: 'All', label: 'All Genders', icon: Users },
    { value: 'Male', label: 'Male', icon: User },
    { value: 'Female', label: 'Female', icon: User },
    { value: 'Other', label: 'Other', icon: User },
  ];

  const statusOptions: Option[] = [
    { value: 'All', label: 'All Status', icon: Activity },
    { value: 'Active', label: 'Active', icon: CheckCircle },
    { value: 'Inactive', label: 'Inactive', icon: XCircle },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-visible">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center print:hidden">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 shadow-sm transition-all"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-20">
          <div className="w-full sm:w-48">
            <CustomSelect
              value={filterGender}
              onChange={setFilterGender}
              options={genderOptions}
            />
          </div>
          <div className="w-full sm:w-48">
            <CustomSelect
              value={filterStatus}
              onChange={setFilterStatus}
              options={statusOptions}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">DOB</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">State</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider print:hidden">Actions</th>
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
                          <img className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm" src={employee.photo} alt="" />
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
                    <span className="inline-flex items-center">
                       {employee.gender}
                    </span>
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
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 shadow-sm ${
                        employee.isActive 
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {employee.isActive ? (
                        <CheckCircle size={14} className="mr-1" />
                      ) : (
                        <XCircle size={14} className="mr-1" />
                      )}
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium print:hidden">
                    <div className="flex items-center justify-end space-x-3">
                       <button onClick={() => onEdit(employee)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handlePrintRow(employee)} className="text-slate-500 hover:text-slate-800 bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors" title="Print Details">
                        <Printer size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirmId(employee.id)} className="text-red-500 hover:text-red-800 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-lg font-medium">No employees found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl transform scale-100 transition-all">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Delete</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-sm transition-colors"
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