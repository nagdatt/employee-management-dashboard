import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Employee, EmployeeState } from '../types';

const loadEmployees = (): Employee[] => {
  const stored = localStorage.getItem('employees');
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    {
      id: '1001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      gender: 'Male',
      dob: '1990-05-15',
      state: 'Maharashtra',
      photo: 'https://picsum.photos/100/100?random=1',
      isActive: true,
    },
    {
      id: '1002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      gender: 'Female',
      dob: '1985-08-22',
      state: 'Karnataka',
      photo: 'https://picsum.photos/100/100?random=2',
      isActive: true,
    },
    {
      id: '1003',
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.j@example.com',
      gender: 'Male',
      dob: '1992-11-30',
      state: 'Delhi',
      photo: 'https://picsum.photos/100/100?random=3',
      isActive: false,
    }
  ];
};

const initialState: EmployeeState = {
  employees: loadEmployees(),
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
      localStorage.setItem('employees', JSON.stringify(state.employees));
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
        localStorage.setItem('employees', JSON.stringify(state.employees));
      }
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(e => e.id !== action.payload);
      localStorage.setItem('employees', JSON.stringify(state.employees));
    },
    toggleEmployeeStatus: (state, action: PayloadAction<string>) => {
      const employee = state.employees.find(e => e.id === action.payload);
      if (employee) {
        employee.isActive = !employee.isActive;
        localStorage.setItem('employees', JSON.stringify(state.employees));
      }
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus } = employeeSlice.actions;
export default employeeSlice.reducer;
