import Joi, { ObjectSchema } from 'joi';

const addChatSchema: ObjectSchema = Joi.object().keys({
  conversationId: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Conversation ID must be a string.',
    'string.empty': 'Conversation ID cannot be empty.'
  }),
  receiverId: Joi.string().required().messages({
    'string.base': 'Receiver ID must be a string.',
    'string.empty': 'Receiver ID is required.'
  }),
  receiverUsername: Joi.string().required().messages({
    'string.base': 'Receiver username must be a string.',
    'string.empty': 'Receiver username is required.'
  }),
  receiverAvatarColor: Joi.string().required().messages({
    'string.base': 'Avatar color must be a string.',
    'string.empty': 'Avatar color is required.'
  }),
  receiverProfilePicture: Joi.string().required().messages({
    'string.base': 'Profile picture URL must be a string.',
    'string.empty': 'Profile picture URL is required.'
  }),
  body: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Body must be a string.',
    'string.empty': 'Body can be empty or null.'
  }),
  gifUrl: Joi.string().optional().allow(null, '').messages({
    'string.base': 'GIF URL must be a string.',
    'string.empty': 'GIF URL can be empty or null.'
  }),
  selectedImage: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Selected image URL must be a string.',
    'string.empty': 'Selected image URL can be empty or null.'
  }),
  isRead: Joi.boolean().optional().messages({
    'boolean.base': 'isRead must be a boolean value.'
  })
});

const markChatSchema: ObjectSchema = Joi.object().keys({
  senderId: Joi.string().required().messages({
    'string.base': 'Sender ID must be a string.',
    'string.empty': 'Sender ID is required.'
  }),
  receiverId: Joi.string().required().messages({
    'string.base': 'Receiver ID must be a string.',
    'string.empty': 'Receiver ID is required.'
  })
});

export { addChatSchema, markChatSchema };
