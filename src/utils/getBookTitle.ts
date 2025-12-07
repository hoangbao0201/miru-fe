/**
 * Lấy title từ book object
 * Hỗ trợ cả cấu trúc cũ (book.title) và mới (book.languages[0].title)
 */
export function getBookTitle(book: any): string {
  if (!book) return '';
  
  // Ưu tiên lấy từ languages (cấu trúc mới)
  if (book.languages && Array.isArray(book.languages) && book.languages.length > 0) {
    return book.languages[0]?.title || '';
  }
  
  // Fallback về title trực tiếp (cấu trúc cũ)
  return book.title || '';
}

/**
 * Lấy slug từ book object
 */
export function getBookSlug(book: any): string {
  if (!book) return '';
  
  // Ưu tiên lấy từ languages (cấu trúc mới)
  if (book.languages && Array.isArray(book.languages) && book.languages.length > 0) {
    return book.languages[0]?.slug || '';
  }
  
  // Fallback về slug trực tiếp (cấu trúc cũ)
  return book.slug || '';
}

/**
 * Lấy description từ book object
 */
export function getBookDescription(book: any): string {
  if (!book) return '';
  
  // Ưu tiên lấy từ languages (cấu trúc mới)
  if (book.languages && Array.isArray(book.languages) && book.languages.length > 0) {
    return book.languages[0]?.description || '';
  }
  
  // Fallback về description trực tiếp (cấu trúc cũ)
  return book.description || '';
}

/**
 * Lấy altTitles từ book object
 */
export function getBookAltTitles(book: any): string {
  if (!book) return '';
  
  // Ưu tiên lấy từ languages (cấu trúc mới)
  if (book.languages && Array.isArray(book.languages) && book.languages.length > 0) {
    return book.languages[0]?.altTitles || '';
  }
  
  // Fallback về altTitles (cấu trúc cũ)
  return book.altTitles || '';
}

