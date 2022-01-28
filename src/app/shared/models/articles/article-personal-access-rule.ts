import {ArticleAccessRule} from "../../enums/article-access-rule";

export interface ArticlePersonalAccessRule {
  id : number;
  userId : number;
  articleAccessRule : ArticleAccessRule;
}
