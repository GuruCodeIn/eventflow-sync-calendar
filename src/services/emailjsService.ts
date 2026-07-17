import emailjs from '@emailjs/browser';

export interface EmailJSParams {
  to_email: string;
  reply_to: string;
  inviter_name: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_location: string;
  permission_type: string;
  message: string;
  event_link: string;
}

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

let initialized = false;

const ensureInitialized = () => {
  if (!initialized && PUBLIC_KEY) {
    emailjs.init({ publicKey: PUBLIC_KEY });
    initialized = true;
  }
};

export const sendEmailViaEmailJS = async (params: EmailJSParams): Promise<boolean> => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS is not configured. Missing VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID or VITE_EMAILJS_PUBLIC_KEY.');
    throw new Error('EmailJS is not configured');
  }

  ensureInitialized();

  // Pass variables using EXACT names defined in the EmailJS template.
  // Include common aliases (email, user_email) so the template's "To Email"
  // field resolves regardless of which variable name the template uses.
  const templateParams = {
    to_email: params.to_email,
    email: params.to_email,
    user_email: params.to_email,
    recipient: params.to_email,
    reply_to: params.reply_to,
    inviter_name: params.inviter_name,
    event_title: params.event_title,
    event_date: params.event_date,
    event_time: params.event_time,
    event_location: params.event_location,
    permission_type: params.permission_type,
    message: params.message,
    event_link: params.event_link,
  };

  try {
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
    });
    console.log('EmailJS send result:', result);
    return result.status === 200;
  } catch (error: any) {
    const detail = error?.text || error?.message || JSON.stringify(error);
    console.error('EmailJS send error:', detail, error);
    throw new Error(`EmailJS: ${detail}`);
  }
};

