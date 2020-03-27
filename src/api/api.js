import axios from './axios';
import endpoints from './endpoints.js';

export default async function fetchTags() {
    await axios
        .get(endpoints.tag, {})
        .then(res => {
            const data = res.data;
            console.log(data);
            return data;
        })
        .catch((error) => {
            console.log(error)
        })
}