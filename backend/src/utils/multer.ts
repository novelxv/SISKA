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