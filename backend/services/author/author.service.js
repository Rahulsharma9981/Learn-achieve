const AuthorModel = require("../../models/author/Author.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported

const authorService = {
  /**
   * Create a new author or update an existing one.
   * @param {Object} authorData - The data of the author to be created or updated.
   * @param {Object} req - The Express request object.
   * @returns {Object} An object containing a success message and the created/updated author data, or an error response.
   */
  addAuthor: async (authorData, req) => {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams(
        { name: "name", value: authorData.name },
        { name: "briefIntro", value: authorData.briefIntro }
      );

      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      const author_id = authorData.author_id;

      if (req.file) {
        console.log(req.file)
        authorData.image = {
          name: req.file.originalname,
          size: req.file.size,
          url: req.file.path,
          type: req.file.mimetype,
        };
      } else {
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${"image"}`
        );
      }
      if (author_id) {
        // Check if any existing author matches the conditions
        const existingAuthor = await AuthorModel.findById(author_id);

        if (!existingAuthor) {
          return Utils.errorResponse(MessageConstants.INVALID_ID);
        }
        // Update existing author if author_id is provided
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(
          author_id,
          authorData,
          { new: true }
        );
        const { _id: _id, ...user } = updatedAuthor.toObject();
        return {
          message: MessageConstants.UPDATE,
          authorData: { author_id, ...user },
        };
      } else {
        // Create new author if no author_id is provided
        const newAuthor = await AuthorModel.create(authorData);
        const { _id: author_id, ...user } = newAuthor.toObject();

        return {
          message: MessageConstants.SUCCESS,
          authorData: { author_id, ...user },
        };
      }
    } catch (error) {
        console.log("this is eroror",error)
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Fetches authors from the database with optional pagination and search criteria.
   * @param {number} limitValue - The limit for the number of authors to fetch.
   * @param {number} offsetValue - The number of authors to skip.
   * @param {string} searchTerm - The search term to filter authors by name.
   * @returns {Object} An object containing the fetched authors and the total count, or an error response.
   */
  listAuthors: async function (limitValue, offsetValue, searchTerm) {
    try {
      // Define the base query to filter non-deleted authors
      const baseQuery = { is_deleted: false };

      // Modify the base query to include the search term if provided
      if (searchTerm) {
        // Use a regex pattern to perform case-insensitive search on name field
        baseQuery.name = { $regex: searchTerm, $options: "i" };
      }

      // Fetch total count of authors based on the filtered query
      const totalCount = await AuthorModel.countDocuments(baseQuery);

      // Fetch authors from the database with pagination and filtered by search criteria
      const result = await AuthorModel.find(baseQuery)
        .skip(offsetValue * limitValue)
        .limit(limitValue);

      const formattedAuthor = result.map((author) => ({
        author_id: author._id, // Assigning _id to author_id in the response
        name: author.name,
        briefIntro: author.briefIntro,
        image: author.image,
        instagramLink: author.instagramLink,
        youtubeLink: author.youtubeLink,
        twitterLink: author.twitterLink,
        facebookLink: author.facebookLink,
        linkedInLink: author.linkedInLink,
        is_active: author.is_active,
        is_deleted: author.is_deleted,
      }));
      return { availableDataCount: totalCount, authorData: formattedAuthor };
    } catch (error) {
      // Return error response
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Fetches authors from the database without pagination.
   * @returns {Object} An object containing the fetched authors, or an error response.
   */
  getAllAuthorWithoutPagination: async function () {
    try {
      var condition = { is_deleted: false, is_active: true };
      // Fetch authors from the database with the specified conditions
      const data = await AuthorModel.find(condition);
      return { message: MessageConstants.SUCCESS, data: data };
    } catch (error) {
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Update the status (is_active) of an author in the database.
   * @param {string} id - The ID of the author to be updated.
   * @param {boolean} is_active - The new status value for the author (true/false).
   * @returns {Object} An object containing a success message and the updated author, or an error response.
   */
  changeStatus: async function (id, is_active) {
    try {
      // Check if the author exists
      const existingAuthor = await AuthorModel.findById(id);

      if (!existingAuthor) {
        return Utils.errorResponse(MessageConstants.INVALID_ID);
      }

      // Update the is_active field
      existingAuthor.is_active = is_active;

      // Save the updated author to the database
      await existingAuthor.save();

      return {
        message: `Author ${
          is_active ? "activated" : "deactivated"
        } successfully`,
        author: existingAuthor,
      };
    } catch (error) {
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Deletes authors with the provided IDs by marking them as deleted.
   * @param {Array<string>} ids - The IDs of the authors to be deleted.
   * @returns {Object} An object containing the message and the deleted authors, or an error response.
   */
  deleteAuthor: async function (ids) {
    try {
      // Check if IDs array is provided and not empty
      if (!Array.isArray(ids) || ids.length === 0) {
        return Utils.errorResponse(MessageConstants.INVALID_ID);
      }

      const invalidIds = [];

      // Validate and mark authors as deleted using Promise.all
      await Promise.all(
        ids.map(async (id) => {
          const existingData = await AuthorModel.findById(id);
          if (!existingData) {
            invalidIds.push(id);
          } else {
            existingData.is_deleted = true;
            await existingData.save();
          }
        })
      );

      // Check if any invalid IDs were provided
      if (invalidIds.length > 0) {
        return Utils.errorResponse(
          `${MessageConstants.INVALID_ID}: ${invalidIds.join(", ")}`
        );
      }

      return { message: MessageConstants.DELETE };
    } catch (error) {
      // Return error response
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Retrieve author details by author ID.
   * @param {string} author_id - The ID of the author to retrieve details for.
   * @returns {Object} An object containing a message and the details of the author, or an error response.
   */
  getAuthorDetailById: async function (author_id) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams({
        name: "author_id",
        value: author_id,
      });
      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      // Retrieve author details associated with the provided author ID
      const result = await AuthorModel.findById(author_id);

      if (result) {
        // Return success message along with the author details
        const {
          _id: author_id,
          name,
          briefIntro,
          image,
          instagramLink,
          youtubeLink,
          twitterLink,
          facebookLink,
        } = result.toObject();
        return {
          message: MessageConstants.SUCCESS,
          authorDetails: {
            author_id,
            name,
            briefIntro,
            image,
            instagramLink,
            youtubeLink,
            twitterLink,
            facebookLink,
          },
        };
      } else {
        // Return error response if no author found with the provided ID
        return { message: MessageConstants.INVALID_ID };
      }
    } catch (error) {
      // Return error response in case of any unexpected error
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },
};

module.exports = authorService;
