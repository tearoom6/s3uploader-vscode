import * as fs from 'fs'
import * as path from 'path'
import * as FileType from 'file-type'

type FileBody = string | Buffer

const defaultMimeType = 'application/octet-stream'

export default class LoadedFile {
  private body: FileBody
  private name: string
  private mimeType: string

  static async loadByPath(filePath: string): Promise<LoadedFile | null> {
    if (! fs.existsSync(filePath)) {
      return null
    }
    const body = await LoadedFile.loadBodyByPath(filePath)
    const name = LoadedFile.getNameByPath(filePath)
    const fileType = await FileType.fromFile(filePath)
    const mimeType = fileType ? fileType.mime : defaultMimeType
    return new LoadedFile(body, name, mimeType)
  }

  private constructor(body: FileBody, name: string, mimeType: string) {
    this.body = body
    this.name = name
    this.mimeType = mimeType
  }

  private static async loadBodyByPath(filePath: string): Promise<FileBody> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (readError, fileBody) => {
        if (readError) {
          reject(readError)
          return
        }
        resolve(fileBody)
      })
    })
  }

  private static getNameByPath(filePath: string): string {
    return path.basename(filePath)
  }

  getBody(): FileBody {
    return this.body
  }

  getName(): string {
    return this.name
  }

  getMimeType(): string {
    return this.mimeType
  }
}
