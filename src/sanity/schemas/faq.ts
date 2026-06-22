import { defineField, defineType } from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'Câu hỏi thường gặp',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Câu hỏi', type: 'string' }),
    defineField({ name: 'answer', title: 'Trả lời', type: 'text', rows: 4 }),
    defineField({ name: 'order', title: 'Thứ tự', type: 'number' }),
  ],
  orderings: [{ title: 'Thứ tự', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'question' } },
})
