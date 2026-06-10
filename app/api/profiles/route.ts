import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Profile from '@/models/Profile';
import cloudinary from '@/lib/cloudinary';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SeninSifren123";

export async function GET() {
  try {
    await connectDB();
    const profiles = await Profile.find().sort({ createdAt: -1 });
    return NextResponse.json(profiles);
  } catch (e) {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const fd = await req.formData();

    if (fd.get('password') !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Şifre yanlış' }, { status: 401 });
    }

    const files = fd.getAll('photos') as File[];
    const photoUrls: string[] = [];

    for (const file of files) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'discovery' },
            (err, res) => {
              if (err) reject(err);
              else resolve(res);
            }
          ).end(buffer);
        });

        photoUrls.push(result.secure_url);
      }
    }

    const profile = await Profile.create({
      name: fd.get('name'),
      age: fd.get('age'),
      city: fd.get('city'),
      bio: fd.get('bio'),
      whatsapp: fd.get('whatsapp'),
      telegram: fd.get('telegram'),
      photos: photoUrls,
    });

    return NextResponse.json(profile);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    if (searchParams.get('password') !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Şifre yanlış' }, { status: 401 });
    }

    await Profile.findByIdAndDelete(searchParams.get('id'));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}