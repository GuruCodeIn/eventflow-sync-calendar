import emailjs from '@emailjs/browser';

// EmailJS configuration
const SERVICE_ID = 'service_249o3xl';
const TEMPLATE_ID = 'template_r5dloqc';
const PUBLIC_KEY = 'DCQE-TWIHeOdlaV8M';

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

export interface EmailParams {
  to_email: string;
  to_name?: string;
  from_email: string;
  from_name: string;
  subject: string;
  message: string;
  event_title?: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  permission_type?: string;
}

export const sendEmail = async (params: EmailParams): Promise<void> => {
  try {
    const templateParams = {
      to_email: params.to_email,
      to_name: params.to_name || params.to_email,
      from_email: params.from_email,
      from_name: params.from_name,
      subject: params.subject,
      message: params.message,
      event_title: params.event_title || '',
      event_date: params.event_date || '',
      event_time: params.event_time || '',
      event_location: params.event_location || '',
      permission_type: params.permission_type || '',
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
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
): Promise<void> => {
  const eventDate = new Date(eventDetails.start).toLocaleDateString();
  const eventTime = `${new Date(eventDetails.start).toLocaleTimeString()} - ${new Date(eventDetails.end).toLocaleTimeString()}`;
  
  await sendEmail({
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
): Promise<void> => {
  await sendEmail({
    to_email: userEmail,
    from_email: 'noreply@calendarsystem.com',
    from_name: 'Calendar System',
    subject: 'Welcome to Calendar System!',
    message: `Welcome ${userName}! Your account has been successfully created. You can now start managing your events and sharing calendars.`,
  });
};

// Password change notification email
export const sendPasswordChangeEmail = async (
  userEmail: string,
  userName: string
): Promise<void> => {
  await sendEmail({
    to_email: userEmail,
    from_email: 'noreply@calendarsystem.com',
    from_name: 'Calendar System',
    subject: 'Password Changed Successfully',
    message: `Hello ${userName}, your password has been successfully changed. If you didn't make this change, please contact support immediately.`,
  });
};