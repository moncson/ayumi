export interface Banner {
  id: string;
  mediaId: string;           // 所属メディアID
  title: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

