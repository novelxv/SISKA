import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/ttd");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const nip = req.params.nip;
        cb(null, `${nip}${ext}`);
    },
});

export const uploadTTD = multer({ storage });

const templateStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const {jenis_sk} = req.params;
        cb(null, `sk_${jenis_sk}${ext}`);
    },
});

const templateFilter = (req : any, file: any, cb: any) => {
  const isDocx = file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  cb(null, isDocx);
};

export const uploadSKTemplate = multer({ storage: templateStorage, fileFilter: templateFilter });