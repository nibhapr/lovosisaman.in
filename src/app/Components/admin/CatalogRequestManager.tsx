"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CatalogRequest {
  _id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  productName: string;
  catalogUrl: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

export default function CatalogRequestManager() {
  const [requests, setRequests] = useState<CatalogRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<CatalogRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/catalog-requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching catalog requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'sent' | 'failed') => {
    try {
      const response = await fetch(`/api/catalog-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const updatedRequests = requests.map(req => 
          req._id === id ? { ...req, status } : req
        );
        setRequests(updatedRequests);
        
        if (selectedRequest && selectedRequest._id === id) {
          setSelectedRequest({
            ...selectedRequest,
            status
          });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Catalog Requests</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                onClick={() => setSelectedRequest(request)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedRequest?._id === request._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{request.fullName}</h4>
                    <p className="text-sm text-gray-600">{request.companyName}</p>
                    <p className="text-sm text-gray-500">{request.productName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    request.status === 'sent' ? 'bg-green-100 text-green-800' :
                    request.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedRequest && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Request Details</h3>
            <div className="space-y-4">
              <DetailField label="Full Name" value={selectedRequest.fullName} />
              <DetailField label="Company" value={selectedRequest.companyName} />
              <DetailField label="Email" value={selectedRequest.email} />
              <DetailField label="Phone" value={selectedRequest.phone} />
              <DetailField label="Product" value={selectedRequest.productName} />
              <DetailField label="Catalog URL" value={selectedRequest.catalogUrl} />
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => updateStatus(selectedRequest._id, e.target.value as 'pending' | 'sent' | 'failed')}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {label === "Catalog URL" ? (
        <a 
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-blue-600 hover:text-blue-800 hover:underline block"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1">{value}</p>
      )}
    </div>
  );
} 