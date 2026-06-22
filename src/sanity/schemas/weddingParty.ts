import { defineField, defineType } from 'sanity'

export const weddingParty = defineType({
  name: 'weddingParty',
  title: 'Đội hình phù dâu/phù rể',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Họ tên', type: 'string' }),
    defineField({
      name: 'side',
      title: 'Phe',
      type: 'string',
      options: { list: [{ title: 'Phù dâu', value: 'bride' }, { title: 'Phù rể', value: 'groom' }] },
    }),
    defineField({ name: 'role', title: 'Vai trò', type: 'string', description: 'VD: Phù dâu, Phù rể, Nhận hoa...' }),
    defineField({ name: 'relationship', title: 'Mối quan hệ', type: 'string', description: 'VD: Bạn thân từ cấp 3' }),
    defineField({ name: 'photo', title: 'Ảnh', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', title: 'Thứ tự', type: 'number' }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
})
