import React, { useState, useEffect } from 'react';
import { Employee, STATES } from '../types';
import { Upload, X, MapPin } from 'lucide-react';
import CustomSelect, { Option } from './CustomSelect';

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

  const stateOptions: Option[] = STATES.map(s => ({
    value: s,
    label: s,
    icon: MapPin
  }));

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 relative flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white">
          <div>
             <h2 className="text-xl font-bold text-slate-900">
               {isEdit ? 'Edit Profile' : 'New Employee'}
             </h2>
             <p className="text-sm text-slate-500 mt-1">
               {isEdit ? 'Update employee details and settings.' : 'Add a new employee to the organization.'}
             </p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-50">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row">
            {/* Left Sidebar: Photo & Status */}
            <div className="w-full md:w-1/3 p-8 bg-slate-50 border-r border-slate-100 flex flex-col items-center">
               <div className="relative group cursor-pointer mb-6">
                 <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                   {preview ? (
                     <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                       <Upload size={32} />
                       <span className="text-xs font-medium mt-2">Upload Photo</span>
                     </div>
                   )}
                 </div>
                 <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
                 </div>
                 {errors.photo && <p className="text-red-500 text-xs text-center mt-2 absolute -bottom-6 w-full">{errors.photo}</p>}
               </div>
               
               <p className="text-sm text-slate-500 text-center mb-8 px-4">
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br/> Max size of 5 MB
               </p>

               <div className="w-full mt-auto">
                 <label className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors shadow-sm">
                    <div>
                        <span className="block text-sm font-medium text-slate-900">Account Status</span>
                        <span className="block text-xs text-slate-500 mt-0.5">{formData.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={e => setFormData({...formData, isActive: e.target.checked})}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                 </label>
               </div>
            </div>

            {/* Right Content: Form Fields */}
            <div className="w-full md:w-2/3 p-8">
              <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-6 flex items-center">
                <span className="bg-blue-500 w-2 h-0.5 mr-2"></span> Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className={`block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900 transition-all ${errors.firstName ? 'border-red-300' : 'border-slate-300 hover:border-blue-400'}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className={`block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900 transition-all ${errors.lastName ? 'border-red-300' : 'border-slate-300 hover:border-blue-400'}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className={`block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900 transition-all ${errors.email ? 'border-red-300' : 'border-slate-300 hover:border-blue-400'}`}
                    placeholder="name@company.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({...formData, dob: e.target.value})}
                    className={`block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900 transition-all ${errors.dob ? 'border-red-300' : 'border-slate-300 hover:border-blue-400'}`}
                  />
                  {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                </div>

                <div className="z-10">
                   <CustomSelect 
                    label="State"
                    value={formData.state}
                    onChange={(val) => setFormData({...formData, state: val})}
                    options={stateOptions}
                    placeholder="Select State"
                    error={errors.state}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <label className="block text-sm font-medium text-slate-700 mb-4">Gender</label>
                <div className="flex space-x-6">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label key={g} className="flex items-center cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={e => setFormData({...formData, gender: e.target.value as any})}
                          className="appearance-none h-4 w-4 border border-slate-300 rounded-full bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all cursor-pointer"
                        />
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 checked:opacity-100">
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </span>
                      </div>
                      <span className="ml-2 text-sm text-slate-700 group-hover:text-blue-700 transition-colors font-medium">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md"
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