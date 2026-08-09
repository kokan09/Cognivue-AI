import { useContext } from "react";
import { authContext } from "../auth.context.jsx";


function useAuthContext(){
    const context = useContext(authContext);

    return context;
}

export default useAuthContext;