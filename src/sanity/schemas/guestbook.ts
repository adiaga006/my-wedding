import { defineField, defineType } from 'sanity'

export const guestbook = defineType({
  name: 'guestbook',
  title: 'Sổ lưu bút',
  type: 'document',
  fields: [
    defineField({ name: 'authorName', title: 'Tên người gửi', type: 'string' }),
    defineField({ name: 'message', title: 'Lời chúc', type: 'text', rows: 4 }),
    defineField({ name: 'submittedAt', title: 'Thời gian gửi', type: 'datetime' }),
    defineField({
      name: 'approved',
      title: 'Đã duyệt hiển thị',
      type: 'boolean',
      initialValue: true,
      description: 'Bỏ tick để ẩn lời chúc này khỏi website',
    }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'message' },
  },
})
