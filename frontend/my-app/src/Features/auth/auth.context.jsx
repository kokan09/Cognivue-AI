import { createContext, useState } from "react";
import {sign_up} from "./service/auth.service.js";

export const authContext = createContext();

export function AuthContextProvider({children}){
    const [user, setUser] = useState([]);

    const sign_up_user = async function(data){
        try{
            const response = await sign_up(data);

            console.log(response);

            setUser(response);
            return response;
        }catch(err){
            console.error(err);
            throw err;
        }
    }

    return <authContext.Provider value={{sign_up_user}}>
        {children}
    </authContext.Provider>
}