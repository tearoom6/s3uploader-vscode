export default class UploadedFile {
  private name: string
  private url: string
  private mimeType: string

  constructor(name: string, url: string, mimeType: string) {
    this.name = name
    this.url = url
    this.mimeType = mimeType
  }

  isImage() {
    return this.mimeType !== null && this.mimeType.startsWith('image/')
  }

  getEncodedUrl() {
    return encodeURI(this.url)
  }
}
