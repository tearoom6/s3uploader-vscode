import * as fs from 'fs'
import * as path from 'path'

type FileBody = string | Buffer

export default class LoadedFile {
  private body: FileBody
  private name: string

  static async loadByPath(filePath: string): Promise<LoadedFile | null> {
    if (! fs.existsSync(filePath)) {
      return null
    }
    const body = await LoadedFile.loadBodyByPath(filePath)
    const name = LoadedFile.getNameByPath(filePath)
    return new LoadedFile(body, name)
  }

  private constructor(body: FileBody, name: string) {
    this.body = body
    this.name = name
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
}
