const { handleResponse } = require("../../utils/helper");
const { Donation_collection } = require("../../models");
const { donationCollectionSchema } = require("../../vailidators/validaters");
const mongoose = require('mongoose');
const razorpayInstance = require('../../utils/razorpay');
const crypto = require('crypto');


exports.collectDonation = async (req, res) => {
    try {
        const { error } = donationCollectionSchema.validate(req.body);
        if (error) {
            return handleResponse(res, 400, error.details[0].message);
        }

        const { amount, full_name, email, phone } = req.body;
        const orderOptions = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${new Date().getTime()}`,
            payment_capture: 1,
        };

        const order = await razorpayInstance.orders.create(orderOptions);
        // console.log("order=====", order);


        if (!order) {
            return handleResponse(res, 500, "Error creating Razorpay order");
        }

        const donationData = {
            amount,
            full_name,
            phone,
            email,
            orderId: order.id,
        };

        const newDonation = new Donation_collection(donationData);
        await newDonation.save();
        // console.log("newDonation====", newDonation);

        return handleResponse(res, 201, "Donation created successfully. Payment pending",
            donationData
        );
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "Error in adding donation", error.message);
    }
};



exports.verifyPayment = async (req, res) => {

    const { paymentId, orderId, signatureId } = req.body;

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

        console.log(" process.env.RAZORPAY_KEY_SECRET===", process.env.RAZORPAY_KEY_SECRET);
        
        console.log("generatedSignature===",generatedSignature);
        console.log("signatureId====",signatureId);
        console.log("paymentId===",paymentId);
        console.log("orderId====",orderId)
        
        
        
        
    if (generatedSignature === signatureId) {
        try {
            const payment = await razorpayInstance.payments.fetch(paymentId);

            if (payment.status === 'captured' && payment.order_id === orderId) {
                const donation = await Donation_collection.findOne({ orderId: orderId });

                if (donation) {
                    donation.paymentStatus = 'completed';
                    donation.paymentId = paymentId;
                    await donation.save();
                    console.log("Payment verified and donation successful")
                    return handleResponse(res, 200, "Payment verified and donation successful");
                } else {
                    return handleResponse(res, 404, "Donation not found for the provided orderId");
                }
            } else {
                return handleResponse(res, 400, "Payment not captured or incorrect order ID");
            }
        } catch (error) {
            console.error('Error fetching payment details:', error);
            return handleResponse(res, 500, "Error verifying payment", error.message);
        }
    } else {
        return handleResponse(res, 400, "Signature mismatch");
    }
};


exports.getCollectDonationData = async (req, res) => {
    try {
        const data = await Donation_collection.find().sort({ createdAt: -1 });
        if (!data || data.length === 0) {
            return handleResponse(res, 404, "No data available in the database");
        }

        return handleResponse(res, 200, "All Donation Collection Details fetched successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error fetching Donation Collection details", error.message);
    }
};

exports.getCollectDonationDataById = async (req, res) => {
    try {
        if (!req.params.id) {
            return handleResponse(res, 404, "Please provide ID");
        }
        if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
            return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
        }

        const data = await Donation_collection.findById(req.params.id);

        if (!data) {
            return handleResponse(res, 404, "Data not found with provided ID");
        }

        return handleResponse(res, 200, "Data retrieved successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error retrieving  data", error.message);
    }
};

exports.updateDonationDetails = async (req, res) => {
    const { error } = donationCollectionSchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }

    const { id } = req.params;
    const { amount, full_name, email, phone, events } = req.body;


    try {

        const updatedColletion = await Donation_collection.findByIdAndUpdate(
            id,
            {
                amount,
                full_name,
                email,
                phone
            },
            { new: true }
        );

        if (!updatedColletion) {
            return handleResponse(res, 404, "Data not found.");
        }

        return handleResponse(res, 200, "Data updated successfully.", updatedColletion);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "Error updating Data details", error.message);
    }
};

exports.deleteDonationDetails = async (req, res) => {
    try {
        if (!req.params.id) {
            return handleResponse(res, 404, "Please provide ID");
        }
        if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
            return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
        }
        const data = await Donation_collection.findByIdAndDelete(req.params.id);
        if (!data) {
            return handleResponse(res, 404, "Data not found");
        }
        return handleResponse(res, 200, "Data deleted successfully", { data });
    } catch (error) {
        return handleResponse(res, 500, "Error deleting Donation details details", error.message);
    }
};


/*
exports.collectDonation = async (req, res) => {
    try {

        const { error } = donationCollectionSchema.validate(req.body);
        if (error) {
            return handleResponse(res, 400, error.details[0].message);
        }

        const { amount, full_name, email, phone, events } = req.body;


        const data = {
            amount,
            full_name,
            phone,
            email
        };


        newData = new Donation_collection(data);
        await newData.save();

        return handleResponse(res, 201, " Doantion succesfully added successfully!", newData);

    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "Error in adding donation", error.message);
    }
};
*/

// exports.verifyPayment = async (req, res) => {
//     const { paymentId, orderId } = req.body;

//     try {

//         const payment = await razorpayInstance.payments.fetch(paymentId);
//         if (payment.order_id === orderId && payment.status === 'captured') {
//             const donation = await Donation_collection.findOne({ orderId: orderId });
//             if (donation) {
//                 donation.paymentStatus = 'completed';
//                 donation.paymentId = paymentId;
//                 await donation.save();
//                 return handleResponse(res, 200, "Payment verified and donation successful");
//             }
//         }

//         return handleResponse(res, 400, "Payment verification failed");
//     } catch (error) {
//         console.error(error);
//         return handleResponse(res, 500, "Error verifying payment", error.message);
//     }
// };