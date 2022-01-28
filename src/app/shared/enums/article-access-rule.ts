export enum ArticleAccessRule {
  none = 0,
  read = 1,
  write = 2,
  modify = 4,
  all = read | write | modify,
}
