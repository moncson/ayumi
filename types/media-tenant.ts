export interface MediaTenant {
  id: string;
  name: string;              // メディア名（例：「旅行メディアABC」）
  slug: string;              // URLスラッグ（例：「travel-abc」）
  customDomain?: string;     // カスタムドメイン（例：「travel-abc.com」）
  subdomain?: string;        // サブドメイン（例：「travel-abc」→「travel-abc.ayumi.jp」）
  ownerId: string;           // 所有者のUID
  memberIds: string[];       // メンバーのUID配列
  settings: {
    siteName: string;
    siteDescription: string;
    logoUrl: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

