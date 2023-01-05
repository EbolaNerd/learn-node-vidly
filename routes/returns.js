const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    if(!req.body.customerId) return res.status(400).send('customerId not provided.');
});

module.exports = router;