import multer from "multer"

const storage = multer.diskStorage({
    destination: './public/uploads', 
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.substring(file.originalname.lastIndexOf("."));
        cb(null, uniqueSuffix + ext);
    },
});

const imageLimit = 50 * 1024 * 1024; // 50 MB
const materialLimit = 100 * 1024 * 1024; // 100 MB

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const isValid = allowedTypes.test(file.mimetype);
    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error("Only image files with JPEG, JPG, PNG, GIF, and WEBP formats are allowed."), false);
    }
};

// Export with array() pre-configured for images
export const image = multer({ 
    storage: storage, 
    limits: { fileSize: imageLimit }, 
    fileFilter: fileFilter 
}).array("image");

// Export with single() pre-configured for materials
export const material = multer({ 
    storage: storage, 
    limits: { fileSize: materialLimit }, 
}).single("file");

