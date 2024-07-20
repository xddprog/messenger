import axios from "axios"

const BASE_URL = 'http://127.0.0.1:5000/api/posts'


export async function getAllPosts() {
    return await axios.get(
        `${BASE_URL}/all`
    ).then(response => response.data)
}