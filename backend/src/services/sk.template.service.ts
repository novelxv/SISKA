import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

const prisma = new PrismaClient();

export const generateSKPreviewService = async (no_sk: string): Promise<Buffer> => {
    const sk = await prisma.sK.findUnique({
        where: { no_sk },
        include: { Dekan: true },
    });
    
    if (!sk) throw new Error("SK tidak ditemukan");
    
    const templatePath = path.resolve(__dirname, `../templates/sk_${sk.jenis_sk.toLowerCase().replace(/\s+/g, "_")}.docx`);
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    
    doc.setData({
        no_sk: sk.no_sk,
        judul: sk.judul,
        semester: sk.semester,
        tanggal: format(new Date(sk.tanggal), "d MMMM yyyy"),
        nama_dekan: sk.Dekan?.nama || "",
        nip_dekan: sk.NIP_dekan,
        ttd_base64: "Tanda tangan disini"
    });
    
    try {
        doc.render();
    } catch (error) {
        throw new Error("Gagal render template");
    }
    
    const buf = doc.getZip().generate({ type: "nodebuffer" });
    return buf;
};