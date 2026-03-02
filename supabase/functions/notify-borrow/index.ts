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

    const WEB3FORMS_API_KEY = Deno.env.get("WEB3FORMS_API_KEY");

    if (!WEB3FORMS_API_KEY) {
      console.error("WEB3FORMS_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send notification to library
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_API_KEY,
        subject: `📚 New Borrowing: ${bookTitle}`,
        from_name: "Green Clover Library",
        to: "greencloverlibrary@gmail.com",
        "Book Title": bookTitle,
        "Borrower Name": borrowerName,
        "Borrower Email": borrowerEmail,
        "Start Date": startDate,
        "Return Date": endDate,
        message: `${borrowerName} (${borrowerEmail}) has borrowed "${bookTitle}" from ${startDate} to ${endDate}.`,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      console.error("Web3Forms error:", result);
      return new Response(
        JSON.stringify({ success: false, error: result.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
