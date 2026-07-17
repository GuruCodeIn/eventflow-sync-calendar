import emailjs from '@emailjs/browser';

export interface EmailJSParams {
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

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

let initialized = false;

const ensureInitialized = () => {
  if (!initialized && PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY);
    initialized = true;
  }
};

export const sendEmailViaEmailJS = async (params: EmailJSParams): Promise<boolean> => {
  try {
    ensureInitialized();

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.warn('EmailJS is not configured. Missing VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID or VITE_EMAILJS_PUBLIC_KEY.');
      return false;
    }

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

    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log('EmailJS send result:', result);
    return result.status === 200;
  } catch (error) {
    console.error('EmailJS send error:', error);
    return false;
  }
};
