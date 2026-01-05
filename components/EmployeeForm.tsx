import React, { useState, useEffect } from 'react';
import { Employee, STATES } from '../types';
import { Upload, X } from 'lucide-react';

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: Employee) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit, onCancel, isEdit }) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'Male',
    dob: '',
    state: '',
    photo: '',
    isActive: true,
  });
  const [preview, setPreview] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof Employee, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        gender: initialData.gender,
        dob: initialData.dob,
        state: initialData.state,
        photo: initialData.photo,
        isActive: initialData.isActive,
      });
      setPreview(initialData.photo);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) {
        setErrors(prev => ({ ...prev, photo: 'Image size should be less than 5MB' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setFormData(prev => ({ ...prev, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Employee, string>> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.state) newErrors.state = 'State is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        id: initialData?.id || Date.now().toString(),
        ...formData
      } as Employee);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden my-8">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-800">
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image Upload Section */}
            <div className="md:col-span-2 flex flex-col items-center justify-center mb-4">
               <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-300 relative mb-3">
                 {preview ? (
                   <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-400">
                     <Upload size={32} />
                   </div>
                 )}
               </div>
               <label className="cursor-pointer bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                 <span>Upload Photo</span>
                 <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
               </label>
               {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900 ${errors.firstName ? 'border-red-300' : 'border-slate-300'}`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900 ${errors.lastName ? 'border-red-300' : 'border-slate-300'}`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900 ${errors.email ? 'border-red-300' : 'border-slate-300'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={e => setFormData({...formData, dob: e.target.value})}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900 ${errors.dob ? 'border-red-300' : 'border-slate-300'}`}
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <div className="flex space-x-4 mt-2">
                {['Male', 'Female', 'Other'].map((g) => (
                  <label key={g} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={e => setFormData({...formData, gender: e.target.value as any})}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 bg-white"
                    />
                    <span className="ml-2 text-sm text-slate-700">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
              <select
                value={formData.state}
                onChange={e => setFormData({...formData, state: e.target.value})}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900 ${errors.state ? 'border-red-300' : 'border-slate-300'}`}
              >
                <option value="">Select a state</option>
                {STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 bg-white"
                />
                <span className="text-sm font-medium text-slate-700">Active Employee</span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEdit ? 'Save Changes' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;