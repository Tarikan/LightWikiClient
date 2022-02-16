import {ArticleAccessRule} from "./article-access-rule";

export enum CommonArticleAccessRule {
  hasNoAccess = 0,
  canView = 1,
  canViewAndEdit = 3,
  canViewEditModify = 4,
}

const CommonToRuleConversion = {
  [CommonArticleAccessRule.hasNoAccess]: ArticleAccessRule.none,
  [CommonArticleAccessRule.canView]: ArticleAccessRule.read,
  [CommonArticleAccessRule.canViewAndEdit]: ArticleAccessRule.read || ArticleAccessRule.write,
  [CommonArticleAccessRule.canViewEditModify]: ArticleAccessRule.all,
}

const RuleToCommonConversion = {
  [ArticleAccessRule.none]: CommonArticleAccessRule.hasNoAccess,
  [ArticleAccessRule.read]: CommonArticleAccessRule.canView,
  [ArticleAccessRule.read || ArticleAccessRule.write]: CommonArticleAccessRule.canViewAndEdit,
  [ArticleAccessRule.all]: CommonArticleAccessRule.canViewEditModify,
}

export function ruleToCommon(articleAccessRule: number) : CommonArticleAccessRule {
  const permission = RuleToCommonConversion[articleAccessRule];

  if (permission == undefined) {
    throw new Error("Unexpected rule");
  }

  return permission;
}

export function commonToRule(commonArticleAccessRule: CommonArticleAccessRule) : number {
  return CommonToRuleConversion[commonArticleAccessRule];
}
