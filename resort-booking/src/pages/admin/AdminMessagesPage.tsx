import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useSiteData } from '../../context/SiteDataContext';

const AdminMessagesPage: React.FC = () => {
  const { contactMessages, deleteContactMessage } = useSiteData();

  return (
    <AdminLayout currentPage="messages">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact messages</h1>
      <p className="text-gray-600 mb-8">Enquiries submitted from the public contact form.</p>

      {contactMessages.length === 0 ? (
        <p className="text-gray-500 bg-white rounded-xl p-8 text-center border">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {contactMessages.map((msg) => (
            <article key={msg.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <h2 className="font-bold text-gray-900">{msg.name}</h2>
                <div className="flex items-center gap-3">
                  <time className="text-sm text-gray-500">{new Date(msg.createdAt).toLocaleString()}</time>
                  <button
                    type="button"
                    onClick={() => window.confirm('Delete this message?') && deleteContactMessage(msg.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{msg.email}{msg.phone ? ` · ${msg.phone}` : ''}</p>
              <p className="text-sm font-medium text-airbnb-red mb-3">{msg.subject}</p>
              <p className="text-gray-700 whitespace-pre-line">{msg.message}</p>
            </article>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMessagesPage;
