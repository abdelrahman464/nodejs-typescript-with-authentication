import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const IsOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    if (!currentUserId) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    if (currentUserId.toString() !== id) {
      return res.status(403).send({ error: "Forbidden" });
    }
    next();
  } catch (error) {
    console.error("Error in IsOwner middleware", error);
    res.status(401).send({ error: "Unauthorized" });
  }
};
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["ABDO-COOKIE"];
    if (!sessionToken) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403).send({ error: "Unauthorized" });
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.error("Error in isAuthenticated middleware", error);
    res.status(401).send({ error: "Unauthorized" });
  }
};
