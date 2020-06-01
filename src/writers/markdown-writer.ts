import UploadedFile from '../models/uploaded-file'
import Writer from './writer'

export default class MarkdownWriter implements Writer {
  writeLink(uploadedFile: UploadedFile): string {
    if (uploadedFile.isImage()) {
      return `![${uploadedFile.getName()}](${uploadedFile.getEncodedUrl()})`
    }
    return `[${uploadedFile.getName()}](${uploadedFile.getEncodedUrl()})`
  }
}
