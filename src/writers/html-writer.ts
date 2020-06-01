import UploadedFile from '../models/uploaded-file'
import Writer from './writer'

export default class HtmlWriter implements Writer {
  writeLink(uploadedFile: UploadedFile): string {
    if (uploadedFile.isImage()) {
      return `<img src="${uploadedFile.getEncodedUrl()}" alt="${uploadedFile.getName()}" />`
    }
    return `<a href="${uploadedFile.getEncodedUrl()}">${uploadedFile.getName()}</a>`
  }
}
