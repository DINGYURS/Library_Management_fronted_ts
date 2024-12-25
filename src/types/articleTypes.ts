export interface ArticleCategory {
  categoryId?: number;
  categoryName: string;
}

export interface ArticleInfo {
  id?: number;
  categoryName: string;
  title: string;
  content: string;
  coverImg: string;
  name?: string;
  status?: number;
  createTime?: string;
  updateTime?: string;
  role: number;
}

export interface ArticlePageQuery {
  title: string;
  categoryName: string;
  status: number|null;
  role: number;
}