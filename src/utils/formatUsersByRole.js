export function formatUserByRole(users, role) {
  if (!users) return;
  return users
    .filter((user) => user.role === role)
    .map((user) => ({
      id: user.id,
      value: `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`,
      label: `${user.firstName} ${user.lastName}`,
    }));
}
