import { NextResponse } from "next/server";

export async function GET() {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    version: process.env.npm_package_version || "0.1.0",
    environment: process.env.NODE_ENV || "development",
    services: {
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
        status: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? "ready"
          : "not configured",
      },
      stripe: {
        status: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          ? "configured"
          : "not configured",
      },
      googleMaps: {
        status: process.env.GOOGLE_MAPS_API_KEY
          ? "configured"
          : "not configured",
      },
    },
  };

  return NextResponse.json(healthCheck);
}

// Allow CORS for health checks
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
