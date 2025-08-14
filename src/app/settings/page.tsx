'use client';

import Sidebar from '@/components/Sidebar';
import { useState, useRef } from 'react';
import { Camera, User, Mail, Briefcase, FileText, Save, Upload } from 'lucide-react';

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    name: 'Swastika Pradhan',
    email: '',
    role: '',
    description: '',
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setTimeout(() => setIsUploading(false), 1000);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    console.log('Saved data:', formData);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
      
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Profile Settings</h1>
              <p className="text-slate-600 mt-1">Manage your personal information and preferences</p>
            </div>
            
          </div>
        </div>

        
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
              <div className="px-8 py-6 border-b border-slate-200">
                <h2 className="text-lg font-medium text-slate-900">Profile Picture</h2>
                <p className="text-sm text-slate-600 mt-1">Update your profile photo</p>
              </div>
              <div className="px-8 py-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={preview || '/api/placeholder/96/96'}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Change Photo
                    </button>
                    <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="px-8 py-6 border-b border-slate-200">
                <h2 className="text-lg font-medium text-slate-900">Personal Information</h2>
                <p className="text-sm text-slate-600 mt-1">Update your personal details and information</p>
              </div>
              
              <div className="px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your email address"
                    />
                  </div>

                 
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      Job Title / Role
                    </label>
                    <input
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your job title or role"
                    />
                  </div>

                 
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      About You
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell us about yourself, your experience, and what makes you unique..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-2">Maximum 500 characters</p>
                  </div>
                </div>

                
                <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center px-6 py-2.5 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}