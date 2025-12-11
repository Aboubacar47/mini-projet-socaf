import axios from "axios"
import { ToastError, ToastSuccess } from "./toast"

export const SignUpSubmit = async (e, username, password, role, setLoad, route) => {
    try {

        e.preventDefault()

        setLoad(true)

        const req = await axios.post("http://localhost:5000/api/new-user", {username, password, role})
      
        if(req?.data?.message === "Utilisateur ajouté avec succès") {
            ToastSuccess(req?.data?.message)
            setTimeout(() => {
                route("/")
            }, 2000)
        } else {
            ToastError(req?.data?.message)
        }

    } catch (error) {
        console.log(error)
        ToastError("Une erreur s'est produite")
    } finally {
        setLoad(false)
    }
}