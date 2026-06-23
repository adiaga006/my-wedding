import { defineField, defineType } from 'sanity'

export const siteConfig = defineType({
  name: 'siteConfig',
  title: 'Cấu hình Website',
  type: 'document',
  fields: [
    defineField({ name: 'coupleName', title: 'Tên đôi', type: 'string', initialValue: 'Duy & Chi' }),
    defineField({ name: 'groomName', title: 'Tên chú rể', type: 'string', initialValue: 'Duy' }),
    defineField({ name: 'groomFullName', title: 'Họ tên đầy đủ chú rể', type: 'string', description: 'VD: Nguyễn Đình Duy' }),
    defineField({ name: 'groomTitle', title: 'Danh hiệu chú rể', type: 'string', initialValue: 'Quý Nam', description: 'VD: Quý Nam, Con trai, ...' }),
    defineField({ name: 'brideName', title: 'Tên cô dâu', type: 'string', initialValue: 'Chi' }),
    defineField({ name: 'brideFullName', title: 'Họ tên đầy đủ cô dâu', type: 'string', description: 'VD: Nguyễn Ngọc Kim Chi' }),
    defineField({ name: 'brideTitle', title: 'Danh hiệu cô dâu', type: 'string', initialValue: 'Trưởng Nữ', description: 'VD: Trưởng Nữ, Con gái, ...' }),
    defineField({
      name: 'groomFamily',
      title: 'Gia đình Nhà Trai',
      type: 'object',
      fields: [
        defineField({ name: 'fatherName', title: 'Tên cha', type: 'string', description: 'VD: Nguyễn Đình Nhất' }),
        defineField({ name: 'motherName', title: 'Tên mẹ', type: 'string', description: 'VD: Nguyễn Thị Tuyết Nhung' }),
        defineField({ name: 'address', title: 'Địa chỉ', type: 'string', description: 'VD: Tổ 21 - Phường Nghĩa Lộ, Tỉnh Quảng Ngãi' }),
      ],
    }),
    defineField({
      name: 'brideFamily',
      title: 'Gia đình Nhà Gái',
      type: 'object',
      fields: [
        defineField({ name: 'fatherName', title: 'Tên cha', type: 'string', description: 'VD: Nguyễn Triều' }),
        defineField({ name: 'motherName', title: 'Tên mẹ', type: 'string', description: 'VD: Phan Thị Thủy' }),
        defineField({ name: 'address', title: 'Địa chỉ', type: 'string', description: 'VD: Tổ 9 - Phường Nghĩa Lộ, Tỉnh Quảng Ngãi' }),
      ],
    }),
    defineField({ name: 'weddingDate', title: 'Ngày cưới (ISO)', type: 'datetime' }),
    defineField({ name: 'heroImage', title: 'Ảnh Hero', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroQuote', title: 'Câu trích dẫn Hero', type: 'string' }),
    defineField({
      name: 'musicPlaylist',
      title: 'Nhạc nền (danh sách bài)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'url', title: 'Link YouTube', type: 'url', description: 'VD: https://www.youtube.com/watch?v=abc123' }),
            defineField({ name: 'title', title: 'Tên bài (tuỳ chọn)', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'url' } },
        },
      ],
      description: 'Thêm nhiều bài — website sẽ phát ngẫu nhiên hoặc lần lượt',
    }),
    defineField({
      name: 'sharePreview',
      title: 'Xem trước khi chia sẻ link',
      type: 'object',
      description: 'Hiển thị khi gửi link qua Zalo, Facebook, iMessage...',
      fields: [
        defineField({
          name: 'ogTitle',
          title: 'Tiêu đề',
          type: 'string',
          description: 'VD: Duy & Chi — Trân trọng kính mời',
          initialValue: 'Duy & Chi — Đám cưới của chúng tôi',
        }),
        defineField({
          name: 'ogDescription',
          title: 'Mô tả',
          type: 'text',
          rows: 3,
          description: 'Dòng mô tả hiện bên dưới tiêu đề khi share',
          initialValue: 'Chúng tôi trân trọng kính mời bạn đến chung vui trong ngày trọng đại của Duy & Chi ♡',
        }),
        defineField({
          name: 'ogImage',
          title: 'Ảnh preview (khuyến nghị 1200×630px)',
          type: 'image',
          description: 'Ảnh hiện khi gửi link. Nên dùng ảnh cưới đẹp, tỷ lệ 1.91:1',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'ceremonyVenue',
      title: 'Địa điểm tổ chức',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Tên địa điểm', type: 'string', description: 'VD: Diamond Palace' }),
        defineField({ name: 'hall', title: 'Tên sảnh', type: 'string', description: 'VD: Sảnh 1' }),
        defineField({ name: 'address', title: 'Địa chỉ', type: 'string' }),
        defineField({ name: 'lunarDate', title: 'Ngày âm lịch', type: 'string', description: 'VD: Nhằm ngày 16 tháng 06 năm Bính Ngọ' }),
        defineField({ name: 'welcomeTime', title: 'Giờ đón khách', type: 'string', description: 'VD: 11:00' }),
        defineField({ name: 'startTime', title: 'Giờ khai tiệc', type: 'string', description: 'VD: 11:30' }),
        defineField({ name: 'mapUrl', title: 'Link Google Maps (để mở)', type: 'url' }),
        defineField({ name: 'mapEmbed', title: 'Nhúng Google Maps', type: 'text', rows: 3, description: 'Paste toàn bộ thẻ <iframe> từ Google Maps → Chia sẻ → Nhúng bản đồ. Hoặc chỉ copy URL trong src="..."' }),
      ],
    }),
  ],
})
