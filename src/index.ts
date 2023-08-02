import { convert } from "./typhoon";
import { extractTextFromPDF } from "./readPdf";

// https://www.data.jma.go.jp/yoho/typhoon/position_table/table2023.html
const pdfNakami = extractTextFromPDF("./data/T2303.pdf");
pdfNakami
  .then((text) => {
    convert(text);
  })
  .catch((e) => console.log(e));
