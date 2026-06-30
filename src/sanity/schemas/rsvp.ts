import { defineField, defineType } from 'sanity'

export const rsvp = defineType({
  name: 'rsvp',
  title: 'Danh sách RSVP',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Họ tên', type: 'string' }),
    defineField({ name: 'phone', title: 'Số điện thoại', type: 'string' }),
    defineField({
      name: 'attending',
      title: 'Có tham dự?',
      type: 'boolean',
    }),
    defineField({ name: 'guestCount', title: 'Số khách', type: 'number', initialValue: 1 }),
    defineField({ name: 'submittedAt', title: 'Thời gian gửi', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'attending' },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? '✅ Sẽ tham dự' : '❌ Không tham dự',
    }),
  },
})
