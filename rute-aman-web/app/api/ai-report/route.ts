import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Ekstrak body dari request
    const body = await req.json();
    const { ceritaUser } = body;

    // Pastikan API Key ada
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API Key Gemini belum disetting' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const promptConfig = `
      Kamu adalah asisten ekstraksi data untuk aplikasi Rute Aman.
      Analisis cerita kejadian berikut dan ubah menjadi format JSON.
      
      Cerita pengguna: "${ceritaUser}"

      Aturan JSON:
      - "kategori_masalah": Wajib pilih salah satu persis dari opsi ini: ["Kriminalitas", "Penerangan", "Infrastruktur", "Lainnya"].
      - "judul_laporan": Buat judul singkat, jelas, dan representatif (maksimal 60 karakter).
      - "deskripsi_detail": Rapikan tata bahasa pengguna menjadi lebih formal, jelas, lengkap, namun tetap mempertahankan fakta asli dari cerita.

      Kembalikan HANYA format JSON valid tanpa format markdown (jangan gunakan \`\`\`json), tanpa penjelasan tambahan.
    `;

    const result = await model.generateContent(promptConfig);
    const responseText = result.response.text();
    
    // Membersihkan teks berjaga-jaga jika AI mengembalikan markdown backticks
      const cleanJsonString = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const dataAI = JSON.parse(cleanJsonString);

    return NextResponse.json(dataAI);

  } catch (error) {
    console.error("Error AI:", error);
    return NextResponse.json({ error: 'Gagal memproses narasi dengan AI' }, { status: 500 });
  }
}