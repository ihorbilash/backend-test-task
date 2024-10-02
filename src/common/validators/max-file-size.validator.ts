import { MaxFileSizeValidator } from '@nestjs/common';

export class MultipleMaxFileSizeValidator extends MaxFileSizeValidator {
  public isValid(file: Express.Multer.File): boolean {
    if (!this.validationOptions) {
      return true;
    }
    return super.isValid(file);
  }
}
