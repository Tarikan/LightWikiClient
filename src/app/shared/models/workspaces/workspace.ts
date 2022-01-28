import {WorkspaceAccessRule} from "../../enums/workspace-access-rule";

export interface Workspace {
  id : number;
  name : string;
  slug : string;
  workspaceAccessRule : WorkspaceAccessRule;
  workspaceRootArticleSlug : string;
}
