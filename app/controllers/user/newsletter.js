const { handleResponse } = require('../../utils/helper');
const { Newsletter } = require('../../models');
const mongoose = require('mongoose');


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
    const subscriptions = await Newsletter.find().sort({ createdAt: -1 });

    if (subscriptions.length === 0) {
      return handleResponse(res, 404, 'No subscriptions found');
    }

    handleResponse(res, 200, 'Fetched all subscriptions successfully', subscriptions);
  } catch (error) {
    console.error("Error:", error);
    return handleResponse(res, 500, 'Internal server error', error.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
    }

    const validStatuses = ['subscribed', 'unsubscribed'];
    if (!validStatuses.includes(status)) {
      return handleResponse(res, 400, "Invalid status. Status must be either 'subscribed' or 'unsubscribed'.");
    }

    const updatedSubscriber = await Newsletter.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedSubscriber) {
      return handleResponse(res, 404, "Subscriber not found.");
    }

    handleResponse(res, 200, 'Subscriber updated successfully', updatedSubscriber);
  } catch (error) {
    console.error("Error:", error);
    return handleResponse(res, 500, 'Internal server error', error.message);
  }
};



