import express from "express";
import {
  getUsers,
  deleteUserById,
  updateUserById,
  getUserById,
} from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    return res.json(deletedUser);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    if (!username || !email) {
      return res.sendStatus(400);
    }
    const user = await getUserById(id);
    if (!user) {
      return res.sendStatus(404);
    }
    user.username = username;
    user.email = email;
    await user.save();

    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
