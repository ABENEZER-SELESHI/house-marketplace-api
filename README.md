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
  "email": "ebenezerseleshi@example.com",
  "password": "johndoe"
}

//login
{
  "email": "ebenezerseleshi@example.com",
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
    "price": 150000,
    "specialRequirements": "No drugs"
}
