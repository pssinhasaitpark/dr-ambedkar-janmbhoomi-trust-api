const { handleResponse } = require('../../utils/helper');
const { Newsletter } = require('../../models');

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;


    const existingSubscription = await Newsletter.findOne({ email });

    if (existingSubscription) {
      return handleResponse(res, 400, 'This email is already subscribed');
    }
    const data = new Newsletter({ email });

    await data.save();

    handleResponse(res, 201, 'Subscribed successfully', data);
  } catch (error) {
    console.error("Error:", error);
    return handleResponse(res, 500, 'Internal server error', error.message);
  }
};
