import { defineField, defineType } from 'sanity'

export const bankInfo = defineType({
  name: 'bankInfo',
  title: 'Thông tin ngân hàng',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Nhãn hiển thị', type: 'string', description: 'VD: Chú rể, Cô dâu' }),
    defineField({ name: 'owner', title: 'Chủ tài khoản', type: 'string' }),
    defineField({ name: 'bankName', title: 'Tên ngân hàng', type: 'string' }),
    defineField({ name: 'accountNumber', title: 'Số tài khoản', type: 'string' }),
    defineField({ name: 'accountName', title: 'Tên tài khoản', type: 'string' }),
    defineField({ name: 'qrCode', title: 'Ảnh QR Code', type: 'image' }),
    defineField({ name: 'order', title: 'Thứ tự hiển thị', type: 'number' }),
  ],
  preview: { select: { title: 'owner', subtitle: 'bankName', media: 'qrCode' } },
})
