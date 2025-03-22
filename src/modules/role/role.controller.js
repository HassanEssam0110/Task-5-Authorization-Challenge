import * as handler from "../api-handler-factory.js";
import { Role } from "../../database/models/index.models.js";

const getAllRoles = handler.getAll(Role);
const getRole = handler.getOne(Role);
const createRole = handler.createOne(Role);
const updateRole = handler.updateOne(Role);
const deleteRole = handler.deleteOne(Role);

export { getAllRoles, getRole, createRole, updateRole, deleteRole };
