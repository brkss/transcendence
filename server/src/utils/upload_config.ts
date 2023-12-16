import { BadRequestException } from "@nestjs/common"
import { diskStorage } from "multer"
import path = require("path") // exported form  path (re checkit!!)
import { uid } from "uid"

export const upload_config = {
    limits: {
        fieldNameSize: 50, // bytes
        fields: 0,
        fileSize: 3 * Math.pow(10, 6) , // 3MB
    },
    storage: diskStorage({
        destination: path.join(process.cwd(), "/uploads/images/"),
        filename: (req, file, callback) => {
            const parsed_file = path.parse(file.originalname)
            const valid_types = ["image/jpeg", "image/png"]
            const valid_ext = [".jpg", ".png"]

            if (!(valid_types.includes(file.mimetype)) || 
                !(valid_ext.includes(parsed_file.ext))) {
                    return (callback(new BadRequestException("Invalid image"), null))
                }
            const file_name = uid(12) + parsed_file.ext
            return  (callback(null, file_name))
        }
    }),
}