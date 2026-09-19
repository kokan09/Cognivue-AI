import { createContext, useState } from "react";
import {sign_up, sign_in} from "./service/auth.service.js";

export const authContext = createContext();

export function AuthContextProvider({children}){
    const [user, setUser] = useState([]);

    const sign_up_user = async function(data){
        try{
            const response = await sign_up(data);

            setUser(response);
            return response;
        }catch(err){
            console.error(err);
        }
    }

    const sign_in_user = async function(data){
        try{
            const response = await sign_in(data);

            setUser(response);
            return response;
        }catch(err){
            console.error(err);
        }
    }

    return <authContext.Provider value={{sign_up_user, sign_in_user}}>
        {children}
    </authContext.Provider>
}