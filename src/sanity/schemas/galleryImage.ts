import { defineField, defineType } from 'sanity'
import { MultiImageInput } from '../components/MultiImageInput'

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Album ảnh cưới',
  type: 'document',
  fields: [
    defineField({
      name: 'photos',
      title: 'Ảnh cưới',
      type: 'array',
      components: { input: MultiImageInput },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              title: 'Chú thích',
              type: 'string',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { media: 'photos.0' },
    prepare: () => ({ title: 'Album ảnh cưới' }),
  },
})
