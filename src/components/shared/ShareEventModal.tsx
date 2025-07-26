
import React, { useState } from 'react';
import { X, Mail, UserPlus, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { shareEvent, getEvents } from '@/api/events';
import { sendEventShareEmail } from '@/services/emailService';
import { useAuth } from '@/contexts/AuthContext';

interface ShareEventModalProps {
  onClose: () => void;
  eventId?: string;
}

const ShareEventModal: React.FC<ShareEventModalProps> = ({ onClose, eventId }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to share events');
      return;
    }

    setLoading(true);

    try {
      if (eventId) {
        // Share the event via API
        await shareEvent(eventId, email, permission);
        
        // Get event details for email
        const events = await getEvents();
        const eventToShare = events.find(event => event._id === eventId);
        
        if (eventToShare) {
          // Send email notification
          try {
            await sendEventShareEmail(
              {
                title: eventToShare.title,
                start: eventToShare.start,
                end: eventToShare.end,
                location: eventToShare.location
              },
              email,
              user.email,
              user.name,
              permission
            );
          } catch (emailError) {
            console.error('Failed to send share email:', emailError);
            // Continue without failing the whole operation
          }
        }
      }
      
      toast.success('Event shared successfully! Email notification sent.');
      onClose();
    } catch (error) {
      console.error('Error sharing event:', error);
      toast.error('Failed to share event or send email notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Share Calendar</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserPlus className="h-4 w-4 inline mr-1" />
              Permission Level
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="permission"
                  value="view"
                  checked={permission === 'view'}
                  onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <strong>View only</strong> - Can see events but not edit
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="permission"
                  value="edit"
                  checked={permission === 'edit'}
                  onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <strong>Can edit</strong> - Can view and modify events
                </span>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-1">What happens next?</h4>
            <p className="text-sm text-blue-700">
              We'll send an invitation email to <strong>{email || 'the recipient'}</strong> with {permission} access to your calendar.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <>Loading...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareEventModal;
