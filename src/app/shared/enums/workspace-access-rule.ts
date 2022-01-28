export enum WorkspaceAccessRule {
  none = 0,
  browse = 1,
  createArticle = 2,
  modifyArticle = 4,
  manageWorkspace = 8,
  all = browse | createArticle | modifyArticle | manageWorkspace,
}
