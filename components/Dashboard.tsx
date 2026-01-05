import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { addEmployee, updateEmployee } from '../store/employeeSlice';
import { Employee } from '../types';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import { LogOut, Plus, Users, UserCheck, UserX, Printer } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { employees } = useSelector((state: RootState) => state.employees);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Employee | null>(null);

  const activeCount = employees.filter(e => e.isActive).length;
  const inactiveCount = employees.length - activeCount;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleAddEmployee = (data: Employee) => {
    dispatch(addEmployee(data));
    setShowForm(false);
  };

  const handleEditEmployee = (data: Employee) => {
    dispatch(updateEmployee(data));
    setShowForm(false);
    setEditData(null);
  };

  const openEditModal = (employee: Employee) => {
    setEditData(employee);
    setShowForm(true);
  };

  const handlePrintList = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">HR Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 hidden md:block">Welcome, {user?.email}</span>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your employees and view statistics.</p>
          </div>
          <div className="flex gap-3">
             <button
              onClick={handlePrintList}
              className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Printer className="-ml-1 mr-2 h-4 w-4" />
              Print List
            </button>
            <button
              onClick={() => { setEditData(null); setShowForm(true); }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:hidden">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Users size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">Total Employees</p>
                <p className="text-2xl font-semibold text-slate-900">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <UserCheck size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">Active</p>
                <p className="text-2xl font-semibold text-slate-900">{activeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <UserX size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">Inactive</p>
                <p className="text-2xl font-semibold text-slate-900">{inactiveCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee List Table Component */}
        <div className="print:block">
           <div className="hidden print:block mb-6">
             <h1 className="text-2xl font-bold">Employee List Report</h1>
             <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
           </div>
           <EmployeeList onEdit={openEditModal} />
        </div>
      </main>

      {/* Modals */}
      {showForm && (
        <EmployeeForm
          initialData={editData}
          onSubmit={editData ? handleEditEmployee : handleAddEmployee}
          onCancel={() => { setShowForm(false); setEditData(null); }}
          isEdit={!!editData}
        />
      )}
    </div>
  );
};

export default Dashboard;
