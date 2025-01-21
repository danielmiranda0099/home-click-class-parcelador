export function formatUsersForInputSearch(users, role = null) {
  if (!users) return;
  return users
    .filter((user) => (role ? user.role.includes(role) : true))
    .map((user) => ({
      value: user?.email,
      label: user?.fullName,
      ...user,
    }));
}
