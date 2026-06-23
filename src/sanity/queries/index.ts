export const SITE_CONFIG_QUERY = `*[_type == "siteConfig"][0]{
  coupleName, groomName, groomFullName, groomTitle, brideName, brideFullName, brideTitle,
  weddingDate, heroImage, heroQuote,
  groomFamily{ fatherName, motherName, address },
  brideFamily{ fatherName, motherName, address },
  musicPlaylist[]{ title, url, audioFile{ asset->{ url } } },
  sharePreview{ ogTitle, ogDescription, ogImage },
  ceremonyVenue{ name, hall, address, lunarDate, welcomeTime, startTime, mapUrl, mapEmbed }
}`

export const STORIES_QUERY = `*[_type == "story"] | order(order asc) {
  _id, title, date, description, image
}`

export const GALLERY_QUERY = `*[_type == "galleryImage"] | order(order asc) {
  _id, image, caption
}`

export const WEDDING_PARTY_QUERY = `*[_type == "weddingParty"] | order(order asc) {
  _id, name, side, role, relationship, photo
}`

export const GUESTBOOK_QUERY = `*[_type == "guestbook" && approved == true] | order(submittedAt desc) {
  _id, authorName, message, submittedAt
}`

export const FAQ_QUERY = `*[_type == "faq"] | order(order asc) {
  _id, question, answer
}`

export const BANK_INFO_QUERY = `*[_type == "bankInfo"] | order(order asc) {
  _id, label, owner, bankName, accountNumber, accountName, qrCode
}`
