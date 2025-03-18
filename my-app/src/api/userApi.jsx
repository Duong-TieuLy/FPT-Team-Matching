import axios from "axios";
const API_URL = "https://jsonplaceholder.typicode.com/users";
const API_PROJECT = "http://localhost:8080";

export const getUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

async function getPosts() {
  try {
    const response = await axios.get(`${API_PROJECT}/post`);
    console.log("Posts:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export default getPosts;
