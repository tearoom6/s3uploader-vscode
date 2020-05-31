import * as vscode from 'vscode'
import Config from './configs/config'
import LoadedFile from './models/loaded-file'

const loadFile = async (filePath: string): Promise<LoadedFile | null> => {
  return await LoadedFile.loadByPath(filePath)
}

const uploadCopiedFileAndPasteLink = async () => {
  const clipboardText = await vscode.env.clipboard.readText()
  const config = Config.getInstance()
  vscode.window.showInformationMessage(`uploadCopiedFileAndPasteLink: ${clipboardText} ${config.getS3BucketName()}`)
  const loadedFile = await loadFile(clipboardText)
  if (loadedFile) {
    vscode.window.showInformationMessage(loadedFile.getName())
  }
}

const uploadSelectedFileAndInsertLink = async () => {
  await vscode.commands.executeCommand('copyFilePath')
  const clipboardText = await vscode.env.clipboard.readText()
  vscode.window.showInformationMessage(`uploadSelectedFileAndInsertLink: ${clipboardText}`)
  const loadedFile = await loadFile(clipboardText)
  if (loadedFile) {
    vscode.window.showInformationMessage(loadedFile.getName())
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('s3uploader-vscode.uploadCopiedFileAndPasteLink', () => uploadCopiedFileAndPasteLink()),
    vscode.commands.registerCommand('s3uploader-vscode.uploadSelectedFileAndInsertLink', () => uploadSelectedFileAndInsertLink()),
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
