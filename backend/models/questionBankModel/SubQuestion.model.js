const mongoose = require('mongoose');

const subQuestionSchema = new mongoose.Schema(
    {
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Questions',
            required: false // Make question_id optional
        },
        question: {
            type: String,
        },
        optionOne: {
            type: String,
        },
        optionTwo: {
            type: String,
        },
        optionThree: {
            type: String,
        },
        optionFour: {
            type: String,
        },
        solution: {
            type: String,
        },
        correctOption: {
            type: Number,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
         // Date when the topic was created
        created_date: {
            type: Date,
            default: Date.now,
        },
        // Date when the topic was last updated
        updated_date: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "SubQuestions" } // Optional: specify the collection name
);

const SubQuestion = mongoose.model('SubQuestion', subQuestionSchema);
module.exports = SubQuestion;
