import {ArticleAccessRule} from "../../enums/article-access-rule";

export interface ArticleGroupAccessRule {
  id : number;
  groupId : number;
  rule : ArticleAccessRule;
}
