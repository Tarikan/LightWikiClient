import {ArticleAccessRule} from "../../../shared/enums/article-access-rule";

export interface UpdateArticle {
  id: number;
  name: string;
  globalAccessRule: ArticleAccessRule;
}
