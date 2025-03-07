


import biryaniSCImg from "/images/Food/biryani.png";
import biryaniSCImg2 from "/images/Food/biryani2.png";
import chapathiImg from "/images/Food/chapathi.png";
import fishImg from "/images/Food/fish.png";
import icecreamImg from "/images/Food/icecream.png";
import kfcSCImg from "/images/Food/kfc.png";
import pizzaSCImg from "/images/Food/pizza.png";



export const clientSideRestaurants = [
    {
        _id: 1,
        type: "Newly added",
        cuisine: "Japanese",
        promoted: true,
        time: "35",
        offB: true,
        proExtraB: false,
        off: "30",
        proExtra: "40",
        name: "Paradise Hotel",
        rating: 4.3,
        price: 350,
        seating: "Outdoor",
        alcohol: "No Alcohol",
        petFriendly: true,
        openNow: true,
        veg: true,
        offers: false,
        pub: false,
        cuisines: ["indian", "biryani", "mexican"],
        wheelchairAccessible: false,
        creditCard: true,
        buffet: false,
        happyHours: false,
        servesAlcohol: false,
        sundayBrunch: false,
        dessertsAndBakes: true,
        luxuryDining: false,
        cafes: false,
        fineDining: false,
        wifi: true,
        outdoorSeating: true,
        onlineBookings: true,
        hygieneRated: false,
        pubsAndBars: false,
        imgSrc: biryaniSCImg,
        link2: "/hyderabad/paraside/tiffin",
        costForTwo: 500,
        distance: 2.5,
    },
    {
        _id: 2,
        type: "Offer Based",
        cuisine: "Italian",
        promoted: false,
        time: "45",
        offB: true,
        proExtraB: false,
        off: "30",
        proExtra: "40",
        name: "Mangal Hotel",
        rating: 2.6,
        price: 300,
        seating: "Indoor",
        alcohol: "No Alcohol",
        petFriendly: false,
        offers: true,
        veg: false,
        openNow: true,
        pub: false,
        cuisines: ["indian", "mexican"],
        wheelchairAccessible: false,
        creditCard: false,
        buffet: false,
        happyHours: false,
        servesAlcohol: false,
        sundayBrunch: false,
        dessertsAndBakes: false,
        luxuryDining: false,
        cafes: false,
        fineDining: false,
        wifi: false,
        outdoorSeating: false,
        onlineBookings: false,
        hygieneRated: false,
        pubsAndBars: false,
        imgSrc: biryaniSCImg2,
        link2: "/hyderabad/paraside/tiffin",
        costForTwo: 400,
        distance: 3.0,
    },
    {
        _id: 3,
        type: "Live Event",
        cuisine: "Mexican",
        promoted: true,
        time: "20",
        offB: false,
        proExtraB: true,
        off: "30",
        proExtra: "40",
        name: "Chapathi Hotel",
        rating: 4.6,
        price: 400,
        seating: "Outdoor",
        alcohol: "No Alcohol",
        petFriendly: true,
        openNow: false,
        offers: false,
        pub: false,
        cuisines: ["indian", "homestyle"],
        wheelchairAccessible: false,
        creditCard: true,
        buffet: false,
        happyHours: false,
        servesAlcohol: false,
        sundayBrunch: false,
        dessertsAndBakes: true,
        luxuryDining: false,
        cafes: false,
        fineDining: false,
        wifi: true,
        outdoorSeating: true,
        onlineBookings: false,
        hygieneRated: true,
        pubsAndBars: false,
        imgSrc: chapathiImg,
        link2: "/hyderabad/paraside/tiffin",
        costForTwo: 600,
        distance: 2.8,
    },
    {
        _id: 4,
        type: "Newly added",
        cuisine: "Mexican",
        promoted: false,
        time: "24",
        offB: true,
        proExtraB: false,
        off: "30",
        proExtra: "40",
        name: "Fish Mandi Hotel",
        rating: 4.9,
        price: 450,
        seating: "Outdoor",
        alcohol: "Alcohol",
        petFriendly: false,
        openNow: false,
        veg: false,
        offers: true,
        pub: true,
        cuisines: ["seafood", "indian"],
        wheelchairAccessible: true,
        creditCard: true,
        buffet: true,
        happyHours: false,
        servesAlcohol: true,
        sundayBrunch: false,
        dessertsAndBakes: false,
        luxuryDining: false,
        cafes: false,
        fineDining: true,
        wifi: true,
        outdoorSeating: true,
        onlineBookings: true,
        hygieneRated: true,
        pubsAndBars: true,
        imgSrc: fishImg,
        link2: "/hyderabad/paraside/tiffin",
        costForTwo: 700,
        distance: 4.2,
    },
    {
        _id: 5,
        type: "Newly added",
        cuisine: "Japanese",
        promoted: true,
        time: "25",
        offB: false,
        proExtraB: true,
        off: "30",
        proExtra: "40",
        name: "MangalCaptain Hotel",
        rating: 4.5,
        price: 250,
        seating: "Outdoor",
        alcohol: "Alcohol",
        petFriendly: true,
        openNow: true,
        veg: false,
        offers: true,
        pub: true,
        cuisines: ["desserts", "mexican"],
        wheelchairAccessible: false,
        creditCard: false,
        buffet: false,
        happyHours: false,
        servesAlcohol: true,
        sundayBrunch: false,
        dessertsAndBakes: true,
        luxuryDining: false,
        cafes: false,
        fineDining: true,
        wifi: true,
        outdoorSeating: true,
        onlineBookings: true,
        hygieneRated: false,
        pubsAndBars: true,
        imgSrc: icecreamImg,
        link2: "/hyderabad/paraside/tiffin",
        costForTwo: 350,
        distance: 1.8,
    },
    {
        _id: 6,
        type: "Newly added",
        cuisine: "American",
        promoted: false,
        time: "55",
        offB: true,
        proExtraB: false,
        off: "30",
        proExtra: "40",
        name: "KFCS Hotel",
        rating: 4.7,
        price: 300,
        seating: "Indoor",
        alcohol: "No Alcohol",
        petFriendly: false,
        veg: true,
        openNow: true,
        offers: false,
        pub: true,
        cuisines: ["american", "italian", "chinese"],
        wheelchairAccessible: true,
        creditCard: true,
        buffet: false,
        happyHours: true,
        servesAlcohol: false,
        sundayBrunch: false,
        dessertsAndBakes: false,
        luxuryDining: false,
        cafes: false,
        fineDining: true,
        wifi: false,
        outdoorSeating: false,
        onlineBookings: false,
        hygieneRated: false,
        pubsAndBars: true,
        imgSrc: kfcSCImg,
        link2: "/hyderabad/paraside/tiffin",
        costForTwo: 500,
        distance: 3.5,
    },
    {
        _id: 7,
        type: "Newly added",
        cuisine: "American",
        promoted: true,
        time: "29",
        offB: true,
        proExtraB: false,
        off: "30",
        proExtra: "40",
        name: "Pizza Hotel",
        rating: 3.7,
        price: 350,
        seating: "Outdoor",
        alcohol: "No Alcohol",
        petFriendly: false,
        openNow: true,
        veg: false,
        offers: true,
        pub: true,
        cuisines: ["italian", "american", "chinese"],
        wheelchairAccessible: false,
        creditCard: true,
        buffet: false,
        happyHours: false,
        servesAlcohol: false,
        sundayBrunch: false,
        dessertsAndBakes: false,
        luxuryDining: false,
        cafes: true,
        fineDining: false,
        wifi: false,
        outdoorSeating: true,
        onlineBookings: false,
        hygieneRated: false,
        pubsAndBars: true,
        imgSrc: pizzaSCImg,
        link2: "/hyderabad/paraside/tiffin",
        costForTwo: 550,
        distance: 2.0,
    },
    {
        _id: 8,
        type: "Newly added",
        cuisine: "American",
        promoted: false,
        time: "25",
        offB: true,
        proExtraB: false,
        off: "30",
        proExtra: "40",
        name: "Mutton Mandi Hotel",
        rating: 4.6,
        price: 400,
        seating: "Indoor",
        alcohol: "Alcohol",
        petFriendly: true,
        veg: false,
        openNow: true,
        offers: false,
        pub: false,
        cuisines: [
            "indian",
            "japanese",
            "thai",
            "vietnamese",
            "chains",
            "sundayBrunch",
        ],
        wheelchairAccessible: false,
        creditCard: false,
        buffet: true,
        happyHours: false,
        servesAlcohol: true,
        sundayBrunch: false,
        dessertsAndBakes: false,
        luxuryDining: true,
        cafes: true,
        fineDining: false,
        wifi: true,
        outdoorSeating: false,
        onlineBookings: true,
        hygieneRated: false,
        pubsAndBars: false,
        imgSrc: fishImg,
        link2: "/hyderabad/paraside/tiffin",
        costForTwo: 600,
        distance: 3.8,
    },
    {
        _id: 9,
        type: "Offer Based",
        cuisine: "American",
        promoted: true,
        time: "27",
        offB: false,
        proExtraB: true,
        off: "30",
        proExtra: "40",
        name: "AmericaCaptain Hotel",
        rating: 3.6,
        price: 300,
        seating: "Indoor",
        alcohol: "No Alcohol",
        petFriendly: false,
        openNow: false,
        veg: false,
        offers: true,
        pub: true,
        cuisines: [
            "american",
            "japanese",
            "korean",
            "mediterranean",
            "fusion",
        ],
        wheelchairAccessible: true,
        creditCard: true,
        buffet: false,
        happyHours: false,
        servesAlcohol: false,
        sundayBrunch: false,
        dessertsAndBakes: false,
        luxuryDining: true,
        cafes: false,
        fineDining: false,
        wifi: false,
        outdoorSeating: false,
        onlineBookings: false,
        hygieneRated: true,
        pubsAndBars: true,
        imgSrc: icecreamImg,
        link2: "/hyderabad/paraside/tiffin",
        costForTwo: 450,
        distance: 2.2,
    },
];