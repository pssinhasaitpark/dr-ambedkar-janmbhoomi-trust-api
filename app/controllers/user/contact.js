const { handleResponse } = require('../../utils/helper');
const { contactSchema } = require('../../vailidators/validaters');
const { Contact_us } = require('../../models');
const mongoose = require('mongoose');

exports.addContact = async (req, res) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }

    const { first_name, last_name, phone_no, email, location } = req.body;

    try {
        const data = { first_name, last_name, phone_no, email, location };
        const result = new Contact_us(data);
        await result.save();
        
        return handleResponse(res, 201, 'Details added successfully!', result);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, error.message);
    }
};

exports.getContactDetails = async (req, res) => {
    try {
        const contact_details = await Contact_us.find();
        if (!contact_details || contact_details.length === 0) {
            return handleResponse(res, 404, 'No data available in the database');
        }

        return handleResponse(res, 200, 'Contact details retrieved successfully.', contact_details);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Failed to retrieve contact details.');
    }
};

exports.getContactDetailsById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return handleResponse(res, 400, 'The provided ID is not valid. Please provide a valid Id.');
        }

        const contact_details = await Contact_us.findById(id);
        if (!contact_details) {
            return handleResponse(res, 404, `No contact details found for ID: ${id}`);
        }

        return handleResponse(res, 200, 'Contact detail retrieved successfully.', contact_details);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Failed to retrieve contact details.');
    }
};

exports.deleteContactDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const contact_details = await Contact_us.findByIdAndDelete(id);
        if (!contact_details) {
            return handleResponse(res, 404, 'Contact details not found.');
        }

        return handleResponse(res, 200, 'Contact details deleted successfully.', contact_details);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Failed to delete Contact details.');
    }
};

exports.updateContactDetails = async (req, res) => {
    const { first_name, last_name, phone_no, email, location } = req.body;

    try {
        const contact_details = await Contact_us.findById(req.params.id);
        if (!contact_details) {
            return handleResponse(res, 404, 'Details not found.');
        }

        if (first_name) contact_details.first_name = first_name;
        if (last_name) contact_details.last_name = last_name;
        if (email) contact_details.email = email;
        if (phone_no) contact_details.phone_no = phone_no;
        if (location) contact_details.location = location;
    
        await contact_details.save();

        return handleResponse(res, 200, 'Contact details updated successfully!', {
            first_name: contact_details.first_name,
            last_name: contact_details.last_name,
            email: contact_details.email,
            phone_no: contact_details.phone_no,
            location: contact_details.location
        });
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'An error occurred while updating the contact details.');
    }
};
