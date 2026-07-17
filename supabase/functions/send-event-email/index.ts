import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY missing");
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resend = new Resend(apiKey);
    const emailData: EmailRequest = await req.json();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          Calendar Event Shared
        </h2>
        <p style="font-size: 16px; color: #555;">Hello ${emailData.to_name || 'there'},</p>
        <p style="font-size: 16px; color: #555;">${emailData.message}</p>
        ${emailData.event_title ? `
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Event Details</h3>
          <p><strong>Title:</strong> ${emailData.event_title}</p>
          ${emailData.event_date ? `<p><strong>Date:</strong> ${emailData.event_date}</p>` : ''}
          ${emailData.event_time ? `<p><strong>Time:</strong> ${emailData.event_time}</p>` : ''}
          ${emailData.event_location ? `<p><strong>Location:</strong> ${emailData.event_location}</p>` : ''}
          ${emailData.permission_type ? `<p><strong>Permission:</strong> ${emailData.permission_type}</p>` : ''}
        </div>` : ''}
        <p style="font-size: 14px; color: #777;">
          Shared by ${emailData.from_name} (${emailData.from_email})<br/>
          EventFlow Calendar
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: "EventFlow Calendar <onboarding@resend.dev>",
      to: [emailData.to_email],
      reply_to: emailData.from_email,
      subject: emailData.subject,
      html,
    });

    if ((result as any).error) {
      console.error("Resend error:", (result as any).error);
      return new Response(
        JSON.stringify({ error: (result as any).error.message || "Failed to send email", details: (result as any).error }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email sent:", result);
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("send-event-email error:", error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
