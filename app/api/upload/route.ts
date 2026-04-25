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
    const bucket = formData.get('bucket') as string || 'article-images';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    // 1️⃣ Google Drive 업로드 (고해상도 원본 보관)
    let highResUrl = '';
    try {
      const driveResponse = await drive.files.create({
        requestBody: { 
          name: `[ORIGINAL]_${fileName}`, 
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || ''] 
        },
        media: { mimeType: file.type, body: Readable.from(buffer) },
        fields: 'id, webViewLink',
      });
      highResUrl = driveResponse.data.webViewLink || '';
    } catch (driveErr) {
      console.error('Google Drive Upload Error:', driveErr);
    }

    // 2️⃣ Supabase Storage 업로드 (웹 최적화 저해상도)
    let lowResUrl = '';
    try {
      // 이미지 리사이징 (최대 너비 1400px, 품질 80%)
      const optimizedBuffer = await sharp(buffer)
        .resize(1400, null, { withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      const { error: storageError } = await supabaseAdmin.storage
        .from(bucket)
        .upload(`optimized/${fileName}`, optimizedBuffer, { 
          contentType: 'image/jpeg', 
          upsert: true 
        });

      if (!storageError) {
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from(bucket)
          .getPublicUrl(`optimized/${fileName}`);
        lowResUrl = publicUrl;
      }
    } catch (storageErr) {
      console.error('Image Optimization Error:', storageErr);
    }

    return NextResponse.json({ 
      success: true, 
      highResUrl, // 구글 드라이브 원본 링크
      lowResUrl,  // 사이트용 최적화 링크
      fileName 
    });

  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
