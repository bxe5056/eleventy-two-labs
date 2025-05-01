import { NextRequest, NextResponse } from "next/server";

// AWS SDK v3 imports for Amazon Translate
import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

// AWS credentials would be set via environment variables
// AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
const translateClient = new TranslateClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { text, sourceLang, targetLang } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.warn("AWS credentials not set - returning mock translation");
      return NextResponse.json({
        translatedText: `[Mock translation of: ${text}]`,
        source: "mock",
      });
    }

    try {
      // Create the command for translation
      const command = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: sourceLang === "auto" ? "auto" : sourceLang,
        TargetLanguageCode: targetLang,
      });

      // Execute the translation
      const response = await translateClient.send(command);
      const translatedText = response.TranslatedText;

      return NextResponse.json({
        translatedText,
        source: "amazon",
      });
    } catch (awsError) {
      console.error("AWS Translate API error:", awsError);

      // Fall back to mock translation in case of AWS error
      return NextResponse.json({
        translatedText: `[Mock translation of: ${text}]`,
        source: "mock",
        error: "AWS translation failed, using mock",
      });
    }
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
