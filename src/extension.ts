import * as vscode from 'vscode'
import Config from './configs/config'
import LoadedFile from './models/loaded-file'
import UploadedFile from './models/uploaded-file'
import S3Client from './services/s3-client'
import buildWriter from './writers'

const loadFile = async (filePath: string): Promise<LoadedFile | null> => {
  return await LoadedFile.loadByPath(filePath)
}

const uploadFile = async (loadedFile: LoadedFile): Promise<UploadedFile> => {
  const s3client = new S3Client()
  return await s3client.upload(loadedFile)
}

const insertFileLink = async (textEdotor: vscode.TextEditor, uploadedFile: UploadedFile) => {
  const editorFilePath = textEdotor.document.fileName
  const writer = buildWriter(editorFilePath)
  const link = writer.writeLink(uploadedFile)
  await textEdotor.edit((editBuilder: vscode.TextEditorEdit) => {
    editBuilder.insert(textEdotor.selection.start, link)
  })
}

const uploadFileAndInsertLink = async (filePath: string) => {
  try {
    const activeTextEditor = vscode.window.activeTextEditor
    if (!activeTextEditor) {
      vscode.window.showWarningMessage('s3uploader found no active editor.')
      return
    }

    const loadedFile = await loadFile(filePath)
    if (!loadedFile) {
      vscode.window.showWarningMessage('s3uploader could not load file.')
      return
    }
    console.log('s3uploader loaded file.', loadedFile.getName(), loadedFile.getMimeType())

    const uploadedFile = await uploadFile(loadedFile)
    console.log('s3uploader uploaded file.', uploadedFile.getEncodedUrl(), uploadedFile.isImage())

    await insertFileLink(activeTextEditor, uploadedFile)
  } catch (error) {
    console.error('s3uploader uploadFileAndInsertLink got error.', error)
    vscode.window.showErrorMessage(`s3uploader got error: ${error.message}`)
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
