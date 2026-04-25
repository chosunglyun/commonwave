import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { Readable } from 'stream';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')
  : undefined;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey,
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_ad_${file.name.replace(/\s+/g, '_')}`;

    // 1️⃣ Google Drive 업로드 (원본 보관)
    try {
      await drive.files.create({
        requestBody: { 
          name: `[AD_ORIGINAL]_${fileName}`, 
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || ''] 
        },
        media: { mimeType: file.type, body: Readable.from(buffer) },
      });
    } catch (driveErr) {
      console.error('Google Drive Ad Upload Error:', driveErr);
    }

    // 2️⃣ Supabase Storage 업로드 (최적화)
    // 광고 이미지는 대략 800px 너비로 최적화
    const optimizedBuffer = await sharp(buffer)
      .resize(800, null, { withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const { error: storageError } = await supabaseAdmin.storage
      .from('images')
      .upload(`ads/${fileName}`, optimizedBuffer, { 
        contentType: 'image/jpeg', 
        upsert: true 
      });

    if (storageError) throw storageError;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(`ads/${fileName}`);

    return NextResponse.json({ url: publicUrl });

  } catch (error: any) {
    console.error('Ad Upload API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
