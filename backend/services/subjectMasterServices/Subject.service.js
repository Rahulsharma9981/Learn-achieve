const Subject = require("../../models/subject/Subject.model");
const Utils = require("../../utility/utils");
const MessageConstants = require("../../utility/MessageConstants");
const HttpStatus = require("http-status");

const SubjectService = {
    /**
     * Fetches subjects from the database with the specified limit and skip values,
     * excluding the ones that are marked as deleted.
     * @param {number} limitValue - The limit for the number of classes to fetch.
     * @param {number} offsetValue - The number of classes to skip.
     * @returns {Object} An object containing the fetched classes, or an error response.
     */
    getAllSubjects: async function (limitValue, offsetValue, searchQuery) {
        try {
            // Define base match conditions for active and non-deleted classes and subjects
            const matchConditions = {
                "class.is_deleted": false,
                "class.is_active": true,
                is_deleted: false
            };

            // Add search term condition if provided
            if (searchQuery) {
                // Case-insensitive regex pattern for subject_name field
                matchConditions.$or = [
                    { subject_name: { $regex: searchQuery, $options: 'i' } }, // Search by subject_name
                    { "class.class_name": { $regex: searchQuery, $options: 'i' } } // Search by class_name
                ];
            }

            // Aggregate pipeline to count total matching subjects
            const totalCountAggregate = await Subject.aggregate([
                { $lookup: { from: 'Classes', localField: 'class_id', foreignField: '_id', as: 'class' } },
                { $match: matchConditions },
                { $count: "totalCount" }
            ]).exec();

            const totalCount = totalCountAggregate.length > 0 ? totalCountAggregate[0].totalCount : 0;

            // Aggregate pipeline to fetch subjects with pagination and search conditions
            const subjectsAggregate = await Subject.aggregate([
                { $lookup: { from: 'Classes', localField: 'class_id', foreignField: '_id', as: 'class' } },
                { $match: matchConditions },
                { $skip: offsetValue * limitValue },
                { $limit: limitValue }
            ]).exec();

            const dataToSend = subjectsAggregate.map((element) => ({
                id: element._id,
                subject_name: element.subject_name,
                class_name: element.class[0].class_name,
                class_id: element.class[0]._id,
                is_active: element.is_active,
                is_deleted: element.is_deleted
            }));

            return { availableDataCount: totalCount, data: dataToSend };
        } catch (error) {
            return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    },

    /**
     * Fetches subjects from the database with the specified limit and skip values,
     * excluding the ones that are marked as deleted.
     * @returns {Object} An object containing the fetched subjects, or an error response.
     */
    getAllSubjectsWithoutPagination: async function (class_id) {
        try {
            var condition = { is_deleted: false, is_active: true }
            if (class_id) {
                condition.class_id = class_id;
            }
            // Fetch subjects from the database with the specified limit, skip, and not deleted
            const data = await Subject.find(condition);
            return { message: MessageConstants.SUCCESS, data: data };
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Add a new subject to the database.
     * @param {string} subject_name - The name of the subject.
     * @param {string} class_id - The ID of the class to which the subject belongs.
     * @returns {Object} An object containing a success message and the newly created subject.
     * @throws {Error} If there's an error creating the subject.
     */
    addSubject: async function (subject_name, class_id) {
        try {
            const emptyParams = Utils.checkEmptyParams(
                { subject_name: "subject_name", value: subject_name },
                { class_id: "class_id", value: class_id }
            );

            if (emptyParams.length > 0) {
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            if (await Subject.findOne({ subject_name: subject_name.trim(), class_id: class_id, is_deleted: false })) {
                return Utils.errorResponse(MessageConstants.SUBJECT_ALREADY_EXISTS);
            }

            const subject = await Subject.create({ subject_name, class_id });
            return { message: "Subject created successfully", subject };
        } catch (error) {
            return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    },

    /**
     * Delete a subject from the database.
     * @param {string} subjectId - The ID of the subject to be deleted.
     * @returns {Object} An object containing a success message and the deleted subject.
     * @throws {Error} If the subject is not found or if there's an error deleting the subject.
     */
    deleteSubject: async function (ids) {
        try {
            // Check if IDs array is provided and not empty
            if (!Array.isArray(ids) || ids.length === 0) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            const invalidIds = [];

            // Validate and mark classes as deleted using Promise.all
            await Promise.all(
                ids.map(async (id) => {
                    const existingData = await Subject.findById(id);
                    if (!existingData) {
                        invalidIds.push(id);
                    } else {
                        existingData.is_deleted = true;
                        await existingData.save();
                    }
                })
            );

            // Check if class exists
            if (invalidIds.length > 0) {
                return Utils.errorResponse(
                    MessageConstants.INVALID_ID + ` ${invalidIds.join(",")}`
                );
            }

            return { message: MessageConstants.DELETE };
        } catch (error) {
            return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    },

    /**
     * Update the status (is_active) of a subject in the database.
     * @param {string} id - The ID of the subject to be updated.
     * @param {boolean} is_active - The new status value for the subject (true/false).
     * @returns {Object} An object containing a success message and the updated subject.
     * @throws {Error} If the subject is not found or if there's an error updating the status.
     */
    updateSubjectStatus: async function (id, is_active) {
        try {
            // Check if the subject exists
            const existingSubject = await Subject.findById(id);

            if (!existingSubject) {
                return Utils.errorResponse(MessageConstants.SUBJECT_NOT_FOUND);
            }

            // Update the is_active field
            existingSubject.is_active = is_active;

            // Save the updated subject to the database
            await existingSubject.save();

            return {
                message: `Subject ${is_active ? "activated" : "deactivated"} successfully`,
                subject: existingSubject,
            };
        } catch (error) {
            return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    },

    /**
     * Update the name of a subject in the database by its ID.
     * @param {string} id - The ID of the subject to be updated.
     * @param {string} subject_name - The new name for the subject.
     * @returns {Object} An object containing a success message and the updated subject.
     * @throws {Error} If the subject is not found or if there's an error updating the subject.
     */
    updateSubject: async function (id, class_id, subject_name) {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "subject_name", value: subject_name },
                { name: "class_id", value: class_id }
            );

            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            // Find the study material by its ID
            var subjectData = await Subject.findById({
                _id: id,
                is_deleted: false,
            });

            // Check if study material exists
            if (!subjectData) {
                // Return error message if study_material_id is invalid
                return { message: MessageConstants.INVALID_ID };
            }

            if (await Subject.findOne({ _id: { $ne: id }, subject_name: subject_name.trim(), class_id: class_id, is_deleted: false })) {
                return Utils.errorResponse(MessageConstants.SUBJECT_ALREADY_EXISTS);
            }

            // Save the updated study material
            subjectData = await Subject.findByIdAndUpdate(
                id,
                {
                    class_id: class_id,
                    subject_name: subject_name,
                    updated_date: new Date(),
                },
                { new: true }
            ).populate({
                path: "class_id",
                select: "class_name",
            });

            const dataToSend = {
                id: subjectData._id, // Assigning _id to study_material_id in the response
                subject_name: subjectData.subject_name,
                class_name: subjectData.class_id.class_name,
                class_id: subjectData.class_id._id,
                is_active: subjectData.is_active,
                is_deleted: subjectData.is_deleted,
            };

            // Return success message along with the updated study material object
            return { message: MessageConstants.UPDATE_SUCCESS, data: dataToSend };
        } catch (error) {
            console.log(error);
            return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    },
};

module.exports = SubjectService;
