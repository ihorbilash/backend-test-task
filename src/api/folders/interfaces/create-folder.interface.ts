export interface ICreateFolder {
  userId: number;
  folderPath: string;
  folderName: string;
  parentFolderId?: number;
}
