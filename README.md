notes:{
  *** when doing search with my react code don't forget to useDebounce so that my api isn't spammed with every key stroke.
}


Essential Routes

    POST /api/auth/register — User registration

    POST /api/auth/login — Login

    POST /api/houses — Seller posts house (after paying posting fee)

    GET /api/houses — List all houses

    GET /api/houses/:id — Get house detail

    POST /api/payments/checkout — Buyer makes payment to view contact info

    GET /api/contact-info/:houseId — Buyer gets contact after payment

//POSTMAN INPUTS
//

//register
{
  "name": "John Doe",
  "email": "",
  "password": "johndoe"
}

//login
{
  "email": "",
  "password": "johndoe"
}

//post house
{
    "fullViewPicture": "https://via.placeholder.com/600x400",
    "roomPictures": [
        "https://via.placeholder.com/400x300",
        "https://via.placeholder.com/400x300",
        "https://via.placeholder.com/400x300"
    ],
    "numRooms": 3,
    "numBedrooms": 2,
    "areaSize": 120,
    "location": {
        "address": "Bole Road, near Friendship Building",
        "district": "Bole",
        "coordinates": {
            "lat": 9.0108,
            "lng": 38.7613
        }
    },
    "price": 150000,
    "rentOrSale": "sale",
    "specialRequirements": "No drugs",
    "amenities": ["wifi", "parking", "balcony"],
    "furnished": true,
    "yearBuilt": 2015,
    "isVerified": false
}

//checkout
{
  "houseId": "6832d44b90fca5ee239795ba",
  "amount": 1000
}


