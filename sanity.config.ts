import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import {
  siteConfig, galleryImage,
  rsvp, guestbook, bankInfo,
} from './src/sanity/schemas'

export default defineConfig({
  basePath: '/studio',
  name: 'wedding-studio',
  title: 'Wedding Studio — Duy & Chi',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Quản lý nội dung')
          .items([
            S.listItem().title('Cấu hình chung').child(
              S.document().schemaType('siteConfig').documentId('siteConfig')
            ),
            S.divider(),
            S.documentTypeListItem('galleryImage').title('Hình ảnh Gallery'),
            S.documentTypeListItem('bankInfo').title('Thông tin ngân hàng'),
            S.divider(),
            S.documentTypeListItem('rsvp').title('Danh sách RSVP'),
            S.documentTypeListItem('guestbook').title('Sổ lưu bút'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: [siteConfig, galleryImage, rsvp, guestbook, bankInfo],
  },
})
