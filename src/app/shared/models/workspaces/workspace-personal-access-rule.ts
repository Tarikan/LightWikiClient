import {WorkspaceAccessRule} from "../../enums/workspace-access-rule";

export interface WorkspacePersonalAccessRule {
  userId : number;
  workspaceId : number;
  workspaceAccessRule : WorkspaceAccessRule;
}
