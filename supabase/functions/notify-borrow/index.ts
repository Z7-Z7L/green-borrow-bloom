import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookTitle, borrowerName, borrowerEmail, startDate, endDate } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured, logging notification instead:");
      console.log(`Book borrowed: "${bookTitle}" by ${borrowerName} (${borrowerEmail})`);
      console.log(`Period: ${startDate} to ${endDate}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Notification logged (email not configured)" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailBody = `
      <h2>📚 New Book Borrowing Notification</h2>
      <p><strong>Book:</strong> ${bookTitle}</p>
      <p><strong>Borrower:</strong> ${borrowerName}</p>
      <p><strong>Email:</strong> ${borrowerEmail}</p>
      <p><strong>Start Date:</strong> ${startDate}</p>
      <p><strong>Return Date:</strong> ${endDate}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Green Clover Library <onboarding@resend.dev>",
        to: ["green-clover-library@gmail.com"],
        subject: `📚 New Borrowing: ${bookTitle}`,
        html: emailBody,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Email send failed [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error sending notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
