import axios from './axios';
import endpoints from './endpoints.js';

export default async function fetchTags() {
    try {
        const response = await axios.get(endpoints.tag, {})
        return response;
    }
    catch(err){
        console.log(err);
    }
}