import UploadedFile from '../models/uploaded-file'

export default interface Writer {
  writeLink: (uploadedFile: UploadedFile) => string
}
