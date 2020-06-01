import * as vscode from 'vscode'
import Config from './configs/config'
import LoadedFile from './models/loaded-file'
import UploadedFile from './models/uploaded-file'
import S3Client from './services/s3-client'

const loadFile = async (filePath: string): Promise<LoadedFile | null> => {
  return await LoadedFile.loadByPath(filePath)
}

const uploadFile = async (loadedFile: LoadedFile): Promise<UploadedFile> => {
  const s3client = new S3Client()
  return await s3client.upload(loadedFile)
}

const uploadFileAndInsertLink = async (filePath: string) => {
  const config = Config.getInstance()
  vscode.window.showInformationMessage(`s3uploader: ${filePath} ${config.getS3BucketName()}`)
  const loadedFile = await loadFile(filePath)
  if (loadedFile) {
    vscode.window.showInformationMessage(`${loadedFile.getName()}, ${loadedFile.getMimeType()}`)
    const uploadedFile = await uploadFile(loadedFile)
    vscode.window.showInformationMessage(`${uploadedFile.getEncodedUrl()}, ${uploadedFile.isImage()}`)
  }
}

const uploadCopiedFileAndPasteLink = async () => {
  const clipboardText = await vscode.env.clipboard.readText()
  uploadFileAndInsertLink(clipboardText)
}

const uploadSelectedFileAndInsertLink = async () => {
  await vscode.commands.executeCommand('copyFilePath')
  const clipboardText = await vscode.env.clipboard.readText()
  uploadFileAndInsertLink(clipboardText)
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('s3uploader-vscode.uploadCopiedFileAndPasteLink', () => uploadCopiedFileAndPasteLink()),
    vscode.commands.registerCommand('s3uploader-vscode.uploadSelectedFileAndInsertLink', () => uploadSelectedFileAndInsertLink()),
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
