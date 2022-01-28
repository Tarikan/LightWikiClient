import {WorkspaceAccessRule} from "../../../shared/enums/workspace-access-rule";

export interface CreateWorkspace {
  name: string;
  workspaceAccessRule: WorkspaceAccessRule;
}
