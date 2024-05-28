const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        class_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        },
        medium: {
            type: String
        },
        subject_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        },
        module_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudyMaterialModule',
            required: false // Make module_id optional
        },
        topic_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic',
            required: false // Make topic_id optional
        },
        question_type: {
            type: String,
            enum: ['Question Bank', 'SAT Exam']
        },
        type_of_question: {
            type: String,
            enum: ['General', 'Comprehensive']
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
        is_active: {
            type: Boolean,
            default: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "Questions" } // Optional: specify the collection name
);

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
