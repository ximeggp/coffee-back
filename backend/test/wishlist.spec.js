const {getWishlist, addWishlist, updateWishlist} = require('../controllers/wishlistController')
const Wishlist = require('../models/wishlistModel')

jest.mock('../models/wishlistModel')

// static:
const user_id = '123'
const user_id2 = '987'
const coffee_wl = [{cafeteria: 'Café loco'}, {cafeteria: 'Amucca'}]

// dynamic:
function createItem(overrides = {}) {
  return {
    _id: 'item_123',
    cafeteria: 'Arista Barista',
    nota: '',
    user: user_id,
    ...overrides
  }
}

describe('Wishlist test', () => {
  let req
  let res

    
    beforeAll(() => {
      console.log('Se da inicio a los test :)')
    })

    beforeEach(() => {
      req = { user: { id: user_id }, params: {}, body: {}}
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    afterAll(() => {
      console.log('Todos los tests han finalizado :)')
    })

    // test 1:
    test('should return exact user wishlist structure', async() => {
    // arrange:
    Wishlist.find.mockResolvedValue(coffee_wl)

    // act:
    await getWishlist(req, res)

    // assert:
    expect(Wishlist.find).toHaveBeenCalledWith({user: user_id}) // new line
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(coffee_wl)
    })

    // test 2:
    test('should respond with status 201 on item creation', async () => {
    // arrange
      req.body = { cafeteria: "Arista Barista"}
      Wishlist.create.mockResolvedValue(createItem()) // new line

    // act
    await addWishlist(req, res)

    // assert
    expect(res.status).toHaveBeenCalledWith(201)
  })

  // test 3:
  test('should return updated item matching partial fields', async() => {
    // arrange
    const item = createItem() // new
    req.params = {id: item._id} // new
    req.body = {nota: 'Good coffee!'} // new
    Wishlist.findById.mockResolvedValue(item) // new
    Wishlist.findByIdAndUpdate.mockResolvedValue(createItem({nota: 'Good coffee!'})) // new

    // act
    await updateWishlist(req, res)

    // assert
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({nota: 'Good coffee!'}))
  })

  // test 4:
  test('should throw error when adding item without coffee shop name', async() => {
    // arrange
    req.body = {} // new

  // act and assert
    await expect(addWishlist(req,res)).rejects.toThrow('Escribe una cafetería')
    expect(res.status).toHaveBeenCalledWith(400)
  })

  // test 5:
  test('should evaluate ownership check as false for unauthorized user', async() => {
    // arrange
    const otherItem = createItem({_id: 'item_987', user: user_id2}) // new
    req.params = {id: otherItem._id}
    req.body = {nota: 'hack'} // new
    Wishlist.findById.mockResolvedValue(otherItem)

    // act and assert
    await expect(updateWishlist(req, res)).rejects.toThrow('No autorizado para editar')
    expect(res.status).toHaveBeenCalledWith(403) 
    expect(Wishlist.findByIdAndUpdate).not.toHaveBeenCalled()
  })

  // test 6:
  test('should contain specific coffee shop inside wishlist collection', async() => {
    // arrange
    Wishlist.find.mockResolvedValue(coffee_wl)

    // act
    await getWishlist(req, res)

    // assert
    const coffeeShopNames = res.json.mock.calls[0][0].map(item => item.cafeteria)
    expect(coffeeShopNames).toContain('Amucca')
  })

  })