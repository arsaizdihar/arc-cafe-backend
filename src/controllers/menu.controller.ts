import { User } from "@prisma/client";
import { RequestHandler } from "express";
import prisma from "../core/prisma";

const getMenus: RequestHandler = async (req, res) => {
  const menus = await prisma.menu.findMany();
  return res.json(menus);
};

const getChartMenus: RequestHandler = async (req, res) => {
  const user = res.locals.user as User;
  const menus = await prisma.menuOrder.findMany({
    where: { customerId: user.id, orderId: null },
    orderBy: { createdAt: "desc" },
    include: { menu: true },
  });

  return res.json(menus);
};

const addToChart: RequestHandler = async (req, res) => {
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

const deleteFromChart: RequestHandler = async (req, res) => {
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
  addToChart,
  deleteFromChart,
  getChartMenus,
};
