import * as vscode from 'vscode'

const uploadCopiedFileAndPasteLink = async () => {
  const clipboardText = await vscode.env.clipboard.readText()
  vscode.window.showInformationMessage(`uploadCopiedFileAndPasteLink: ${clipboardText}`)
}

const uploadSelectedFileAndInsertLink = async () => {
  await vscode.commands.executeCommand('copyFilePath')
  const clipboardText = await vscode.env.clipboard.readText()
  vscode.window.showInformationMessage(`uploadSelectedFileAndInsertLink: ${clipboardText}`)
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('s3uploader-vscode.uploadCopiedFileAndPasteLink', () => uploadCopiedFileAndPasteLink()),
    vscode.commands.registerCommand('s3uploader-vscode.uploadSelectedFileAndInsertLink', () => uploadSelectedFileAndInsertLink()),
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
