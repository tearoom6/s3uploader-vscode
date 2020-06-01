'use babel'

import * as S3 from 'aws-sdk/clients/s3'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import Config from '../configs/config'
import LoadedFile from '../models/loaded-file'
import UploadedFile from '../models/uploaded-file'

export default class S3Client {
  private s3: S3
  private config: Config

  constructor() {
    this.s3 = new S3()
    this.config = Config.getInstance().reload()
  }

  async upload(loadedFile: LoadedFile): Promise<UploadedFile> {
    const s3BucketName = this.config.getS3BucketName()
    const s3DirectoryPath = this.config.getS3DirectoryPath()
    const s3BucketCustomUrl = this.config.getS3BucketCustomUrl()
    const useUuidAsFileName = this.config.shouldUseUuidAsFileName()

    if (!s3BucketName) {
      throw new Error('S3 Bucket Name should be specified in configurations.')
    }

    const s3BucketAvailable = await this.checkS3BucketAvailable(s3BucketName)
    const s3BucketLocation = await this.getS3BucketLocation(s3BucketName)

    if (!s3BucketAvailable) {
      throw new Error('S3 Bucket Name specified is not available.')
    }

    console.log(`S3uploader start uploading: ${loadedFile.getName()}`)
    return new Promise((resolve, reject) => {
      let s3Path = path.join(s3DirectoryPath, loadedFile.getName())
      if (useUuidAsFileName) {
        const extension = path.extname(loadedFile.getName())
        s3Path = path.join(s3DirectoryPath, `${uuidv4()}${extension}`)
      }
      const params = {
        Bucket: s3BucketName,
        Key: s3Path,
        Body: loadedFile.getBody(),
        ContentType: loadedFile.getMimeType(),
        ACL: 'public-read'
      }
      this.s3.putObject(params, (error, _data) => {
        if (error) {
          reject(error)
          return
        }
        let url = `https://s3.${s3BucketLocation}.amazonaws.com/${s3BucketName}/${s3Path}`
        if (s3BucketCustomUrl) {
          url = `${s3BucketCustomUrl}/${s3Path}`
        }
        console.log(`File uploaded to ${url}.`)
        resolve(new UploadedFile(loadedFile.getName(), url, loadedFile.getMimeType()))
      })
    })
  }

  async checkS3BucketAvailable(s3BucketName: string): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      this.s3.headBucket({ Bucket: s3BucketName }, (error, _data) => {
        if (error) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  async getS3BucketLocation(s3BucketName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.s3.getBucketLocation({ Bucket: s3BucketName }, (error, data) => {
        if (error) {
          reject(error)
          return
        }
        resolve(data.LocationConstraint)
      })
    })
  }
}
