# 💒 Duy & Chi — Wedding Website

Website thiệp cưới online xây dựng bằng Next.js 14 + Sanity CMS, chạy local qua Docker.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **CMS**: Sanity v3
- **Local Dev**: Docker + Docker Compose
- **Deploy**: Vercel

---

## Bắt đầu

### 1. Tạo project Sanity

Truy cập [sanity.io](https://sanity.io), tạo project mới, lấy **Project ID**.

### 2. Tạo file `.env.local`

```bash
cp .env.local.example .env.local
```

Điền các giá trị vào `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skXXXX...   # Token có quyền write
NEXT_PUBLIC_WEDDING_DATE=2025-12-07T10:00:00+07:00
```

> Tạo **write token** trong Sanity dashboard → Settings → API → Tokens → Add API token (Editor role)

### 3. Chạy với Docker

```bash
docker compose up
```

- Website: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio

### 4. Quản lý nội dung trong Studio

Vào `http://localhost:3000/studio` để:
- Upload ảnh hero, gallery
- Thêm câu chuyện tình yêu
- Thêm thông tin địa điểm cưới
- Thêm thông tin phù dâu/phù rể
- Xem danh sách RSVP
- Duyệt lời chúc Guest Book

---

## Deploy lên Vercel

1. Push code lên GitHub
2. Import repo vào [Vercel](https://vercel.com)
3. Thêm Environment Variables (giống `.env.local`)
4. Deploy!

---

## Cấu trúc sections

| Section | ID | Mô tả |
|---|---|---|
| Hero | `#hero` | Ảnh fullscreen + countdown |
| Story | `#story` | Timeline câu chuyện tình yêu |
| Details | `#details` | Thông tin hôn lễ + map |
| Gallery | `#gallery` | Ảnh pre-wedding + lightbox |
| Party | `#party` | Phù dâu / phù rể |
| RSVP | `#rsvp` | Form xác nhận tham dự |
| Guest Book | `#guestbook` | Gửi & đọc lời chúc |
| Gift | `#gift` | QR code + số tài khoản |
| FAQ | `#faq` | Câu hỏi thường gặp |

---

## Nhạc nền

Đặt file nhạc MP3 vào `public/music/wedding.mp3` để bật tính năng nhạc nền.
