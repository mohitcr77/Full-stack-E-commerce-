import { createContext, useEffect, useState } from "react";
import ProductAPI from "./api/ProductAPI";
import UserAPI from "./api/UserAPI";
import axios from "axios";

export const GlobalState = createContext()

export const DataProvider = ({children}) => {

    const [token, setToken] = useState(false)

    const refreshToken = async() =>{
        try {
            const res = await axios.get('/user/refresh_token')
        setToken(res.data.accessToken)
        } catch (error) {
            console.log(error);
        }
        
    }

    useEffect(()=>{
        const firstLogin = localStorage.getItem('firstLogin')
        if(firstLogin) refreshToken()
    })

    const state = {
        token: [token, setToken],
        productsAPI:ProductAPI(),
        userAPI :UserAPI(token)
    }

    ProductAPI()
        return(
            <GlobalState.Provider value={state}>
                {children}
            </GlobalState.Provider>
        )
}