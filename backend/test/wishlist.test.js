const {getWishlist, addWishlist, updateWishlist} = require('../controllers/wishlistController')
const Wishlist = require('../models/wishlistModel')

jest.mock('../models/wishlistModel')

describe('Wishlist tests', () => {

    // test 1:
    test("should get the user's coffee shop wishlist", async() => {
     // arrange:
    const req = { user: { id: "123" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
    const expectedList = [{ cafeteria: 'Arista Barista' }]

    Wishlist.find.mockResolvedValue(expectedList)
    // act:
    await getWishlist(req, res);

    //assert:
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedList);
    })

    // test 2:
    test("should add a new coffee shop to the wishlist", async() => {
    // arrange:
    const req = { 
      body: { cafeteria: 'Amucca' }, 
      user: { id: '123' } 
    }

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn()};
    Wishlist.create.mockResolvedValue({ cafeteria: 'Amucca', user: "123" });

    // act
    await addWishlist(req, res)

    // assert:
    expect(res.status).toHaveBeenCalledWith(201)
    })

    // test 3:
    test('should reject update if user is not the owner', async() => {
        // arrange:
        const req = { 
        params: { id: '987' }, 
        body: { nota: 'tasty' },
        user: { id: '123' } 
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        Wishlist.findById.mockResolvedValue({ user: '987' });

        // act:
        try {
            await updateWishlist(req, res);
        } catch (error) {
      // assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(error.message).toBe("No autorizado para editar esta lista");
    }
    })
})

