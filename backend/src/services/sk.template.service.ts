import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getPengajaranData(){
    return {
        teknik_elektro: {
            tetap: [
                {
                    kk: "KK Elektronika",
                    isi: [
                        {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]},
                        {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]},
                    ]
                },
                {
                    kk: "KK Sistem Kendali & Komputer",
                    isi: [
                        {
                            no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                        },
                        {
                            no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                        },
                    ]
                },
                {
                    kk: "KK Teknik Ketenagalistrikan",
                    isi: [
                        {
                            no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                        },
                        {
                            no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                        },
                    ]
                }
            ],
            tidak_tetap: [
                {
                    jenis: "Dosen Tidak Tetap Peneliti",
                    isi: [
                        {
                            no: 1, nama_dosen: "Indra Sihar, S.T., M.Sc., Ph.D.", nip_dosen: "223121011", sks_six: ["2,9"], sks_riil: ["2,9"], kode: ["EL3010"], matkul: ["Pengolahan Sinyal Digital"], sks: ["3"], kelas: ["3"], peserta: ["43"], jabatan: ["Dosen 2"], keterangan: ["STEI ITB"]
                        },
                    ]
                },
                {
                    jenis: "Dosen Tidak Tetap Pengajar",
                    isi: [
                        {
                            no: 1, nama_dosen: "Indra Sihar, S.T., M.Sc., Ph.D.", nip_dosen: "223121011", sks_six: ["2,9"], sks_riil: ["2,9"], kode: ["EL3010"], matkul: ["Pengolahan Sinyal Digital"], sks: ["3"], kelas: ["3"], peserta: ["43"], jabatan: ["Dosen 2"], keterangan: ["STEI ITB"]
                        },
                    ]
                }
            ],
            luar: []
        }
    }
}

function getWaliTPBData() {
    return {
            steik : [
                {nama_dosen: 'Arrival Dwi Sentosa, S.Kom., M.T.', nip_dosen: '223122016', no: [1, 2, 3], nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
                {nama_dosen: 'Atina Putri, S.Kom., M.T.', nip_dosen: '223122017', no: [1, 2], nim: ['19624058', '19624059'], mhs: ['Forza Derian', 'Mikhael Andrian Yonatan']},
            ],
            steir : [
                {nama_dosen: 'Arrival Dwi Sentosa, S.Kom., M.T.', nip_dosen: '223122016', no: [1, 2, 3], nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
                {nama_dosen: 'Atina Putri, S.Kom., M.T.', nip_dosen: '223122017', no: [1, 2], nim: ['19624058', '19624059'], mhs: ['Forza Derian', 'Mikhael Andrian Yonatan']},
            ],
            inter : [
                {nama_dosen: 'Arrival Dwi Sentosa, S.Kom., M.T.', nip_dosen: '223122016', no: [1, 2, 3], nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
                {nama_dosen: 'Atina Putri, S.Kom., M.T.', nip_dosen: '223122017', no: [1, 2], nim: ['19624058', '19624059'], mhs: ['Forza Derian', 'Mikhael Andrian Yonatan']},
            ]
        }
}

function getWaliAktifData() {
    return {
        teknik_elektro: {
            dosen: [
                {
                    kk: "KK Elektronika",
                    isi: [
                        {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
                        {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
                    ]
                },
                {
                    kk: "KK Sistem Kendali & Komputer",
                    isi: [
                        {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
                        {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
                    ]
                },
            ],
        }
    }
}

function getPembimbingAktifData () {
    return {
            teknik_informatika: {
                tetap: [
                    {
                        kk: "KK Elektronika",
                        isi: [
                            {
                                no: 1, nama_dosen:"AAA", nip_dosen:"123", nim:["12345678", "12345678"], mhs:["ABC", "ABC"], jabatan: ["jabatan", "jabatan"]
                            },
                            {
                                no: 2, nama_dosen:"AAA", nip_dosen:"123", nim:["12345678", "12345678"], mhs:["ABC", "ABC"], jabatan: ["jabatan", "jabatan"]
                            }
                        ]
                    },
                    {
                        kk: "KK Informatika",
                        isi: [
                            {
                                no: 1, nama_dosen:"AAA", nip_dosen:"123", nim:["12345678", "12345678"], mhs:["ABC", "ABC"], jabatan: ["jabatan", "jabatan"]
                            },
                            {
                                no: 2, nama_dosen:"AAA", nip_dosen:"123", nim:["12345678", "12345678"], mhs:["ABC", "ABC"], jabatan: ["jabatan", "jabatan"]
                            }
                        ]
                    }
                ],
                tidak_tetap: [
                    {
                        jenis: "Dosen Tidak Tetap Peneliti",
                        isi: [
                            {
                                no: 1, nama_dosen:"AAA", nip_dosen:"123", nim:["12345678", "12345678"], mhs:["ABC", "ABC"], jabatan: ["jabatan", "jabatan"]
                            },
                            {
                                no: 2, nama_dosen:"AAA", nip_dosen:"123", nim:["12345678", "12345678"], mhs:["ABC", "ABC"], jabatan: ["jabatan", "jabatan"]
                            }
                        ]
                    },
                ],
                luar: [
                    {
                        jenis: "Dosen Luar STEI",
                        isi: [
                            {
                                no: 1, nama_dosen:"AAA", nip_dosen:"123", nim:["12345678", "12345678"], mhs:["ABC", "ABC"], jabatan: ["jabatan", "jabatan"]
                            },
                            {
                                no: 2, nama_dosen:"AAA", nip_dosen:"123", nim:["12345678", "12345678"], mhs:["ABC", "ABC"], jabatan: ["jabatan", "jabatan"]
                            }
                        ]
                    },
                ]
            }
        }
}

function getPembimbingPengujiData() {
    return {
        pembimbing: {
            teknik_elektro: {
                tetap: [
                    {
                        kk: "KK Elektronika",
                        isi: [
                            {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                            {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 2/Pendamping', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                        ]
                    },
                    {
                        kk: "KK Sistem Kendali & Komputer",
                        isi: [
                            {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                            {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                        ]
                    }
                ],
                tidak_tetap: [
                    {
                        jenis: "Dosen Tidak Tetap Peneliti",
                        isi: [
                            {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                            {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                        ]
                    },
                ],
                luar: [
                    {
                        jenis: "Dosen Industri",
                        isi: [
                            {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama'], asal: 'Instansi'},
                            {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama'], asal: 'Instansi'},
                        ]
                    },
                ]
            }
        },
        penguji: {}
    }
}

function getAsistenData() {
    return {
        kuliah: {
            teknik_elektro: [
                {
                    no: 1, kode: 'EL2006', matkul: 'Material Teknik Elektro', sks: '3', kelas: '1, 2, 3', asisten: ['Siapa', 'Siapa', 'Siapa'], nim: ['xxxxxxxx','xxxxxxxx', 'xxxxxxxx'], jabatan: ['Asisten Kuliah', 'Koordinator', 'Asisten Kuliah']
                },
                {
                    no: 2, kode: 'EL2006', matkul: 'Material Teknik Elektro', sks: '3', kelas: '1, 2, 3', asisten: ['Siapa', 'Siapa', 'Siapa'], nim: ['xxxxxxxx','xxxxxxxx', 'xxxxxxxx'], jabatan: ['Asisten Kuliah', 'Koordinator', 'Asisten Kuliah']
                }
            ]
        },
        praktikum: {

        }
    }
}

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
        if (dateStr.length == 0) {
            return ""
        }
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

    const tahun_str1 = data.tahun_akademik? data.tahun_akademik.toString() : ""
    const tahun_str2 = (data.tahun_akademik? data.tahun_akademik + 1 : "")?.toString()
    var semester = ""
    if (data.jenis_sk == "PEMBIMBING_PENGUJI") {
        if (data.semester == 1) {
            semester = "Wisuda Pertama (Bulan Oktober)"
        } else if (data.semester == 2) {
            semester = "Wisuda Kedua (Bulan April)"
        } else {
            semester = ""
        }
    } else {
        semester = "I".repeat(data.semester)
    }

    const ttdPath = fs.existsSync(`./public/uploads/ttd/${data.NIP_dekan}.png`) ? `./public/uploads/ttd/${data.NIP_dekan}.png` : `./public/uploads/ttd/placeholder_ttd.png`;

    var tabel = {}
    if (data.jenis_sk == "PENGAJARAN") {
        tabel = getPengajaranData()
    } else if (data.jenis_sk == "WALI_TPB") {
        tabel = getWaliTPBData()
    } else if (data.jenis_sk == "PEMBIMBING_AKTIF") {
        tabel = getPembimbingAktifData()
    } else if (data.jenis_sk == "PEMBIMBING_PENGUJI") {
        tabel = getPembimbingPengujiData()
    } else if (data.jenis_sk == "WALI_MHS_AKTIF") {
        tabel = getWaliAktifData()
    } else if (data.jenis_sk == "ASISTEN_PRAKTIKUM") {
        tabel = getAsistenData()
    } 

    const doc = new Docxtemplater(zip, { parser: expressionParser, modules: [imageModule], paragraphLoop: true, linebreaks: true });
    try {
        doc.render(
            {
                no_sk: data.no_sk,
                judul: data.judul,
                semester_upper: semester.toUpperCase(),
                semester: semester,
                tahun_akademik: tahun_str1 + "/" + tahun_str2,
                tahun1: tahun_str1,
                tahun2: tahun_str2,
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