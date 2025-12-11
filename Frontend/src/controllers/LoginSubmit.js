import axios from "axios"
import { ToastError } from "./toast"

export const LoginSubmit = async (e, username, password, setLoad, route) => {
    try {

        e.preventDefault()

        setLoad(true)

        const req = await axios.post("http://localhost:5000/api/login", {username, password})
      
        if(req?.data?.message === "Connexion réussie") {
            localStorage.setItem("token", JSON.stringify(req?.data?.user))
            return route("/mes-articles")
        }

        ToastError(req?.data?.message)

    } catch (error) {
        console.log(error)
        ToastError("Une erreur s'est produite")
    } finally {
        setLoad(false)
    }
}