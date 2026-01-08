import { NextResponse } from 'next/server';

// Supported file extensions and their ConvertAPI source formats
const SUPPORTED_FORMATS: Record<string, string> = {
    '.docx': 'docx',
    '.doc': 'doc',
    '.xlsx': 'xlsx',
    '.xls': 'xls',
    '.pptx': 'pptx',
    '.ppt': 'ppt',
};

export async function POST(req: Request) {
    try {
        const apiSecret = process.env.CONVERT_API_SECRET;

        if (!apiSecret) {
            console.error('CONVERT_API_SECRET not found');
            return NextResponse.json(
                { error: "API key tidak dikonfigurasi" },
                { status: 500 }
            );
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: "File tidak ditemukan" },
                { status: 400 }
            );
        }

        console.log('Processing file:', file.name, 'Size:', file.size);

        // Get file extension
        const filename = file.name.toLowerCase();
        const ext = Object.keys(SUPPORTED_FORMATS).find(e => filename.endsWith(e));

        if (!ext) {
            return NextResponse.json(
                { error: "Format file tidak didukung. Gunakan DOCX, DOC, XLSX, XLS, PPTX, atau PPT." },
                { status: 400 }
            );
        }

        const sourceFormat = SUPPORTED_FORMATS[ext];
        console.log('Source format:', sourceFormat);

        // Convert File object to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString('base64');

        // Use ConvertAPI REST API with proper format
        const convertApiUrl = `https://v2.convertapi.com/convert/${sourceFormat}/to/pdf?Secret=${apiSecret}&StoreFile=true`;

        console.log('Calling ConvertAPI:', convertApiUrl.replace(apiSecret, '***'));

        const response = await fetch(convertApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                Parameters: [
                    {
                        Name: 'File',
                        FileValue: {
                            Name: file.name,
                            Data: base64Data
                        }
                    },
                    {
                        Name: 'StoreFile',
                        Value: true
                    }
                ]
            })
        });

        console.log('ConvertAPI response status:', response.status);

        const responseText = await response.text();
        console.log('ConvertAPI raw response:', responseText.substring(0, 500));

        let result;
        try {
            result = JSON.parse(responseText);
        } catch {
            console.error('Failed to parse response as JSON');
            return NextResponse.json(
                { error: "Invalid response from conversion service" },
                { status: 500 }
            );
        }

        if (!response.ok) {
            console.error('ConvertAPI error:', result);
            return NextResponse.json(
                { error: "Gagal konversi: " + (result.Message || result.error || 'Unknown API error') },
                { status: 500 }
            );
        }

        console.log('ConvertAPI success result:', JSON.stringify(result, null, 2));

        if (result.Files && result.Files.length > 0) {
            const pdfUrl = result.Files[0].Url;
            console.log('PDF URL:', pdfUrl);

            return NextResponse.json({
                url: pdfUrl,
                originalName: file.name,
                originalSize: file.size,
            });
        } else {
            console.error('No Files in result:', result);
            return NextResponse.json(
                { error: "Konversi gagal - tidak ada hasil" },
                { status: 500 }
            );
        }
    } catch (error: unknown) {
        console.error('Conversion error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return NextResponse.json(
            { error: "Gagal konversi: " + errorMessage },
            { status: 500 }
        );
    }
}