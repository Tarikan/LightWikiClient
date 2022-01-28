import {ArticleAccessRule} from "../../../shared/enums/article-access-rule";

export interface CreateArticle {
  workspaceId: number;
  parentId?: number;
  name: string;
  globalAccessRule: ArticleAccessRule;
}
