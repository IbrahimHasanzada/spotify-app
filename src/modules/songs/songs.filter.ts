import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { UPLOAD_AUDIO_ALLOWED_MIME_TYPES, UPLOAD_AUDIO_TYPES } from 'src/shares/constants/upload.constants';

export const audioFileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
) => {
    console.log('Received file:', file.originalname, 'MIME type:', file.mimetype);
    let ext = extname(file.originalname).slice(1);
    const checkMimeType = UPLOAD_AUDIO_ALLOWED_MIME_TYPES.includes(file.mimetype);
    const checkFileType = UPLOAD_AUDIO_TYPES.includes(ext);

    if (!checkMimeType || !checkFileType)
        return callback(new BadRequestException('Audio type is not correct'), false);

    callback(null, true);
};