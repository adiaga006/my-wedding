import { defineField, defineType } from 'sanity'

export const story = defineType({
  name: 'story',
  title: 'Câu chuyện tình yêu',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Tiêu đề', type: 'string' }),
    defineField({ name: 'date', title: 'Ngày tháng', type: 'string', description: 'VD: Tháng 3, 2020' }),
    defineField({ name: 'description', title: 'Nội dung', type: 'text', rows: 4 }),
    defineField({ name: 'image', title: 'Ảnh', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', title: 'Thứ tự', type: 'number' }),
  ],
  orderings: [{ title: 'Thứ tự', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'date', media: 'image' } },
})
