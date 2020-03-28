import axios from './axios';
import endpoints from './endpoints.js';

async function getTags() {
    try {
        const response = await axios.get(endpoints.tag)
        return response;
    }
    catch(err){
        console.log(err);
    }
}

async function addTag(naslov, opis) {
    try {
        const response = await axios.post(endpoints.tag, {
            naslov: naslov,
            opis: opis
        })
        return response;
    }
    catch(err){
        console.log(err);
    }
}

async function deleteTag(tagId) {
    try {
        const response = await axios.delete(endpoints.tag + tagId, {})
        return response;
    }
    catch(err){
        console.log(err);
    }
}

export {getTags, deleteTag, addTag};