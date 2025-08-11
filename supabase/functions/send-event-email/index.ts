import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Try multiple possible secret names
const apiKey = Deno.env.get("RESEND_API_KEY") || 
               Deno.env.get("RESEND_API-KEY") || 
               Deno.env.get("resend_api");

console.log("Edge function called - send-event-email");
console.log("Available env vars:", Object.keys(Deno.env.toObject()).filter(key => key.toLowerCase().includes('resend')));
console.log("API Key found:", apiKey ? "YES" : "NO");

if (!apiKey) {
  console.error("No RESEND API key found in environment variables");
}

const resend = new Resend(apiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: EmailRequest = await req.json();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          Calendar Event Shared
        </h2>
        
        <p style="font-size: 16px; color: #555;">
          Hello ${emailData.to_name || 'there'},
        </p>
        
        <p style="font-size: 16px; color: #555;">
          ${emailData.message}
        </p>
        
        ${emailData.event_title ? `
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Event Details:</h3>
          <p><strong>Title:</strong> ${emailData.event_title}</p>
          ${emailData.event_date ? `<p><strong>Date:</strong> ${emailData.event_date}</p>` : ''}
          ${emailData.event_time ? `<p><strong>Time:</strong> ${emailData.event_time}</p>` : ''}
          ${emailData.event_location ? `<p><strong>Location:</strong> ${emailData.event_location}</p>` : ''}
          ${emailData.permission_type ? `<p><strong>Permission:</strong> ${emailData.permission_type}</p>` : ''}
        </div>
        ` : ''}
        
        <p style="font-size: 16px; color: #555;">
          You can now view this event in your calendar.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #777;">
          Best regards,<br>
          ${emailData.from_name}<br>
          Calendar App
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: `Calendar App <noreply@resend.dev>`,
      to: [emailData.to_email],
      subject: emailData.subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);