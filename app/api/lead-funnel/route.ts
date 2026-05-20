import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY || "");

interface LeadData {
  service: string;
  subService: string;
  companyName: string;
  deliveryDate: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

export async function POST(request: Request) {
  try {
    const data: LeadData = await request.json();

    // Validate required fields
    if (!data.service || !data.subService || !data.companyName || !data.fullName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log the lead data
    console.log("========== NEW LEAD SUBMISSION ==========");
    console.log("Service Requested:", data.service);
    console.log("Sub-Service:", data.subService);
    console.log("Company Name:", data.companyName);
    console.log("Expected Delivery Date:", data.deliveryDate);
    console.log("Client Name:", data.fullName);
    console.log("Email Address:", data.email);
    console.log("Phone Number:", data.phone);
    console.log("Additional Notes:", data.notes);
    console.log("Submitted on:", new Date().toLocaleString());
    console.log("==========================================");

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured. Please contact the administrator." },
        { status: 500 }
      );
    }

    // Send email notification using Resend
    await resend.emails.send({
      from: "Amolex Website <onboarding@resend.dev>",
      to: "amolexdigitaltech@outlook.com",
      subject: `New Lead: ${data.service} - ${data.companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🎉 New Lead Submission</h2>
              <p style="margin: 5px 0 0 0;">Amolex Digital Technologies</p>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Service Requested:</span>
                <span class="value"> ${data.service} - ${data.subService}</span>
              </div>
              <div class="field">
                <span class="label">Company Name:</span>
                <span class="value"> ${data.companyName}</span>
              </div>
              <div class="field">
                <span class="label">Expected Delivery:</span>
                <span class="value"> ${data.deliveryDate}</span>
              </div>
              <div class="field">
                <span class="label">Client Name:</span>
                <span class="value"> ${data.fullName}</span>
              </div>
              <div class="field">
                <span class="label">Email Address:</span>
                <span class="value"> <a href="mailto:${data.email}">${data.email}</a></span>
              </div>
              <div class="field">
                <span class="label">Phone Number:</span>
                <span class="value"> ${data.phone}</span>
              </div>
              ${data.notes ? `
              <div class="field">
                <span class="label">Additional Notes:</span>
                <span class="value"> ${data.notes}</span>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Submitted on: ${new Date().toLocaleString()}</p>
              <p>This is an automated notification from your website lead form.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully via Resend to amolexdigitaltech@outlook.com");

    return NextResponse.json({ 
      success: true, 
      message: "Thank you! Your inquiry has been submitted successfully. Our team will contact you shortly." 
    });
  } catch (error) {
    console.error("Error processing lead:", error);
    return NextResponse.json(
      { error: "Failed to process lead" },
      { status: 500 }
    );
  }
}
