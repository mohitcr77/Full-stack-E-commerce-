import { useEffect, useState } from 'react'
import axios from 'axios'

const UserAPI = (token) => {

    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])

    useEffect(()=>{
        if(token){
            const getUser = async() =>{
                try {
                    const res = await axios.get('user/info',{
                        headers :{Authorization:token}
                    })

                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true): setIsAdmin(false)

                    // console.log(res);
                } catch (error) {
                    alert(error.res.data.msg)
                }
            }
        getUser()
        }
    },[token])

    const addCart = async(product) =>{
        if(!isLogged)
            return alert("Please Login")

    

    const check = cart.every(item =>{
        return item.id !== product.id
    })

    if (check) {
        setCart([...cart, { ...product, quantity: 1 }]);
    } else {
        alert("This product has already been added to the cart.");
    }}
  return {
    isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart:[cart,setCart],
        addCart : addCart
  }
}

export default UserAPI