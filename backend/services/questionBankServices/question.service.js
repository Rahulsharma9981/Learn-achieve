const QuestionModel = require("../../models/questionBankModel/Question.model");
const SubQuestionModel = require("../../models/questionBankModel/SubQuestion.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported
const { default: mongoose } = require("mongoose");
const fs = require("fs");
const xlsx = require("xlsx");
const csv = require("csv-parse");
const {
    importQuestionsFromFile,
    prepareExcelFile,
} = require("./questionImportHelperService");
const bulkUploadQuestions = require("../../models/questionBankModel/BulkUploadQuestionsModel");

const question = {
    addQuestion: async (questionData) => {
        try {
            if (questionData.type_of_question == "General") {
                // Validate input parameters
                const emptyParams = Utils.checkEmptyParams(
                    { name: "class_id", value: questionData.class_id },
                    { name: "medium", value: questionData.medium },
                    { name: "subject_id", value: questionData.subject_id },
                    { name: "question_type", value: questionData.question_type },
                    { name: "question", value: questionData.question },
                    { name: "solution", value: questionData.solution },
                    { name: "correctOption", value: questionData.correctOption },
                    { name: "optionOne", value: questionData.optionOne },
                    { name: "optionTwo", value: questionData.optionTwo },
                    { name: "optionThree", value: questionData.optionThree },
                    { name: "optionFour", value: questionData.optionFour },
                    { name: "type_of_question", value: questionData.type_of_question }
                );

                if (emptyParams.length > 0) {
                    // Return error response if any required parameter is missing
                    return Utils.errorResponse(
                        `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                    );
                }
            } else {
                // Validate input parameters
                const emptyParams = Utils.checkEmptyParams(
                    { name: "class_id", value: questionData.class_id },
                    { name: "medium", value: questionData.medium },
                    { name: "subject_id", value: questionData.subject_id },
                    { name: "question_type", value: questionData.question_type },
                    { name: "question", value: questionData.question },
                    { name: "type_of_question", value: questionData.type_of_question }
                );

                if (emptyParams.length > 0) {
                    // Return error response if any required parameter is missing
                    return Utils.errorResponse(
                        `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                    );
                }
            }
            const {
                class_id,
                medium,
                subject_id,
                question,
                solution,
                correctOption,
                optionOne,
                optionTwo,
                optionThree,
                optionFour,
                module_id,
                topic_id,
                question_id,
                question_type,
                type_of_question,
            } = questionData;

            // Prepare match conditions for querying existing question
            const matchConditions = {
                class_id,
                subject_id,
                medium,
                question: question.trim(),
                is_deleted: false,
            };

            // Include module_id in match conditions if it's provided and valid
            if (module_id && mongoose.isValidObjectId(module_id)) {
                matchConditions.module_id = module_id;
            }

            // Include topic_id in match conditions if it's provided and valid
            if (topic_id && mongoose.isValidObjectId(topic_id)) {
                matchConditions.topic_id = topic_id;
            }

            // Exclude current question_id (if provided) from the query
            if (question_id && mongoose.isValidObjectId(question_id)) {
                matchConditions._id = { $ne: question_id };
            }

            // Check if any existing question matches the conditions
            const existingQuestion = await QuestionModel.findOne(matchConditions);

            if (existingQuestion) {
                return Utils.errorResponse(MessageConstants.QUESTION_ALREADY_EXISTS);
            }

            if (questionData.type_of_question == "General") {
                // Prepare question data to save or update
                var questionToSave = {
                    class_id: class_id,
                    medium: medium,
                    subject_id: subject_id,
                    question: question,
                    solution: solution,
                    correctOption: Number.parseInt(correctOption),
                    optionOne: optionOne,
                    optionTwo: optionTwo,
                    optionThree: optionThree,
                    optionFour: optionFour,
                    question_type: question_type,
                    type_of_question: type_of_question,
                };
            } else {
                // Prepare question data to save or update
                var questionToSave = {
                    class_id: class_id,
                    medium: medium,
                    subject_id: subject_id,
                    question: question,
                    question_type: question_type,
                    type_of_question: type_of_question,
                };
            }

            // Include module_id in question data if it's provided and valid
            if (module_id && mongoose.isValidObjectId(module_id)) {
                questionToSave.module_id = module_id;
            } else {
                questionToSave.module_id = null;
            }

            // Include topic_id in question data if it's provided and valid
            if (topic_id && mongoose.isValidObjectId(topic_id)) {
                questionToSave.topic_id = topic_id;
            } else {
                questionToSave.topic_id = null;
            }

            if (question_id && mongoose.isValidObjectId(question_id)) {
                // Update existing question if question_id is provided
                const updatedQuestion = await QuestionModel.findByIdAndUpdate(
                    question_id,
                    questionToSave,
                    { new: true }
                );
                return { message: MessageConstants.UPDATE, question: updatedQuestion };
            } else {
                // Create new question if no question_id is provided
                const newQuestion = await QuestionModel.create(questionToSave);
                return { message: MessageConstants.SUCCESS, question: newQuestion };
            }
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    getBulkUploadHistory: async function (limitValue, offsetValue, searchTerm) {
        try {
            // Define the base query to filter non-deleted classes
            const baseQuery = {};

            // Modify the base query to include the search term if provided
            if (searchTerm) {
                // Use a regex pattern to perform case-insensitive search on class_name field
                baseQuery.file_name = { $regex: searchTerm, $options: "i" };
            }

            // Fetch total count of classes based on the filtered query
            const totalCount = await bulkUploadQuestions.countDocuments(baseQuery);

            // Fetch classes from the database with pagination and filtered by search criteria
            const data = await bulkUploadQuestions
                .find(baseQuery)
                .skip(offsetValue * limitValue)
                .limit(limitValue);

            return { availableDataCount: totalCount, data: data };
        } catch (error) {
            console.error("Error fetching classes:", error);
            // Return error response
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    bulkUploadQuestions: async (req, res) => {
        try {
            if (req.file) {
                var fileName = req.file.originalname;
                importQuestionsFromFile(req.file.path, (data) => {
                    fs.unlink(req.file.path, (err) => {
                        if (err) console.error(err);
                    });
                    var uploadPath =
                        "uploads/questions/importLogs/" + Date.now().toString() + ".xlsx";
                    prepareExcelFile(data, uploadPath, async (status) => {
                        var bulkUploadData = {
                            file_name: fileName,
                            successCount: data.filter((e) => e.isSuccessfullyInserted).length,
                            failedCount: data.filter((e) => !e.isSuccessfullyInserted).length,
                            totalCount: data.length,
                            logFile: status ? uploadPath : "",
                        };
                        await bulkUploadQuestions.create(bulkUploadData);
                        Utils.sendResponse({ message: MessageConstants.SUCCESS }, req, res);
                    });
                });
            } else {
                return Utils.errorResponse(MessageConstants.MISSING_PARAMETERS);
            }
        } catch (error) {
            console.error(error);
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Service function to retrieve all study materials with specified fields.
     * @returns {Promise<Object>} A promise resolving to an object containing a message indicating the success or failure of the operation, along with the list of study materials containing only the specified fields.
     */
    allQuestionList: async function (limitValue, offsetValue, searchQuery) {
        try {
            // Define base match conditions for active and non-deleted classes and subjects
            const matchConditions = {
                "class.is_deleted": false,
                "class.is_active": true,
                "subject.is_deleted": false,
                "subject.is_active": true,
                is_deleted: false,
            };

            // Add search term condition if provided
            if (searchQuery) {
                // Case-insensitive regex pattern for subject_name field
                matchConditions.$or = [
                    { "subject.subject_name": { $regex: searchQuery, $options: "i" } }, // Search by subject_name
                    { medium: { $regex: searchQuery, $options: "i" } }, // Search by medium
                    { question: { $regex: searchQuery, $options: "i" } }, // Search by question
                    { "class.class_name": { $regex: searchQuery, $options: "i" } }, // Search by class_name
                    {
                        "studyMaterialModule.module_name": {
                            $regex: searchQuery,
                            $options: "i",
                        },
                    }, // Search by
                    { "topic.topic_name": { $regex: searchQuery, $options: "i" } }, // Search by topic_name
                ];
            }

            // Aggregate pipeline to count total matching subjects
            const totalCountAggregate = await QuestionModel.aggregate([
                {
                    $lookup: {
                        from: "Classes",
                        localField: "class_id",
                        foreignField: "_id",
                        as: "class",
                    },
                },
                {
                    $lookup: {
                        from: "Subjects",
                        localField: "subject_id",
                        foreignField: "_id",
                        as: "subject",
                    },
                },
                {
                    $lookup: {
                        from: "StudyMaterialModules",
                        localField: "module_id",
                        foreignField: "_id",
                        as: "studyMaterialModule",
                    },
                },
                {
                    $lookup: {
                        from: "Topics",
                        localField: "topic_id",
                        foreignField: "_id",
                        as: "topic",
                    },
                },
                { $match: matchConditions },
                { $count: "totalCount" },
            ]).exec();

            const totalCount =
                totalCountAggregate.length > 0 ? totalCountAggregate[0].totalCount : 0;

            // Aggregate pipeline to fetch subjects with pagination and search conditions
            const questionAggregate = await QuestionModel.aggregate([
                {
                    $lookup: {
                        from: "Classes",
                        localField: "class_id",
                        foreignField: "_id",
                        as: "class",
                    },
                },
                {
                    $lookup: {
                        from: "Subjects",
                        localField: "subject_id",
                        foreignField: "_id",
                        as: "subject",
                    },
                },
                {
                    $lookup: {
                        from: "StudyMaterialModules",
                        localField: "module_id",
                        foreignField: "_id",
                        as: "studyMaterialModule",
                    },
                },
                {
                    $lookup: {
                        from: "Topics",
                        localField: "topic_id",
                        foreignField: "_id",
                        as: "topic",
                    },
                },
                { $match: matchConditions },
                { $skip: offsetValue * limitValue },
                { $limit: limitValue },
            ]).exec();

            // Format the question list according to the required fields
            const formattedQuestionData = questionAggregate.map((questionData) => {
                const topic = questionData.topic[0]; // Get the first topic (if exists) associated with the question
                const module = questionData.studyMaterialModule[0]; // Get the first module (if exists) associated with the question

                // Check if topic_id is null or topic meets the specified conditions
                const isValidTopic =
                    !topic || (topic.is_deleted === false && topic.is_active === true);

                // Check if module_id is null or module meets the specified conditions
                const isValidModule =
                    !module || (module.is_deleted === false && module.is_active === true);

                // Return formatted question data only if both topic and module criteria are met
                if (isValidTopic && isValidModule) {
                    return {
                        id: questionData._id,
                        subject_name: questionData.subject[0].subject_name,
                        subject_id: questionData.subject[0]._id,
                        class_id: questionData.class[0]._id,
                        class_name: questionData.class[0].class_name,
                        module_id: module ? module._id : null,
                        module_name: module ? module.module_name : null,
                        topic_id: topic ? topic._id : null,
                        topic_name: topic ? topic.topic_name : null,
                        question_type: questionData.question_type,
                        type_of_question: questionData.type_of_question,
                        medium: questionData.medium,
                        question: questionData.question,
                        solution: questionData.solution,
                        correctOption: questionData.correctOption,
                        optionOne: questionData.optionOne,
                        optionTwo: questionData.optionTwo,
                        optionThree: questionData.optionThree,
                        optionFour: questionData.optionFour,
                        is_deleted: questionData.is_deleted,
                        is_active: questionData.is_active,
                    };
                }
            });

            // Filter out null or invalid topic/module questions and return the formatted data
            const filteredQuestionData = formattedQuestionData.filter(
                (question) => question !== null
            );

            // // Format the study material list according to the required fields
            // const formattedQuestionData = questionAggregate.map((questionData) => ({
            //     id: questionData._id, // Assigning _id to study_material_id in the response
            //     subject_name: questionData.subject[0].subject_name,
            //     subject_id: questionData.subject[0]._id,
            //     class_id: questionData.class[0]._id,
            //     class_name: questionData.class[0].class_name,
            //     module_id: questionData.studyMaterialModule[0]._id,
            //     module_name: questionData.studyMaterialModule[0].module_name,
            //     topic_id: questionData.topic[0]._id,
            //     topic_name: questionData.topic[0].topic_name,
            //     question_type: questionData.question_type,
            //     medium: questionData.medium,
            //     question: questionData.question,
            //     solution: questionData.solution,
            //     correctOption: questionData.correctOption,
            //     optionOne: questionData.optionOne,
            //     optionTwo: questionData.optionTwo,
            //     optionThree: questionData.optionThree,
            //     optionFour: questionData.optionFour,
            //     is_deleted: questionData.is_deleted,
            //     is_active: questionData.is_active
            // }));

            // Return success message along with the list of study materials
            return {
                message: MessageConstants.SUCCESS,
                data: filteredQuestionData,
                availableDataCount: totalCount,
            };
        } catch (error) {
            // Return error response in case of any unexpected error
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Delete a subject from the database.
     * @param {string} subjectId - The ID of the subject to be deleted.
     * @returns {Object} An object containing a success message and the deleted subject.
     * @throws {Error} If the subject is not found or if there's an error deleting the subject.
     */
    deleteQuestion: async function (ids) {
        try {
            // Check if IDs array is provided and not empty
            if (!Array.isArray(ids) || ids.length === 0) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            const invalidIds = [];

            // Validate and mark classes as deleted using Promise.all
            await Promise.all(
                ids.map(async (id) => {
                    const existingData = await QuestionModel.findById(id);
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
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Update the status (is_active) of a subject in the database.
     * @param {string} id - The ID of the subject to be updated.
     * @param {boolean} is_active - The new status value for the subject (true/false).
     * @returns {Object} An object containing a success message and the updated subject.
     * @throws {Error} If the subject is not found or if there's an error updating the status.
     */
    updateQuestionStatus: async function (id, is_active) {
        try {
            // Check if the subject exists
            const existingData = await QuestionModel.findById(id);

            if (!existingData) {
                return Utils.errorResponse(MessageConstants.QUESTION_NOT_FOUND);
            }

            // Update the is_active field
            existingData.is_active = is_active;

            // Save the updated subject to the database
            await existingData.save();

            return {
                message: `Question ${is_active ? "activated" : "deactivated"
                    } successfully`,
                subject: existingData,
            };
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    //   ADD SUB QUESTION METHOD

    addSubQuestion: async (questionData) => {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "question_id", value: questionData.question_id },
                { name: "question", value: questionData.question },
                { name: "correctOption", value: questionData.correctOption },
                { name: "optionOne", value: questionData.optionOne },
                { name: "optionTwo", value: questionData.optionTwo },
                { name: "optionThree", value: questionData.optionThree },
                { name: "optionFour", value: questionData.optionFour }
            );

            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            const {
                question_id,
                sub_question_id,
                question,
                solution,
                correctOption,
                optionOne,
                optionTwo,
                optionThree,
                optionFour,
            } = questionData;

            // Prepare match conditions for querying existing question
            const matchConditions = {
                question: question.trim(),
                is_deleted: false,
            };

            // Exclude current question_id (if provided) from the query
            if (sub_question_id && mongoose.isValidObjectId(sub_question_id)) {
                matchConditions._id = { $ne: sub_question_id };
            }

            // Check if any existing question matches the conditions
            const existingQuestion = await SubQuestionModel.findOne(matchConditions);

            if (existingQuestion) {
                return Utils.errorResponse(MessageConstants.QUESTION_ALREADY_EXISTS);
            }

            // Prepare question data to save or update
            const questionToSave = {
                question_id: question_id,
                question: question,
                solution: solution,
                correctOption: Number.parseInt(correctOption),
                optionOne: optionOne,
                optionTwo: optionTwo,
                optionThree: optionThree,
                optionFour: optionFour,
            };

            if (sub_question_id && mongoose.isValidObjectId(sub_question_id)) {
                // Update existing question if question_id is provided
                const updatedQuestion = await SubQuestionModel.findByIdAndUpdate(
                    sub_question_id,
                    questionToSave,
                    { new: true }
                );
                const { _id: _id, ...user } = updatedQuestion.toObject();
                return {
                    message: MessageConstants.UPDATE,
                    subQuestion: { sub_question_id, ...user },
                };
            } else {
                // Create new question if no question_id is provided
                const newQuestion = await SubQuestionModel.create(questionToSave);
                const { _id: sub_question_id, ...user } = newQuestion.toObject();
                return {
                    message: MessageConstants.SUCCESS,
                    subQuestion: { sub_question_id, ...user },
                };
            }
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Retrieve all topics associated with a specific study material and module.
     * @param {string} question_id - The ID of the module for which topics are listed.
     * @returns {Object} An object containing a message and the list of topics, or an error response.
    */
    getAllSubQuestion: async function (question_id) {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams({
                name: "question_id",
                value: question_id,
            });
            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            const checkParentQuestion = await QuestionModel.findOne({
                _id: question_id,
                is_deleted: false,
            });

            if (checkParentQuestion) {

                var parentQuestion = checkParentQuestion.question.replace(
                    /<\/?[^>]+(>|$)/g,
                    ""
                );
                // Retrieve all topics associated with the provided study material ID and module ID
                const result = await SubQuestionModel.find({
                    question_id: question_id,
                    is_deleted: false, // Ensure the topic is not marked as deleted
                });

                const formattedSubQuestion = result.map((subQuestion) => ({
                    sub_question_id: subQuestion._id,
                    question: subQuestion.question,
                    solution: subQuestion.solution,
                    correctOption: subQuestion.correctOption,
                    optionOne: subQuestion.optionOne,
                    optionTwo: subQuestion.optionTwo,
                    optionThree: subQuestion.optionThree,
                    optionFour: subQuestion.optionFour,
                }));

                // Return success message along with the list of topics
                return {
                    message: MessageConstants.SUCCESS,
                    parentQuestion: parentQuestion,
                    subQuestionList: formattedSubQuestion,
                };
            } else {
                return Utils.errorResponse(MessageConstants.INVALID_QUESTION_ID);
            }
        } catch (error) {
            // Return error response in case of any unexpected error
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    deleteSubQuestion: async function (ids) {
        try {
            // Check if IDs array is provided and not empty
            if (!Array.isArray(ids) || ids.length === 0) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            const invalidIds = [];

            // Validate and mark classes as deleted using Promise.all
            await Promise.all(
                ids.map(async (id) => {
                    const existingData = await SubQuestionModel.findById(id);
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
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },
};

module.exports = question;
