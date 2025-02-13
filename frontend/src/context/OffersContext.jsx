import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios'

const OffersContext = createContext()

export const OffersProvider = ({ children }) => {

    const [offers, setOffers] = useState([]);
    
    const refetchOffers = () => {
        try {
            axios.get('http://localhost:5000/offers')
                .then(response => {
                    setOffers(response.data);
                })
            console.log(offers)
        }
        catch (error) {
            console.error('Error fetching Offers:', error);
        }
    };

    // fetch offers on initial mount
    useEffect(() => {   
        refetchOffers()
    }, []);

    // Handlers
    const handleAddOffer = async (newOffer) => {
        try {
            const response = await fetch('http://localhost:5000/offers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOffer)
            });
            const data = await response.json();

            // Ensure offers is updated correctly
            setOffers((prevOffers) => [...prevOffers, data]);

            // Refetch offers from backend (optional)
            refetchOffers();
        } catch (err) {
            console.log('Error while creating new offer', err);
        }
    };


    const handleRemoveOffer = async (offerId) => {
        try {
            await fetch(`http://localhost:5000/offers/${offerId}`, {
                method: 'DELETE',
            })
            refetchOffers()
        }
        catch (err) {
            console.log('error while deleting', err)
        }
    };

    const handleEditOffer = async (offerId, updatedFields) => {
        try {
            const res = await fetch(`http://localhost:5000/offers/${offerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFields),
            })

            await res.json()
            console.log('updated offer')
            refetchOffers()
        } catch (err) {
            console.log("error while: ", err)
        }
    }

    return(
        <OffersContext.Provider value={{offers, handleAddOffer, handleEditOffer, handleRemoveOffer}}>
            {children}
        </OffersContext.Provider>
    )
}

// custom hook to use OffersContext
export const useOffers = () => useContext(OffersContext)