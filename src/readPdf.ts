import { readFile } from "node:fs/promises";
import PdfParse from "pdf-parse";

export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const pdfBytes = await readFile(filePath);
    const gogo = await PdfParse(pdfBytes, {
      pagerender: renderPage,
    });
    return gogo.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
}

const renderPage = (pageData: any) => {
  //check documents https://mozilla.github.io/pdf.js/
  let renderOptions = {
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: false,
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false,
  };

  return pageData
    .getTextContent(renderOptions)
    .then(function (textContent: { items: any }) {
      let lastY,
        text = "";
      for (let item of textContent.items) {
        if (lastY == item.transform[5] || !lastY) {
          const addStr = item.str.trim() ? " " + item.str.trim() : "";
          text += addStr;
        } else {
          text += "\n" + item.str.trim();
        }
        lastY = item.transform[5];
      }
      return text;
    });
};
