export const getAuthUserFile = (username: string) => `playwright/.auth/${username}.json`

export const users = {
  unAuthorizedUser: {
    username: "unAuthorizedUser",
    userId: 100,
  },
  readOnlyTokenUser: {
    username: "readOnlyTokenUser",
    userId: 101,
  },
  editTokenUser: {
    username: "editTokenUser",
    userId: 102,
  },
  groupMemberUser: {
    username: "groupMemberUser",
    userId: 103,
  },
  projectOwnerUser: {
    username: "testuser",
    userId: 2,
  },
}

export const accessGroupId = 3
export const projectId = 1
export const variantId = 1
export const componentId = "32af2f0b-d7d8-4fb1-8354-1e9736d4f513"
