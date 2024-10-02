import { FileTypeValidator } from '@nestjs/common';

export class MultipleFileTypeValidator extends FileTypeValidator {
  isValid(file: Express.Multer.File): boolean {
    if (!this.validationOptions) {
      return true;
    }
    return super.isValid(file);
  }
}
