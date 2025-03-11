"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoPersonOutline, IoKeyOutline, IoAlertCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

interface ProfileData {
    username: string;
    lastLoginAt: string | null;
}

export default function Profile() {
    const [profileData, setProfileData] = useState<ProfileData>({ username: '', lastLoginAt: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [usernameFormData, setUsernameFormData] = useState({
        newUsername: '',
        currentPassword: '',
    });

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/api/auth/me');
            const data = await response.json();

            if (response.ok) {
                setProfileData(data);
                setUsernameFormData(prev => ({ ...prev, newUsername: data.username }));
            } else {
                setError('Failed to fetch profile data');
            }
        } catch (err) {
            setError('An error occurred while fetching profile data');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordFormData.currentPassword,
                    newPassword: passwordFormData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Password updated successfully');
                setPasswordFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                setError(data.error || 'Failed to update password');
            }
        } catch (err) {
            setError('An error occurred while updating password');
        }
    };

    const handleUsernameChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/auth/change-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usernameFormData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Username updated successfully');
                setProfileData(prev => ({ ...prev, username: usernameFormData.newUsername }));
                setUsernameFormData(prev => ({ ...prev, currentPassword: '' }));
                fetchProfileData();
            } else {
                setError(data.error || 'Failed to update username');
            }
        } catch (err) {
            setError('An error occurred while updating username');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto p-6 space-y-8"
        >
            {/* Profile Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <IoPersonOutline className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Profile Settings
                        </h2>
                        <p className="text-gray-500">Manage your account information</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-600">Current Username</label>
                        <p className="mt-1 text-lg font-semibold">{profileData.username}</p>
                    </div>
                    {profileData.lastLoginAt && (
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="text-sm font-medium text-gray-600">Last Login</label>
                            <p className="mt-1 font-medium text-gray-700">
                                {new Date(profileData.lastLoginAt).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Username Change Form */}
            <form onSubmit={handleUsernameChange} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <IoPersonOutline className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Change Username</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Username
                        </label>
                        <input
                            type="text"
                            value={usernameFormData.newUsername}
                            onChange={(e) => setUsernameFormData({ ...usernameFormData, newUsername: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={usernameFormData.currentPassword}
                            onChange={(e) => setUsernameFormData({ ...usernameFormData, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Update Username
                    </button>
                </div>
            </form>

            {/* Password Change Form */}
            <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <IoKeyOutline className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Change Password</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={passwordFormData.currentPassword}
                            onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={passwordFormData.newPassword}
                            onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={passwordFormData.confirmPassword}
                            onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Update Password
                    </button>
                </div>
            </form>

            {/* Error and Success Messages */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl"
                >
                    <IoAlertCircleOutline className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </motion.div>
            )}

            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-xl"
                >
                    <IoCheckmarkCircleOutline className="w-5 h-5 flex-shrink-0" />
                    <p>{successMessage}</p>
                </motion.div>
            )}
        </motion.div>
    );
} 