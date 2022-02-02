import {ArticleAccessRule} from "../../enums/article-access-rule";

export interface Article {
  id : number;
  userId : number;
  name : string;
  updatedAt : Date;
  createdAt : Date;
  globalAccessRule: ArticleAccessRule;
  slug: string;
}
