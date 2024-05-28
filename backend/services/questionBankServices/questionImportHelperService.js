// Import necessary modules
const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csv-parse');
const Class = require("../../models/class/Class.model")
const Topic = require("../../models/studyMaterialModel/Topic.model")
const StudyMaterialModule = require("../../models/studyMaterialModel/StudyMaterialModule.model");
const Subject = require('../../models/subject/Subject.model');
const { DataProvider } = require('../../utility/DataProvider');
const Utils = require('../../utility/utils');
const { default: mongoose } = require('mongoose');
const QuestionModel = require('../../models/questionBankModel/Question.model');
const MessageConstants = require('../../utility/MessageConstants');

async function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const parsedData = [];
        var index = 0;
        var keys = [];
        fs.createReadStream(filePath)
            .pipe(csv.parse({ delimiter: ',' }))
            .on('data', (row) => {
                if (index === 0) {
                    keys = row;
                } else {
                    var data = {};
                    keys.forEach((dataKey, i) => {
                        data[dataKey] = row[i]?.trim();
                    })
                    parsedData.push(data);
                }

                index++;
            })
            .on('end', () => {
                resolve(parsedData);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Function to prepare and save the Excel file
const prepareExcelFile = (data, outputPath, onUpdate) => {
    try {
        // Create a new workbook
        const workbook = xlsx.utils.book_new();

        // Create a worksheet with headers
        const worksheet = xlsx.utils.json_to_sheet(data.map(item => {
            return {
                ...item.question,
                isSuccessfullyInserted: item.isSuccessfullyInserted ? 'Success' : 'Failed',
                Errors: item.errors.join('; \n')
            };
        }));

        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Imported Data');

        // Write the workbook to a file
        xlsx.writeFile(workbook, outputPath);

        onUpdate(true, null)
    } catch (error) {
        onUpdate(false, error)
    }
};

async function formatQuestionData(data) {
    var responseDataArray = [];
    await Promise.all(
        data.map(async (e) => {
            var errors = [];
            var correctOption;
            switch (e['Correct Option']) {
                case 'A':
                    correctOption = 1;
                    break;
                case 'B':
                    correctOption = 2;
                    break;
                case 'C':
                    correctOption = 3;
                    break;
                case 'D':
                    correctOption = 4;
                    break;
                default:
                    errors.push("Invalid Correct Option Given!");
                    break;
            }

            var question = {
                correctOption: correctOption,
                module_id: "",
                topic_id: ""
            };


            if (e.Medium && e.Medium !== "") {
                if (DataProvider.mediumList.findIndex((dataValue) => dataValue.value === e.Medium) !== -1) {
                    question.medium = e.Medium
                } else {
                    errors.push("Medium is Invalid and can only be one from " + DataProvider.mediumList.map((e) => e.value).join(" :: "));
                }
            } else {
                errors.push("Medium is Required!");
            }

            if (e.Solution && e.Solution !== "") {
                question.solution = e.Solution
            } else {
                errors.push("Solution is Required!");
            }

            if (e.Question && e.Question !== "") {
                question.question = e.Question
            } else {
                errors.push("Question is Required!");
            }

            if (e['Question Type'] && e['Question Type'] !== "") {
                question.question_type = e['Question Type']
            } else {
                errors.push("Question Type is Required!");
            }

            if (e['Type Of Question'] && e['Type Of Question'] !== "") {
                question.type_of_question = e['Type Of Question']
            } else {
                errors.push("Type Of Question is Required!");
            }

            if (e["Option A"] && e["Option A"] !== "") {
                question.optionOne = e["Option A"]
            } else {
                errors.push("Option A is Required!");
            }

            if (e["Option B"] && e["Option B"] !== "") {
                question.optionTwo = e["Option B"]
            } else {
                errors.push("Option B is Required!");
            }

            if (e["Option C"] && e["Option C"] !== "") {
                question.optionThree = e["Option C"]
            } else {
                errors.push("Option C is Required!");
            }

            if (e["Option D"] && e["Option D"] !== "") {
                question.optionFour = e["Option D"]
            } else {
                errors.push("Option D is Required!");
            }

            if (e.Class && e.Class !== "") {
                const classData = await Class.findOne({
                    class_name: e.Class,
                    is_active: true,
                    is_deleted: false
                });

                if (!classData) {
                    errors.push("Class Name is Invalid!");
                } else {
                    question.class_id = classData._id;
                }
            } else {
                errors.push("Class Name is required!");
            }

            if (e.Subject && e.Subject !== "") {
                const subjectData = await Subject.findOne({
                    subject_name: e.Subject,
                    class_id: question.class_id,
                    is_active: true,
                    is_deleted: false
                });

                if (!subjectData) {
                    errors.push("Subject Name is Invalid!");
                } else {
                    question.subject_id = subjectData._id;
                }
            } else {
                errors.push("Subject Name is required!");
            }

            if (e.Module && e.Module !== "") {
                const moduleData = await StudyMaterialModule.findOne({
                    module_name: e.Module,
                    is_active: true,
                    is_deleted: false
                });

                if (!moduleData) {
                    errors.push("Module Name is Invalid!");
                } else {
                    question.module_id = moduleData._id;
                }
            }

            if (e.Topic && e.Topic !== "") {
                const topicData = await Topic.findOne({
                    topic_name: e.Topic,
                    is_active: true,
                    is_deleted: false
                });

                if (!topicData) {
                    errors.push("Topic Name is Invalid!");
                } else {
                    question.topic_id = topicData._id;
                }
            }

            var isSuccessfullyInserted = false;
            if (errors.length === 0) {
                const result = await insertQuestionToDatabase(question);
                const { status, ...response } = result;
                if (response?.error !== undefined && response.error !== null && response.error.length > 0) {
                    errors.push(response?.error);
                } else {
                    isSuccessfullyInserted = true;
                }
            }

            var responseData = {
                question: e,
                errors: errors,
                isSuccessfullyInserted: isSuccessfullyInserted
            }

            responseDataArray.push(responseData);
        })
    );

    return responseDataArray;
}

// Function to import questions from Excel or CSV
async function importQuestionsFromFile(filePath, onSuccess) {
    try {
        const fileExtension = filePath.split('.').pop().toLowerCase();

        if (fileExtension === 'xlsx') {
            // Read an Excel file
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet);
            onSuccess(await formatQuestionData(data));
        } else if (fileExtension === 'csv') {
            parseCSV(filePath).then(async (data, error) => {
                if (error) {
                    throw new Error(error);
                } else {
                    onSuccess(await formatQuestionData(data));
                }
            })
        } else {
            throw new Error('Unsupported file format. Please provide an Excel (xlsx) or CSV file.');
        }
    } catch (error) {
        throw new Error(`Error importing questions: ${error.message}`);
    }
}

async function insertQuestionToDatabase(questionData) {
    try {
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

        const { class_id, medium, subject_id, question, solution, correctOption, optionOne, optionTwo, optionThree, optionFour, module_id, topic_id, question_type, type_of_question } = questionData;

        // Prepare match conditions for querying existing question
        const matchConditions = {
            class_id,
            subject_id,
            medium,
            question: question.trim(),
            is_deleted: false
        };

        // Include module_id in match conditions if it's provided and valid
        if (module_id && mongoose.isValidObjectId(module_id)) {
            matchConditions.module_id = module_id;
        }

        // Include topic_id in match conditions if it's provided and valid
        if (topic_id && mongoose.isValidObjectId(topic_id)) {
            matchConditions.topic_id = topic_id;
        }

        // Check if any existing question matches the conditions
        const existingQuestion = await QuestionModel.findOne(matchConditions);

        if (existingQuestion) {
            return Utils.errorResponse(MessageConstants.QUESTION_ALREADY_EXISTS);
        }

        // Prepare question data to save or update
        const questionToSave = {
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

        // Create new question if no question_id is provided
        const newQuestion = await QuestionModel.create(questionToSave);
        return { message: MessageConstants.SUCCESS, question: newQuestion };
    } catch (error) {
        return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HTTPStatus.INTERNAL_SERVER_ERROR);
    }
}

// Export the functions
module.exports = {
    importQuestionsFromFile, parseCSV, prepareExcelFile
};
