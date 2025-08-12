export const getUserImage = (uri?: string) => {
  if (uri) {
    return { uri };
  }
  return require("../assets/images/defaultUser.png");
};
