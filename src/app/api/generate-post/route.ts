import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const {
  GOOGLE_TYPE,
  GOOGLE_PROJECT_ID,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_CLIENT_ID,
  GOOGLE_AUTH_URI,
  GOOGLE_TOKEN_URI,
  GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  GOOGLE_CLIENT_X509_CERT_URL,
  SPREADSHEET_ID
} = process.env;


const credentials = {
  type: GOOGLE_TYPE,
  project_id: GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: GOOGLE_CLIENT_EMAIL,
  client_id: GOOGLE_CLIENT_ID,
  auth_uri: GOOGLE_AUTH_URI,
  token_uri: GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: GOOGLE_CLIENT_X509_CERT_URL,
};

const auth = new google.auth.JWT(
   credentials.client_email,
   undefined,
   credentials.private_key,
   ['https://www.googleapis.com/auth/spreadsheets']
 );

 const spreadsheetId = process.env.SPREADSHEET_ID as string;

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  console.log("Prompt:", prompt);
  const customprompt = `generate a social media post based on the following prompt: ${prompt}`;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API key is not defined");
    return NextResponse.json(
      { error: "API key is not defined" },
      { status: 500 }
    );
  }

  try {
    console.log("Initializing GoogleGenerativeAI with API key...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Model initialized. Generating content...");
    const result = await model.generateContent(customprompt);
    const response = result.response;

    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from the AI model");
    }

    const text = response.text();
    console.log(text);

    const sheets = google.sheets({ version: 'v4', auth });
    const timestamp = new Date().toISOString();

    const values = [
      [timestamp, prompt, text]
    ];

    
    const requestBody = {
      range: 'Sheet1!A:C', // Assuming the columns are A (Timestamp), B (Prompt), C (Post)
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values,
      },
    };

  
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      ...requestBody,
    });

    console.log('Post saved to Google Sheets');
    return NextResponse.json({ post: text });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error generating post" },
      { status: 500 }
    );
  }
}
