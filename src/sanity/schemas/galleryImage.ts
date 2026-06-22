import { defineField, defineType } from 'sanity'

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Hình ảnh Gallery',
  type: 'document',
  fields: [
    defineField({ name: 'image', title: 'Ảnh', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'caption', title: 'Chú thích', type: 'string' }),
    defineField({ name: 'order', title: 'Thứ tự', type: 'number' }),
  ],
  orderings: [{ title: 'Thứ tự', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'caption', media: 'image' } },
})
