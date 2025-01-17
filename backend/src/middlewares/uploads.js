import multer from "multer"

const storage = multer.diskStorage({
    destination: './public/uploads', 
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        let ext = file.originalname.substring(
            file.originalname.lastIndexOf("."),
            file.originalname.length
        );
        console.log(ext);
        cb(null, uniqueSuffix + ext);
    },
});

const limit = 2 * 1024 * 1024; //2 Mb Validation
const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes("jpeg") || file.mimetype.includes("png") || file.mimetype.includes("jpg")) {
        cb(null, true);
    } else {
        return cb(null, new Error("Only image with JPEG, JPG, PNG formats are allowed"), false);
    }
};

// Export with array() pre-configured for images
export const image = multer({ 
    storage: storage, 
    limits: { fileSize: limit }, 
    fileFilter: fileFilter 
}).array("image");

// Export with single() pre-configured for materials
export const material = multer({ 
    storage: storage, 
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: fileFilter 
}).single("file");

