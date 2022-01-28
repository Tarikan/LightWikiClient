import {WorkspaceAccessRule} from "../../enums/workspace-access-rule";

export interface WorkspaceGroupAccessRule {
  groupId : number;
  workspaceId : number;
  workspaceAccessRule : WorkspaceAccessRule;
}
