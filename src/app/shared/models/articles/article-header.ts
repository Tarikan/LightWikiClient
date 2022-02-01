export interface ArticleHeader {
  id : number;
  name : string;
  hasChildren : boolean;
  // children: Array<ArticleHeader>;
  parentId: number;
  slug : string;
}
