export enum GroupAccessRule {
  none = 0,
  addMembers = 1,
  removeMembers = 2,
  modifyGroup = 4,
  removeGroup = 8,
  all = addMembers | removeMembers | modifyGroup | removeGroup,
}
