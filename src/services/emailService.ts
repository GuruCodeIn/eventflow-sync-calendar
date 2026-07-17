import { sendEmailViaEmailJS, type EmailJSParams } from './emailjsService';

export interface EmailParams extends EmailJSParams {}

export const sendEmail = async (params: EmailParams): Promise<boolean> => {
  return sendEmailViaEmailJS(params);
};

// Event sharing email
export const sendEventShareEmail = async (
  eventDetails: {
    title: string;
    start: string;
    end: string;
    location?: string;
  },
  recipientEmail: string,
  senderEmail: string,
  senderName: string,
  permission: 'view' | 'edit'
): Promise<boolean> => {
  const eventDate = new Date(eventDetails.start).toLocaleDateString();
  const eventTime = `${new Date(eventDetails.start).toLocaleTimeString()} - ${new Date(eventDetails.end).toLocaleTimeString()}`;

  return sendEmail({
    to_email: recipientEmail,
    from_email: senderEmail,
    from_name: senderName,
    subject: `Calendar Event Shared: ${eventDetails.title}`,
    message: `${senderName} has shared a calendar event with you.`,
    event_title: eventDetails.title,
    event_date: eventDate,
    event_time: eventTime,
    event_location: eventDetails.location || 'No location specified',
    permission_type: permission,
  });
};

// Account creation welcome email
export const sendWelcomeEmail = async (
  userEmail: string,
  userName: string
): Promise<boolean> => {
  return sendEmail({
    to_email: userEmail,
    from_email: 'guruprasadhm486@gmail.com', // Testing email
    from_name: 'Calendar System',
    subject: 'Welcome to Calendar System!',
    message: `Welcome ${userName}! Your account has been successfully created. You can now start managing your events and sharing calendars.`,
  });
};

// Password change notification email
export const sendPasswordChangeEmail = async (
  userEmail: string,
  userName: string
): Promise<boolean> => {
  return sendEmail({
    to_email: userEmail,
    from_email: 'guruprasadhm486@gmail.com', // Testing email
    from_name: 'Calendar System',
    subject: 'Password Changed Successfully',
    message: `Hello ${userName}, your password has been successfully changed. If you didn't make this change, please contact support immediately.`,
  });
};
