import React, { useState } from 'react'
import { FaUser, FaKey } from 'react-icons/fa'

const Profile = ({ auth }) => {
  const { admin, updateProfile, updatePassword } = auth
  
  const [profileData, setProfileData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    pgName: admin?.pgName || '',
    address: admin?.address || '',
    phone: admin?.phone || ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  
  const { name, email, pgName, address, phone } = profileData
  const { currentPassword, newPassword, confirmPassword } = passwordData
  
  const onProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }
  
  const onPasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }
  
  const onProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    await updateProfile(profileData)
    setProfileLoading(false)
  }
  
  const onPasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    
    setPasswordLoading(true)
    await updatePassword({ currentPassword, newPassword })
    setPasswordLoading(false)
    
    // Clear password fields after submission
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Profile Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaUser className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
          </div>
          
          <form onSubmit={onProfileSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onProfileChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onProfileChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="pgName" className="block text-sm font-medium text-gray-700 mb-1">
                PG Name
              </label>
              <input
                type="text"
                id="pgName"
                name="pgName"
                value={pgName}
                onChange={onProfileChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={onProfileChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={onProfileChange}
                className="form-input"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={profileLoading}
              className="btn btn-primary w-full"
            >
              {profileLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
        
        {/* Change Password */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaKey className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
          </div>
          
          <form onSubmit={onPasswordSubmit}>
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{passwordError}</span>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={onPasswordChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={onPasswordChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onPasswordChange}
                className="form-input"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={passwordLoading}
              className="btn btn-primary w-full"
            >
              {passwordLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
