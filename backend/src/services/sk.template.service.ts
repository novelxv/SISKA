import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const generateSKPreviewService = async (data: {
    no_sk: string;
    judul: string;
    jenis_sk: string;
    semester: number;
    tahun_akademik: number | null;
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
    const expressionParser = require("docxtemplater/expressions.js");

    const ImageModule = require("docxtemplater-image-module-free");

    const imageModule = new ImageModule({
      centered: false,
      getImage: function (tagValue: string) {
        return fs.readFileSync(tagValue);
      },
      getSize: function () {
        return [120, 80];
      }
    });

    function convertDate(dateStr: string) {
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
    
        return `${day} ${month} ${year}`;
    }

    const ttdPath = fs.existsSync(`./public/uploads/ttd/${data.NIP_dekan}.png`) ? `./public/uploads/ttd/${data.NIP_dekan}.png` : `./public/uploads/ttd/placeholder_ttd.png`;

    var tabel = {}
    if (data.jenis_sk == "PENGAJARAN") {
        tabel = {
            teknik_elektro: {
                kk_informatika: [],
                kk_elektronika: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_rplp: [],
                kk_sistem_kendali: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_telekomunikasi: [],
                kk_ketenagalistrikan: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_teknologi_informasi: [],
                kk_biomedika: [],
                kk_komputer: [],
                dosen_peneliti: [
                    {
                        no: 1, nama_dosen: "Indra Sihar, S.T., M.Sc., Ph.D.", nip_dosen: "223121011", sks_six: ["2,9"], sks_riil: ["2,9"], kode: ["EL3010"], matkul: ["Pengolahan Sinyal Digital"], sks: ["3"], kelas: ["3"], peserta: ["43"], jabatan: ["Dosen 2"], keterangan: ["STEI ITB"]
                    },
                ],
                dosen_pengajar: [
                    {
                        no: 1, nama_dosen: "Indra Sihar, S.T., M.Sc., Ph.D.", nip_dosen: "223121011", sks_six: ["2,9"], sks_riil: ["2,9"], kode: ["EL3010"], matkul: ["Pengolahan Sinyal Digital"], sks: ["3"], kelas: ["3"], peserta: ["43"], jabatan: ["Dosen 2"], keterangan: ["STEI ITB"]
                    },
                ],
                tutor: [],
                dosen_luar_stei: [],
                dosen_luar_itb: [],
                dosen_industri: [],
                asisten_akademik: []
            },
            teknik_informatika: {
                kk_informatika: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_elektronika: [],
                kk_rplp: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_sistem_kendali: [],
                kk_telekomunikasi: [],
                kk_ketenagalistrikan: [],
                kk_teknologi_informasi: [],
                kk_biomedika: [],
                kk_komputer: [],
                dosen_peneliti: [],
                dosen_pengajar: [
                    {
                        no: 1, nama_dosen: "Indra Sihar, S.T., M.Sc., Ph.D.", nip_dosen: "223121011", sks_six: ["2,9"], sks_riil: ["2,9"], kode: ["EL3010"], matkul: ["Pengolahan Sinyal Digital"], sks: ["3"], kelas: ["3"], peserta: ["43"], jabatan: ["Dosen 2"], keterangan: ["STEI ITB"]
                    },
                ],
                tutor: [],
                dosen_luar_stei: [
                    {
                        no: 1, nama_dosen: "Indra Sihar, S.T., M.Sc., Ph.D.", nip_dosen: "223121011", sks_six: ["2,9"], sks_riil: ["2,9"], kode: ["EL3010"], matkul: ["Pengolahan Sinyal Digital"], sks: ["3"], kelas: ["3"], peserta: ["43"], jabatan: ["Dosen 2"], keterangan: ["STEI ITB"]
                    },
                ],
                dosen_luar_itb: [],
                dosen_industri: [],
                asisten_akademik: []
            },
            teknik_tenaga_listrik: {
                kk_informatika: [],
                kk_elektronika: [],
                kk_rplp: [],
                kk_sistem_kendali: [],
                kk_telekomunikasi: [],
                kk_ketenagalistrikan: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_teknologi_informasi: [],
                kk_biomedika: [],
                kk_komputer: [],
                dosen_peneliti: [],
                dosen_pengajar: [],
                tutor: [],
                dosen_luar_stei: [],
                dosen_luar_itb: [],
                dosen_industri: [],
                asisten_akademik: []
            },
            teknik_telekomunikasi: {
                kk_informatika: [],
                kk_elektronika: [],
                kk_rplp: [],
                kk_sistem_kendali: [],
                kk_telekomunikasi: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_ketenagalistrikan: [],
                kk_teknologi_informasi: [],
                kk_biomedika: [],
                kk_komputer: [],
                dosen_peneliti: [],
                dosen_pengajar: [],
                tutor: [],
                dosen_luar_stei: [],
                dosen_luar_itb: [],
                dosen_industri: [],
                asisten_akademik: []
            },
            sistem_teknologi_informasi: {
                kk_informatika: [],
                kk_elektronika: [],
                kk_rplp: [],
                kk_sistem_kendali: [],
                kk_telekomunikasi: [],
                kk_ketenagalistrikan: [],
                kk_teknologi_informasi: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_biomedika: [],
                kk_komputer: [],
                dosen_peneliti: [],
                dosen_pengajar: [],
                tutor: [],
                dosen_luar_stei: [],
                dosen_luar_itb: [],
                dosen_industri: [],
                asisten_akademik: []
            },
            teknik_biomedis: {
                kk_informatika: [],
                kk_elektronika: [],
                kk_rplp: [],
                kk_sistem_kendali: [],
                kk_telekomunikasi: [],
                kk_ketenagalistrikan: [],
                kk_teknologi_informasi: [],
                kk_biomedika: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_komputer: [],
                dosen_peneliti: [],
                dosen_pengajar: [],
                tutor: [],
                dosen_luar_stei: [],
                dosen_luar_itb: [],
                dosen_industri: [],
                asisten_akademik: []
            },
            magister_teknik_elektro: {
                kk_informatika: [],
                kk_elektronika: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_rplp: [],
                kk_sistem_kendali: [],
                kk_telekomunikasi: [],
                kk_ketenagalistrikan: [],
                kk_teknologi_informasi: [],
                kk_biomedika: [],
                kk_komputer: [],
                dosen_peneliti: [],
                dosen_pengajar: [],
                tutor: [],
                dosen_luar_stei: [],
                dosen_luar_itb: [],
                dosen_industri: [],
                asisten_akademik: []
            },
            magister_teknik_informatika: {
                kk_informatika: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_elektronika: [],
                kk_rplp: [],
                kk_sistem_kendali: [],
                kk_telekomunikasi: [],
                kk_ketenagalistrikan: [],
                kk_teknologi_informasi: [],
                kk_biomedika: [],
                kk_komputer: [],
                dosen_peneliti: [],
                dosen_pengajar: [],
                tutor: [],
                dosen_luar_stei: [],
                dosen_luar_itb: [],
                dosen_industri: [],
                asisten_akademik: []
            },
            doktor_elektro_informatika: {
                kk_informatika: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_elektronika: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_rplp: [],
                kk_sistem_kendali: [],
                kk_telekomunikasi: [],
                kk_ketenagalistrikan: [],
                kk_teknologi_informasi: [],
                kk_biomedika: [],
                kk_komputer: [],
                dosen_peneliti: [],
                dosen_pengajar: [],
                tutor: [],
                dosen_luar_stei: [],
                dosen_luar_itb: [],
                dosen_industri: [],
                asisten_akademik: []
            },
            ppi_elektro: {
                kk_informatika: [],
                kk_elektronika: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_rplp: [],
                kk_sistem_kendali: [],
                kk_telekomunikasi: [],
                kk_ketenagalistrikan: [],
                kk_teknologi_informasi: [],
                kk_biomedika: [],
                kk_komputer: [],
                dosen_peneliti: [],
                dosen_pengajar: [],
                tutor: [],
                dosen_luar_stei: [],
                dosen_luar_itb: [],
                dosen_industri: [],
                asisten_akademik: []
            },
            ppi_informatika: {
                kk_informatika: [
                    {
                        no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                    },
                    {
                        no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                    },
                ],
                kk_elektronika: [],
                kk_rplp: [],
                kk_sistem_kendali: [],
                kk_telekomunikasi: [],
                kk_ketenagalistrikan: [],
                kk_teknologi_informasi: [],
                kk_biomedika: [],
                kk_komputer: [],
                dosen_peneliti: [],
                dosen_pengajar: [],
                tutor: [],
                dosen_luar_stei: [],
                dosen_luar_itb: [],
                dosen_industri: [],
                asisten_akademik: []
            }
        
        }
    }

    const doc = new Docxtemplater(zip, { parser: expressionParser, modules: [imageModule], paragraphLoop: true, linebreaks: true });
    try {
        doc.render(
            {
                no_sk: data.no_sk,
                judul: data.judul,
                semester: "I".repeat(data.semester),
                tahun_akademik: data.tahun_akademik,
                tanggal: convertDate(data.tanggal),
                nama_dekan: data.nama_dekan,
                nip_dekan: data.NIP_dekan,
                ttd: ttdPath,
                tabel: tabel
            }
        );
    } catch (error) {
        throw new Error("Gagal render template");
    }

    return doc.getZip().generate({ type: "nodebuffer" });
};