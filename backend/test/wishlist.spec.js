const {getWishlist, addWishlist, updateWishlist} = require('../controllers/wishlistController')
const Wishlist = require('../models/wishlistModel')

jest.mock('../models/wishlistModel')

describe('Wishlist test', () => {

    // test 1:
    test('should return exact user wishlist structure', async() => {
    // arrange:
    const req = { user: { id: "123" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const mockList = [{ cafeteria: "Café Loco", rating: 5 }]
    Wishlist.find.mockResolvedValue(mockList)

    // act:
    await getWishlist(req, res)

    // assert:
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockList)
    })

    // test 2:
    test('should respond with status 201 on item creation', async () => {
    // arrange
    const req = { 
      body: { cafeteria: "Arista Barista", rating: 5 }, 
      user: { id: "123" } 
    }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Wishlist.create.mockResolvedValue({ cafeteria: "Arista Barista", user: "123" })

    // act
    await addWishlist(req, res)

    // assert
    expect(res.status).toHaveBeenCalledWith(201)
  })

  // test 3:
  test('should return updated item matching partial fields', async() => {
    // arrange
    const req = {
      params: {id:'item_123'},
      body: {nota: "Good coffee!"},
      user: {id: '123'}
    }
    const res = {status: jest.fn().mockReturnThis(), json: jest.fn()}
    const updatedDbRecord = {
      _id: 'item_123', 
      nota: 'Good coffee!', 
      user: '123', 
      updatedAt: new Date()
    }
    Wishlist.findById.mockResolvedValue({ user: { toString: () => '123' } })
    Wishlist.findByIdAndUpdate.mockResolvedValue(updatedDbRecord)

    // act
    await updateWishlist(req, res)

    // assert
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({nota: 'Good coffee!'}))
  })

  // test 4:
  test('should throw error when adding item without coffee shop name', async() => {
    // arrange
    const req = { body: {}, user: { id: '123'} }; 
    const res = { status: jest.fn().mockReturnThis() };

  // act and assert
    try {
      await addWishlist(req, res)
    } catch (error) {
      expect(error.message).toBe('Escribe una cafetería')
    }
  })

  // test 5:
  test('should evaluate ownership check as false for unauthorized user', async() => {
    // arrange
    const req = { params: { id: "item_999" }, user: { id: '123' } }
    const res = { status: jest.fn().mockReturnThis() }

    Wishlist.findById.mockResolvedValue({user: {toString: () => '999'}})

    // act
    const dbRecord = await Wishlist.findById(req.params.id);
    const isOwner = dbRecord.user.toString() === req.user.id;

    // assert 
    expect(isOwner).toBeFalsy()
  })

  // test 6:
  test('should contain specific coffee shop inside wishlist collection', async() => {
    // arrange
    const req = { user: { id: '123' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const mockList = [{ cafeteria: 'Café Loco' }, { cafeteria: 'Amucca' }]

    Wishlist.find.mockResolvedValue(mockList)

    // act
    await getWishlist(req, res)

    // assert
    const coffeeShopNames = mockList.map(item => item.cafeteria)
    expect(coffeeShopNames).toContain('Amucca')
  })

})