import axios from "axios";

const getUserData = async () => {
  try {
    const response = await axios.get("http://localhost:8080/login/sucess", {
      withCredentials: true,
    });

    if (response.data.message && response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data.user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
const users = async () => {
  const fetchedUsers = await getUserData();
  return Array.isArray(fetchedUsers)
    ? fetchedUsers.map((item) => ({
        googleId: item.googleId,
        displayName: item.displayName,
        email: item.email,
        image: item.image,
      }))
    : [];
};

export default users;
