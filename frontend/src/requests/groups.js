import axios from "axios";

const BASE_URL = 'http://localhost:8000/api/groups';


export async function createGroup(values) {
    return await axios
        .post(`${BASE_URL}/create`, values, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'content-type': 'multipart/form-data',
            },
        })
        .then((response) => response.data);
}