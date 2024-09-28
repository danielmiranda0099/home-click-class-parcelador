//TODO: Change name function
export function formatUserByRole(users, role = null) {
  if (!users) return;
  return users
    .filter((user) => (role ? user.role === role : true))
    .map((user) => ({
      value: `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`,
      label: `${user.firstName} ${user.lastName}`,
      ...user,
    }));
}
