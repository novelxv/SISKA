import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

const prisma = new PrismaClient();

export const generateSKPreviewService = async (data: {
    no_sk: string;
    judul: string;
    jenis_sk: string;
    semester: number;
    tahun_akademik: number;
    tanggal: string;
    NIP_dekan: string;
    nama_dekan: string;
}) => {
    const templatePath = path.resolve(
        __dirname,
        `../templates/sk_${data.jenis_sk.toLowerCase().replace(/\s+/g, "_")}.docx`
    );
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.setData({
        no_sk: data.no_sk,
        judul: data.judul,
        semester: data.semester,
        tahun_akademik: data.tahun_akademik,
        tanggal: format(new Date(data.tanggal), "d MMMM yyyy"),
        nama_dekan: data.nama_dekan,
        nip_dekan: data.NIP_dekan,
        ttd_base64: "Tanda tangan disini",
    });

    try {
        doc.render();
    } catch (error) {
        throw new Error("Gagal render template");
    }

    return doc.getZip().generate({ type: "nodebuffer" });
};