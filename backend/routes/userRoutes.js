const { Router } = require('express');
const { registerUser, loginUser, getUser, changeAvatar, editUser } = require('../controllers/userController')
const router = Router();
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', (req, res, next) => {
    req.json("This is the user route")
})

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUser);
router.post('/change-avatar',authMiddleware, changeAvatar);
router.patch('/edit-user/:id', editUser);

module.exports = router;