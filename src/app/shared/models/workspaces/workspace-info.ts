import {WorkspacePersonalAccessRule} from "./workspace-personal-access-rule";
import {WorkspaceGroupAccessRule} from "./workspace-group-access-rule";

export interface WorkspaceInfo {
  id : number;
  personalRules : WorkspacePersonalAccessRule[];
  groupRules : WorkspaceGroupAccessRule[];
}
