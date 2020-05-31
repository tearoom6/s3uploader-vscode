import * as vscode from 'vscode'

export default class Config {
  private static instance: Config
  private configurations: vscode.WorkspaceConfiguration

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }
    return Config.instance
  }

  private constructor() {
    this.configurations = vscode.workspace.getConfiguration('s3uploader-vscode')
  }

  getS3BucketName(): string | undefined {
    return this.configurations.get<string>('basic.s3BucketName')
  }

  getS3DirectoryPath(): string | undefined {
    return this.configurations.get<string>('basic.s3DirectoryPath')
  }

  getS3BucketCustomUrl(): string | undefined {
    return this.configurations.get<string>('advanced.s3BucketCustomUrl')
  }

  shouldUseUuidAsFileName(): boolean {
    return this.configurations.get<boolean>('advanced.useUuidAsFileName', true)
  }
}
