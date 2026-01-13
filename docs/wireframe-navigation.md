# DocConverter - Wireframe & Arsitektur Navigasi

Dokumentasi wireframe dan alur navigasi aplikasi DocConverter.

---

## 🗺️ Arsitektur Navigasi

```mermaid
flowchart TD
    subgraph "DocConverter App"
        A[Homepage] --> B[Upload Zone]
        B --> C{File Valid?}
        C -->|Ya| D[File List]
        C -->|Tidak| E[Error Toast]
        D --> F[Convert Button]
        F --> G[Converting...]
        G --> H{Success?}
        H -->|Ya| I[Download Ready]
        H -->|Tidak| J[Error + Retry]
        I --> K[Download Single]
        I --> L[Download All ZIP]
    end
```

---

## 📱 Wireframe Layout

### Desktop Layout (> 768px)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] DocConverter                      [Log In] [Sign Up]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Document to PDF                          │
│           Fast, secure, and high-quality...                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │              [Cloud Icon]                           │   │
│  │         Click to upload documents                   │   │
│  │      or drag and drop files here                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [DOC] document.docx   2.5MB • Ready          [X]    │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [XLS] data.xlsx       1.2MB • Converting... 45%     │   │
│  │ [=========>                                    ]    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│            [Download All]    [Convert All to PDF →]        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  © 2026 Kelompok 4 TI        Privacy | Terms | Contact      │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 480px)

```
┌──────────────────────────┐
│ [Logo] DocConverter      │
│              [Login][Up] │
├──────────────────────────┤
│                          │
│    Document to PDF       │
│   Fast, secure, and...   │
│                          │
│ ┌──────────────────────┐ │
│ │    [Cloud Icon]      │ │
│ │  Click to upload     │ │
│ │  or drag and drop    │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │[DOC] doc.docx   [X]  │ │
│ │      1.2MB • Ready   │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │   [Download All]     │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ [Convert All to PDF] │ │
│ └──────────────────────┘ │
│                          │
├──────────────────────────┤
│  © 2026 Kelompok 4 TI    │
│  Privacy | Terms | Contact│
└──────────────────────────┘
```

---

## 🔄 User Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant API as /api/convert
    participant External as ConvertAPI

    User->>UI: Upload dokumen (drag/click)
    UI->>UI: Validasi ekstensi file
    UI->>UI: Tampilkan di file list
    User->>UI: Klik "Convert All"
    UI->>API: POST /api/convert (FormData)
    API->>External: POST ConvertAPI (base64)
    External-->>API: Return PDF URL
    API-->>UI: Return { url, originalName }
    UI->>UI: Update status "Success"
    User->>UI: Klik "Download"
    UI->>UI: Trigger download via /api/download
```

---

## 📐 Halaman Struktur

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Homepage | `/` | Halaman utama dengan upload dan konversi |

### Komponen Utama

1. **Header** - Logo + Auth buttons
2. **Hero Section** - Title + subtitle
3. **Upload Card** - Drop zone + file list + actions
4. **Footer** - Copyright + links

---

## 🎯 Status File

| Status | Visual | Aksi |
|--------|--------|------|
| Ready | Gray dot | Remove, Convert |
| Converting | Blue pulse + progress bar | - |
| Success | Green checkmark | Download, Remove |
| Error | Red X | Retry, Remove |

---

*Dokumentasi ini dibuat untuk proyek tugas Kelompok 4 TI - DocConverter*
