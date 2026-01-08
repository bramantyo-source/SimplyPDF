import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('url');
    const fileName = searchParams.get('name') || 'document.pdf';

    if (!fileUrl) return NextResponse.json({ error: 'URL missing' }, { status: 400 });

    try {
        const response = await fetch(fileUrl);
        const blob = await response.arrayBuffer();

        return new NextResponse(blob, {
            headers: {
                'Content-Type': 'application/pdf',
                // Nama file dipasang di sini agar Windows mengenali ekstensinya
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({ error: 'Gagal ambil file' }, { status: 500 });
    }
}