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

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Newsletter.find();

    if (subscriptions.length === 0) {
      return handleResponse(res, 404, 'No subscriptions found');
    }

    handleResponse(res, 200, 'Fetched all subscriptions successfully', subscriptions);
  } catch (error) {
    console.error("Error:", error);
    return handleResponse(res, 500, 'Internal server error', error.message);
  }
};



