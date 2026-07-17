import { sendEmailViaEmailJS, type EmailJSParams } from './emailjsService';

export type EmailParams = EmailJSParams;

export const sendEmail = async (params: EmailParams): Promise<boolean> => {
  return sendEmailViaEmailJS(params);
};

interface EventShareDetails {
  id?: string;
  title: string;
  start: string;
  end: string;
  location?: string;
}

// Event sharing email
export const sendEventShareEmail = async (
  eventDetails: EventShareDetails,
  recipientEmail: string,
  senderEmail: string,
  senderName: string,
  permission: 'view' | 'edit',
  invitationMessage?: string,
): Promise<boolean> => {
  const startDate = new Date(eventDetails.start);
  const endDate = new Date(eventDetails.end);

  const event_date = startDate.toLocaleDateString();
  const event_time = `${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const event_link = eventDetails.id
    ? `${origin}/?eventId=${encodeURIComponent(eventDetails.id)}`
    : origin || '';

  return sendEmail({
    to_email: recipientEmail,
    reply_to: senderEmail,
    inviter_name: senderName,
    event_title: eventDetails.title,
    event_date,
    event_time,
    event_location: eventDetails.location || 'No location specified',
    permission_type: permission,
    message: invitationMessage?.trim()
      ? invitationMessage
      : `${senderName} has invited you to their event "${eventDetails.title}".`,
    event_link,
  });
};
