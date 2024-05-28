const contactUsService = require("../../services/webService/contactUs.service");
const Utils = require("../../utility/utils");

const contactUsController = {

    /**
     * Handles the registration of an admin user through API.
     * @param {Express.Request} req - The Express request object containing user data
     * @param {Express.Response} res - The Express response object
     */
    addContactApi: async function (req, res) {
        // Extract user data from the request body
        const contactData = req.body;

        // Call the registerUser method from the contactUsService to register the admin user
        const result = await contactUsService.addContactApi(contactData);

        // Send the response back to the client using Utils.sendResponse
        Utils.sendResponse(result, req, res);
    },
};

module.exports = contactUsController;
