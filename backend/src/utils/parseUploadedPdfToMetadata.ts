import fs from "fs";
import path from "path";
import { JenisSK } from "@prisma/client";
import pdfParse from "pdf-parse";
import { parseTanggalIndoToDate } from "./parseTanggalIndoToDate";

interface ParsedSKMetadata {
  no_sk: string;
  judul: string;
  tanggal: Date;
  semester: number;
  jenis_sk: JenisSK;
  NIP_dekan: string;
  nama_dekan: string;
  ttd_dekan?: string;
}

export const parseSKWaliAktifMetadata = async (filePath: string): Promise<ParsedSKMetadata> => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  const text = pdfData.text;

  const no_sk = text.match(/NOMOR\s*:\s*([^\n]+)/i)?.[1].trim() || "";
  const judul = text.match(/TENTANG\s+([^\n]+)/i)?.[1].trim() || "";
  const tanggalStr = text.match(/Ditetapkan di Bandung\s+.*tanggal\s+([\d]+\s+\w+\s+\d{4})/i)?.[1];
  const tanggal = parseTanggalIndoToDate(tanggalStr || "") || new Date();
  if (!tanggal || isNaN(tanggal.getTime())) {
    throw new Error("Tanggal tidak valid");
  }

  const semester = /Semester\s+I/i.test(text) ? 1 : /Semester\s+II/i.test(text) ? 2 : 0;
  const nip = text.match(/NIP\s+(\d{18})/)?.[1] || "";
  const namaDekan = text.match(/DEKAN[,\s]*([\w\s.,'-]+)\s+NIP/i)?.[1].trim() || "";

  return {
    no_sk,
    judul,
    tanggal,
    semester,
    jenis_sk: "WALI_MHS_AKTIF",
    NIP_dekan: nip,
    nama_dekan: namaDekan,
  };
};
