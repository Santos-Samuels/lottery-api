import User from "App/Models/User";

export const formatUser = (user: User) => {
  const formatedUser = user.serialize()

  const userInfo = {
    id: formatedUser?.id,
    name: formatedUser?.name,
    email: formatedUser?.email,
    created_at: formatedUser?.created_at,
    updated_at: formatedUser?.created_at,
  }

  return userInfo
}