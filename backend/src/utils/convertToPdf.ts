import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const convertDocxToPdf = (docxPath: string, outputDir: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const command = `soffice --headless --convert-to pdf "${docxPath}" --outdir "${outputDir}"`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error converting to PDF: ${stderr}`);
            } else {
                const outputPdfPath = path.join(outputDir, path.basename(docxPath).replace(/\.docx$/, ".pdf"));
                fs.existsSync(outputPdfPath)
                ? resolve(outputPdfPath)
                : reject("PDF not found after conversion");
            }
        });
    });
};