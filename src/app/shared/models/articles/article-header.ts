export interface ArticleHeader {
  id : number;
  name : string;
  hasChildren : boolean;
  // children: Array<ArticleHeader>;
  parentArticleId: number;
  slug : string;
}
