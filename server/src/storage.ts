import multer, {FileFilterCallback} from "multer";
import { Request } from "express";
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void



export const diskStorage = multer.diskStorage({
    destination: (request: Request,file: Express.Multer.File,callback: DestinationCallback) => {
        callback(null,'images');
    },
    filename: (request: Request, file: Express.Multer.File, callback: FileNameCallback) => {
        const mimeType = file.mimetype.split('/');
        const fileType = mimeType[1];
        const fileName = file.originalname + '.' + fileType;
        callback(null,fileName);
        console.log("gtg");

    }
});


export const fileFilter = (request: Request,file: Express.Multer.File,callback: any) => { 
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    allowedMimeTypes.includes(file.mimetype) ? callback(null,true) : callback(null,false);
};


export const storage = multer({storage: diskStorage, fileFilter: fileFilter}).single('image');
