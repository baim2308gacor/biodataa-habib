import { NextRequest, NextResponse } from "next/server";

const profileContext = `
Informasi terverifikasi tentang Habib Hasibuan:
- Tanggal lahir: 20 Oktober 2010.
- Tempat lahir: Medan.
- Hobi: olahraga dan game.
- Cita-cita: menjadi pengusaha.
- Riwayat sekolah yang diberikan: SD Dahlia, SMP Al Washliyah, SMK S Teladan P Siantar.
- Instagram: @habibb_tk.
- WhatsApp: nomor yang dicantumkan pada situs portfolio.
Jangan mengarang detail pribadi, prestasi, sifat, pengalaman, usia terkini, atau hal lain yang tidak tercantum.
Kalau ditanya hal yang belum diketahui, katakan dengan santai bahwa informasinya belum dicantumkan dan arahkan pengunjung untuk menghubungi Habib.
Kamu adalah asisten informasi untuk membantu pengunjung mengenal profil Habib, bukan Habib sendiri. Jangan mengaku sebagai Habib, jangan mengklaim punya kesadaran atau pengalaman pribadi. Jawab dalam bahasa Indonesia yang natural, hangat, singkat, dan tidak kaku. Hindari gaya promosi berlebihan dan bahasa korporat.
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) return NextResponse.json({ error: "Format pesan tidak valid." }, { status: 400 });
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Asisten belum diatur. Silakan coba lagi nanti." }, { status: 503 });
    const model = "openai/gpt-oss-120b";
    const safeMessages = messages.slice(-12).filter((m: { role?: string; content?: string }) =>
      ["user", "assistant"].includes(m.role || "") && typeof m.content === "string"
    ).map((m: {role: string; content: string}) => ({ role: m.role, content: m.content.slice(0, 1500) }));
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: profileContext }, ...safeMessages],
        temperature: 0.55,
        max_completion_tokens: 600
      })
    });
    if (!response.ok) {
      console.error("Groq API returned", response.status);
      return NextResponse.json({ error: "Asistennya lagi belum bisa menjawab. Coba lagi sebentar." }, { status: 502 });
    }
    const data = await response.json();
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || "Maaf, aku belum menemukan jawaban untuk itu." });
  } catch {
    return NextResponse.json({ error: "Ada kendala saat memproses pesan." }, { status: 500 });
  }
}