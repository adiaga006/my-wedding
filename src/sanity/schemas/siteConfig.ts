import { defineField, defineType } from 'sanity'

export const siteConfig = defineType({
  name: 'siteConfig',
  title: 'Cấu hình Website',
  type: 'document',
  fields: [
    defineField({ name: 'coupleName', title: 'Tên đôi', type: 'string', initialValue: 'Duy & Chi' }),
    defineField({ name: 'groomName', title: 'Tên chú rể', type: 'string', initialValue: 'Duy' }),
    defineField({ name: 'brideName', title: 'Tên cô dâu', type: 'string', initialValue: 'Chi' }),
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
        defineField({ name: 'name', title: 'Tên địa điểm', type: 'string' }),
        defineField({ name: 'address', title: 'Địa chỉ', type: 'string' }),
        defineField({ name: 'time', title: 'Giờ tổ chức', type: 'string' }),
        defineField({ name: 'mapUrl', title: 'Link Google Maps (để mở)', type: 'url', description: 'Link thường để bấm mở Google Maps' }),
        defineField({ name: 'mapEmbed', title: 'Link nhúng Google Maps', type: 'url', description: 'Lấy từ Google Maps → Chia sẻ → Nhúng bản đồ → Copy phần src="..."' }),
      ],
    }),
  ],
})
