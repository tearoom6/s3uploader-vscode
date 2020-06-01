import MarkdownWriter from './markdown-writer'
import HtmlWriter from './html-writer'

export const buildWriter = (filePath: string) => {
  if (filePath.endsWith('.htm') || filePath.endsWith('.html')) {
    return new HtmlWriter()
  }
  // Default
  return new MarkdownWriter()
}

export default buildWriter
