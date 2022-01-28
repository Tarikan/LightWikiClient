export interface ArticleHeader {
  id : number;
  name : string;
  hasChildren : boolean;
  children: Array<ArticleHeader>;
  slug : string;
}
