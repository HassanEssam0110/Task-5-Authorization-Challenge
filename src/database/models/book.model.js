import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      minLength: 3,
      maxLength: 150,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      minLength: 3,
      maxLength: 150,
      required: true,
      trim: true,
    },
    publishedDate: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Book = models.Book || model("Book", bookSchema);
