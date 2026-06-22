export const SITE_CONFIG_QUERY = `*[_type == "siteConfig"][0]{
  coupleName, groomName, brideName, weddingDate, heroImage, heroQuote,
  musicPlaylist[]{ url, title },
  ceremonyVenue{ name, address, time, mapUrl, mapEmbed },
  receptionVenue{ name, address, time, mapUrl, mapEmbed }
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
  _id, owner, bankName, accountNumber, accountName, qrCode
}`
