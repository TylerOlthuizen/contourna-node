const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv').config();

//enabling cors
app.use(cors());

//Parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//POST route
router.post('/post', async (req, res) => {
  //Destructuring response token from request body
  if (!req.body.token) {
    //check response status and send back to the client-side
    //sends secret key and response token to google
    return res
      .status(400)
      .json({ error: 'reCaptcha token is missing' });
  }

  try {
    const googleVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body.token}`;
    const response = await axios.post(googleVerifyURL);
    const { success } = response.data;
    if (success) {
      // Do sign up and store user in database
      return res.json({ success: true });
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid Captcha. Try again.' });
    }
  } catch (e) {
    return res.status(400).json({ error: 'reCaptcha error.' });
  }
});

app.listen(443, () => {
  console.log(`server is running on `);
});
