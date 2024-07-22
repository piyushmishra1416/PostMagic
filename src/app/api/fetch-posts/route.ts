import { NextResponse, NextRequest } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs';


const credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_CREDENTIALS as string, 'utf-8'));

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
