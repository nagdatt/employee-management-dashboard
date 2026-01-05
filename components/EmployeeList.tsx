import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { deleteEmployee, toggleEmployeeStatus } from '../store/employeeSlice';
import { Employee } from '../types';
import { Edit2, Trash2, Printer, Search, User, Users, Activity, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterGender, filterStatus]);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'All' || emp.gender === filterGender;
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Active' && emp.isActive) || 
                         (filterStatus === 'Inactive' && !emp.isActive);
    return matchesSearch && matchesGender && matchesStatus;
  });

  const sortedEmployees = [...filteredEmployees].reverse();

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = sortedEmployees.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteEmployee(id));
    setDeleteConfirmId(null);
    if (currentEmployees.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePrintRow = (employee: Employee) => {
    const printWindow = window.open('', '', 'height=800,width=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>ID Card - ${employee.firstName} ${employee.lastName}</title>
            <style>
              @page { margin: 0; size: auto; }
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background-color: #f1f5f9; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                margin: 0; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .card {
                background: white;
                width: 320px;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                border: 1px solid #e2e8f0;
                position: relative;
              }
              .card-header {
                height: 100px;
                background-color: #2563eb;
                position: relative;
              }
              .card-header::after {
                content: '';
                position: absolute;
                bottom: -20px;
                left: 0;
                right: 0;
                height: 40px;
                background: white;
                border-radius: 50% 50% 0 0;
              }
              .photo-wrapper {
                position: absolute;
                top: 40px;
                left: 50%;
                transform: translateX(-50%);
                width: 110px;
                height: 110px;
                border-radius: 50%;
                border: 4px solid white;
                overflow: hidden;
                background: #f8fafc;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                z-index: 10;
              }
              .photo {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              .card-body {
                padding: 60px 24px 24px;
                text-align: center;
              }
              .name {
                font-size: 20px;
                font-weight: 700;
                color: #0f172a;
                margin-bottom: 4px;
              }
              .designation {
                font-size: 14px;
                color: #64748b;
                margin-bottom: 16px;
              }
              .divider {
                height: 1px;
                background: #e2e8f0;
                margin: 16px 0;
              }
              .details {
                text-align: left;
                font-size: 13px;
              }
              .detail-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                color: #334155;
              }
              .label {
                color: #64748b;
                font-weight: 500;
              }
              .value {
                font-weight: 600;
                text-align: right;
                max-width: 150px;
                word-wrap: break-word;
              }
              .status-tag {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 9999px;
                font-size: 12px;
                font-weight: 600;
                background-color: ${employee.isActive ? '#dcfce7' : '#fee2e2'};
                color: ${employee.isActive ? '#166534' : '#991b1b'};
              }
              .footer {
                background: #f8fafc;
                padding: 12px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
                font-size: 11px;
                color: #94a3b8;
              }
              .logo-text {
                position: absolute;
                top: 15px;
                width: 100%;
                text-align: center;
                color: white;
                font-weight: 600;
                font-size: 14px;
                letter-spacing: 1px;
                text-transform: uppercase;
              }
              @media print {
                body { background: white; -webkit-print-color-adjust: exact; }
                .card { box-shadow: none; border: 1px solid #ccc; }
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="card-header">
                <div class="logo-text">EMPLOYEE IDENTITY</div>
                <div class="photo-wrapper">
                  ${employee.photo ? `<img src="${employee.photo}" class="photo" alt="Profile" />` : '<div style="width:100%;height:100%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:40px;">👤</div>'}
                </div>
              </div>
              <div class="card-body">
                <div class="name">${employee.firstName} ${employee.lastName}</div>
                <div class="designation">Employee ID: ${employee.id}</div>
                <div style="margin-top:8px;">
                   <span class="status-tag">${employee.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
                
                <div class="divider"></div>
                
                <div class="details">
                  <div class="detail-item">
                    <span class="label">Email</span>
                    <span class="value">${employee.email}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Gender</span>
                    <span class="value">${employee.gender}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">DOB</span>
                    <span class="value">${employee.dob}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">State</span>
                    <span class="value">${employee.state}</span>
                  </div>
                </div>
              </div>
              <div class="footer">
                Authorized Personnel Only
              </div>
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                   window.print();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
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
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-visible print:border-none print:shadow-none">
      <style>{`
        @media print {
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0 !important; color: black; -webkit-print-color-adjust: exact; }
          .print-hidden { display: none !important; }
        }
      `}</style>
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 print:border-collapse">
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
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-9 w-9">
                        {employee.photo ? (
                          <img className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-sm" src={employee.photo} alt="" />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <User size={18} />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{employee.firstName} {employee.lastName}</div>
                        <div className="text-xs text-slate-500">{employee.email}</div>
                        <div className="text-[10px] text-slate-400">ID: {employee.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500">
                    <span className="inline-flex items-center">
                       {employee.gender}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500">
                    {employee.dob}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500">
                    {employee.state}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <label className="relative inline-flex items-center cursor-pointer print:hidden">
                        <input
                            type="checkbox"
                            checked={employee.isActive}
                            onChange={() => dispatch(toggleEmployeeStatus(employee.id))}
                            className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-red-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                      <span className={`text-xs font-medium w-14 text-left ${employee.isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium print:hidden">
                    <div className="flex items-center justify-end space-x-2">
                       <button onClick={() => onEdit(employee)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-full hover:bg-blue-100 transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handlePrintRow(employee)} className="text-slate-500 hover:text-slate-800 bg-slate-100 p-1.5 rounded-full hover:bg-slate-200 transition-colors" title="Print Details">
                        <Printer size={14} />
                      </button>
                      <button onClick={() => setDeleteConfirmId(employee.id)} className="text-red-500 hover:text-red-800 bg-red-50 p-1.5 rounded-full hover:bg-red-100 transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-10 w-10 text-slate-300 mb-4" />
                    <p className="text-lg font-medium">No employees found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sortedEmployees.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{startIndex + 1}</span> to <span className="font-medium text-slate-900">{Math.min(startIndex + itemsPerPage, sortedEmployees.length)}</span> of <span className="font-medium text-slate-900">{sortedEmployees.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${currentPage === 1 ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-slate-300 text-slate-600 hover:bg-white hover:text-blue-600'}`}
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="hidden sm:flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <span className="sm:hidden text-sm font-medium text-slate-700">
                Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${currentPage === totalPages ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-slate-300 text-slate-600 hover:bg-white hover:text-blue-600'}`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

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