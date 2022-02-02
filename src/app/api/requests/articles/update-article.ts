import {ArticleAccessRule} from "../../../shared/enums/article-access-rule";

export interface UpdateArticle {
  name: string;
  globalAccessRule: ArticleAccessRule;
  slug: string;
}
