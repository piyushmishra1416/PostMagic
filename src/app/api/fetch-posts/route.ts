import { NextResponse, NextRequest } from 'next/server';
import { google } from 'googleapis';
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

export async function GET() {
  try {
    const sheets = google.sheets({ version: 'v4', auth });

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:C',
    });

    const rows = result.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ posts: [] });
    }

    const posts = rows.map(row => ({
      timestamp: row[0],
      prompt: row[1],
      post: row[2]
    }));

    return NextResponse.json({ posts });

  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}
