# DocConverter Style Guide

Dokumentasi komprehensif untuk desain sistem DocConverter.

---

## 🎨 Color Palette

### Primary Colors

| Nama | Variabel CSS | Hex | Preview |
|------|--------------|-----|---------|
| Background Primary | `--bg-primary` | `#0a0b14` | ![#0a0b14](https://via.placeholder.com/20/0a0b14/0a0b14) |
| Background Secondary | `--bg-secondary` | `#0f1629` | ![#0f1629](https://via.placeholder.com/20/0f1629/0f1629) |
| Background Card | `--bg-card` | `#131a2e` | ![#131a2e](https://via.placeholder.com/20/131a2e/131a2e) |
| Border Color | `--border-color` | `#1e293b` | ![#1e293b](https://via.placeholder.com/20/1e293b/1e293b) |

### Text Colors

| Nama | Variabel CSS | Hex |
|------|--------------|-----|
| Text Primary | `--text-primary` | `#ffffff` |
| Text Secondary | `--text-secondary` | `#94a3b8` |

### Accent Colors

| Nama | Variabel CSS | Hex | Penggunaan |
|------|--------------|-----|------------|
| Accent Blue | `--accent-blue` | `#3b82f6` | Buttons, links, progress bar |
| Accent Blue Hover | `--accent-blue-hover` | `#2563eb` | Button hover state |
| Success Green | `--success-green` | `#22c55e` | Success messages |
| Error Red | `--error-red` | `#ef4444` | Error messages |

---

## 📝 Typography

### Font Family

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Font Sizes

| Nama | Class | Size | Penggunaan |
|------|-------|------|------------|
| Hero Title | `text-3xl sm:text-4xl md:text-5xl` | 30px → 48px | Judul utama halaman |
| Logo Text | `text-base sm:text-lg` | 16px → 18px | Nama aplikasi di header |
| Body | `text-sm sm:text-base` | 14px → 16px | Teks konten utama |
| Small | `text-xs sm:text-sm` | 12px → 14px | Label, captions |

### Font Weights

| Nama | Class | Weight |
|------|-------|--------|
| Normal | `font-normal` | 400 |
| Medium | `font-medium` | 500 |
| Semibold | `font-semibold` | 600 |
| Bold | `font-bold` | 700 |

---

## 🧩 Components

### 1. Card

```css
.card {
  background: var(--bg-card);       /* #131a2e */
  border: 1px solid var(--border-color);
  border-radius: 16px;
}
```

**Penggunaan:** Container utama untuk konten

---

### 2. Upload Zone

```css
.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: var(--accent-blue);
  background: rgba(59, 130, 246, 0.05);
}
```

**States:**
- Default: Border dashed abu-abu
- Hover: Border biru dengan background subtle
- Drag Over: Sama dengan hover + scale effect

---

### 3. Buttons

#### Primary Button

```css
.btn-primary {
  background: var(--accent-blue);    /* #3b82f6 */
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
}
```

**Penggunaan:** CTA utama (Convert, Submit)

#### Secondary Button

```css
.btn-secondary {
  background: var(--bg-secondary);   /* #0f1629 */
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 12px 24px;
  border-radius: 8px;
}
```

**Penggunaan:** Aksi sekunder (Download, Cancel)

---

### 4. File Item

```css
.file-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
```

**Status Classes:**
- `.status-ready` → Text abu-abu
- `.status-converting` → Text biru + animasi pulse
- `.status-success` → Text hijau
- `.status-error` → Text merah

---

### 5. Progress Bar

```css
.progress-bar {
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
}

.progress-bar-fill {
  height: 100%;
  background: var(--accent-blue);
  transition: width 0.3s ease;
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Max-Width | Target |
|------------|-----------|--------|
| Desktop | - | > 768px |
| Tablet | `768px` | iPad, tablet |
| Mobile | `480px` | Smartphone |
| Extra Small | `360px` | Small phones |

### Tailwind Prefix

```tsx
// Mobile first → Desktop
className="text-xs sm:text-sm md:text-base lg:text-lg"
//          mobile  640px+   768px+     1024px+
```

---

## 🎭 Animations

### Pulse (Loading)

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Spin (Loading Icon)

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Button Press Effect

```css
.btn-primary:active,
.btn-secondary:active {
  transform: scale(0.95);
}
```

---

## 🔤 Icon Set

Semua icon menggunakan **SVG inline** dengan class:
- `w-4 h-4` → Small (buttons)
- `w-5 h-5` → Medium (file icons)
- `w-7 h-7` → Large (upload zone)

### File Type Icons

| Type | Color Class |
|------|-------------|
| Word (.docx) | `text-blue-400` on `bg-blue-500/20` |
| Excel (.xlsx) | `text-green-400` on `bg-green-500/20` |
| PDF (.pdf) | `text-red-400` on `bg-red-500/20` |
| Default | `text-gray-400` on `bg-gray-500/20` |

---

## 📐 Spacing Guidelines

| Nama | Size | Penggunaan |
|------|------|------------|
| xs | 4px | Icon gaps |
| sm | 8px | Element padding |
| md | 12px | Card internal padding (mobile) |
| lg | 16px | Section padding |
| xl | 24px | Card padding (desktop) |
| 2xl | 32px | Section margins |
| 3xl | 48px | Page margins |

---

*Dokumentasi ini dibuat untuk proyek tugas Kelompok 4 TI - DocConverter*
