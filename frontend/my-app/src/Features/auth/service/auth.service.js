import API from "../../../service/api.js";

export const sign_up = async (data) => {
    try{
        const resp = await API.post("/auth/sign-up", data);

        return resp.data;
    }catch(error){
        throw new Error(error);
    }
}

export const sign_in = async (data) => {
    try{
        const resp = await API.post("/auth/sign-in", data);

        return resp.data;
    }catch(error){
        throw new Error(error);
    }
}