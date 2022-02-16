import {ArticleAccessRule} from "../../enums/article-access-rule";
import {User} from "../users/user";
import {ArticleVersion} from "./article-version";

export interface Article {
  id : number;
  userId : number;
  user: User;
  name : string;
  updatedAt : Date;
  createdAt : Date;
  globalAccessRule: ArticleAccessRule;
  slug: string;
  lastArticleVersion: ArticleVersion;
}
