import { User } from "@prisma/client";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import prisma from "../core/prisma";
import fieldErrors from "../utils/fieldErrors";

const getMenus: RequestHandler = async (req, res) => {
  const menus = await prisma.menu.findMany();
  return res.json(menus);
};

const addMenu: RequestHandler = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return fieldErrors(errors, res);

  const { name, photoUrl, type, price, composition } = req.body;

  const menu = await prisma.menu.create({
    data: { name, photoUrl, type, price, composition },
  });

  return res.status(201).json(menu);
};

const deleteMenu: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const menu = await prisma.menu.delete({ where: { id } });
    return res.json({ message: `menu ${menu.name} successfully deleted.` });
  } catch (error) {
    return res.status(404).json({ message: "menu not found." });
  }
};

const updateMenu: RequestHandler = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return fieldErrors(errors, res);
  const { id } = req.params;
  const { name, photoUrl, type, price, composition } = req.body;
  try {
    const menu = await prisma.menu.update({
      where: { id },
      data: { name, photoUrl, type, price, composition },
    });
    return res.json(menu);
  } catch (error) {
    return res.status(404).json({ message: "menu not found." });
  }
};

const getCartMenus: RequestHandler = async (req, res) => {
  const user = res.locals.user as User;
  const menus = await prisma.menuOrder.findMany({
    where: { customerId: user.id, orderId: null },
    orderBy: { createdAt: "desc" },
    include: { menu: true },
  });

  return res.json(menus);
};

const addToCart: RequestHandler = async (req, res) => {
  const { menuId } = req.body;

  if (typeof menuId !== "string") {
    return res.status(400).json({ message: "menuId is required." });
  }
  const user = res.locals.user as User;
  try {
    const menuOrder = await prisma.menuOrder.create({
      data: { menuId, customerId: user.id },
    });
    return res.status(201).json(menuOrder);
  } catch (error) {
    return res.status(404).json({ message: "Menu Not Found", error });
  }
};

const deleteFromCart: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string")
    return res.status(400).json({ message: "id is required." });

  const user = res.locals.user as User;

  if (
    (await prisma.menuOrder.count({ where: { customerId: user.id, id } })) === 0
  ) {
    return res.status(404).json({ message: "MenuOrder not found." });
  }

  await prisma.menuOrder.delete({ where: { id } });
  return res.json({ message: "Successfully deleted." });
};

export default {
  getMenus,
  addToCart,
  deleteFromCart,
  getCartMenus,
  addMenu,
  deleteMenu,
  updateMenu,
};
