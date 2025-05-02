import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get parameters from query
    const url = new URL(request.url);
    const agentId = url.searchParams.get("agent_id");
    const mockMode = url.searchParams.get("mock_mode") === "true";

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    // If mock mode is enabled, return a fake signed URL
    if (mockMode) {
      console.log("Using mock signed URL for ElevenLabs");
      return NextResponse.json({
        signedUrl:
          "https://mock-elevenlabs-url.example.com?mock=true&agent_id=" +
          agentId,
      });
    }

    // Get the API key from environment variables
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured on server" },
        { status: 500 }
      );
    }

    // Call ElevenLabs API to get signed URL
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `ElevenLabs API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
