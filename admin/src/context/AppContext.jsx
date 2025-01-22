import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const months = [" ", 'Jan', 'Feb', 'Mar', "Apr", 'May', "Jun", 'Jul', "Aug", 'Sep', "Oct", "Nov", "Dec"]
  
    const currency = '₹'
    const backendurl = import.meta.env.VITE_BACKEND_URL


    const slotDateFormat = (slotDate) => {
      const dateArray = slotDate.split('-')
      return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }
  

const calculateAge = (dob) =>{
    const today = new Date()
    const birthDate  = new Date(dob)

    const age = today.getFullYear() - birthDate.getFullYear()

    return age
}

    const  value = {
    calculateAge ,slotDateFormat,currency,backendurl
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider