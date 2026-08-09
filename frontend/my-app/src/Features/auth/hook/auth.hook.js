import { useContext } from "react";
import { authContext } from "../auth.context.jsx";

function useAuthContext() {
    const context = useContext(authContext);

    if (!context) {
        return {
            sign_up_user: async () => {
                throw new Error('Auth context is not available.');
            },
        };
    }

    return context;
}

export default useAuthContext;