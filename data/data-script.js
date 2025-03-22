import mongoose from "mongoose";
import connectDB from "../src/database/db-connect.js";
import { createHash } from "../src/utils/index.utils.js";

import { Role, Book, User } from "../src/database/models/index.models.js";

const roles = [
  { name: "Admin", permissions: ["Read", "Create", "Update", "Delete"] },
  { name: "Editor", permissions: ["Read", "Create", "Update"] },
  { name: "Viewer", permissions: ["Read"] },
];

const users = [
  {
    username: "admin1",
    email: "admin@email.com",
    password: "Asd@@123",
    role: "Admin",
  },
  {
    username: "editor1",
    email: "editor@email.com",
    password: "Asd@@123",
    role: "Editor",
  },
  {
    username: "viewer1",
    email: "viewer@email.com",
    password: "Asd@@123",
    role: "Viewer",
  },
];

const books = [
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    publishedDate: "2019-02-05",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    publishedDate: "2018-10-16",
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    publishedDate: "2020-08-13",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    publishedDate: "1965-08-01",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publishedDate: "1960-07-11",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publishedDate: "1813-01-28",
  },
];

const addData = async (Model, data) => {
  try {
    await Model.insertMany(data);
    console.log(`${Model.modelName} Data successfully inserted!`);
  } catch (err) {
    console.log(`${Model.modelName} - Error loading data: ${err.message}`);
    process.exit(1);
  }
};

const deleteData = async (Model) => {
  try {
    await Model.deleteMany();
    console.log(`${Model.modelName} Data successfully deleted!`);
  } catch (err) {
    console.log(`${Model.modelName} - Error loading data: ${err.message}`);
    process.exit(1);
  }
};

const addUsersToDB = async () => {
  try {
    const roles = await Role.find().select("name _id");
    const usersWithRoles = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await createHash(user.password), // Hash the password
        role: roles.find((role) => role.name === user.role)?._id || null,
      }))
    );

    await addData(User, usersWithRoles);
  } catch (err) {
    console.log(`Error loading data: ${err.message}`);
    process.exit(1);
  }
};

const main = async () => {
  try {
    connectDB(); // connect to the database
    const args = process.argv.slice(2); // get the arguments
    console.log(`${process.argv.slice(2)} Starting...`);
    if (args.includes("--import")) {
      await addData(Role, roles);
      await addData(Book, books);
      await addUsersToDB();
      console.log("Data imported successfully!");
    } else if (args.includes("--delete")) {
      await deleteData(Role);
      await deleteData(Book);
      await deleteData(User);
      console.log("Data deleted successfully!");
    } else {
      console.log("Usage: node data-script.js [--import|--delete]");
    }
  } catch (err) {
    console.error(`Error: ${err.name} | ${err.message}`);
  } finally {
    await mongoose.connection.close(); // colse DB connection
    console.log("Database connection closed.");
    process.exit(0);
  }
};

main();
