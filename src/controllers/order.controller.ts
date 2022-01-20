import { User } from "@prisma/client";
import { RequestHandler } from "express";
import prisma from "../core/prisma";

const getOrders: RequestHandler = async (req, res) => {
  const user = res.locals.user as User;
  const orders = await prisma.order.findMany({
    where: { customer: user },
    include: { menuOrders: { select: { menu: { select: { price: true } } } } },
  });
  return res.json(
    orders.map((order) => ({
      ...order,
      menuOrders: undefined,
      price: order.menuOrders.reduce((x, y) => x + y.menu.price, 0),
    }))
  );
};

const getOrder: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = res.locals.user as User;
  const order = await prisma.order.findFirst({
    where: { id, customer: user },
    include: { menuOrders: { select: { menu: { select: { price: true } } } } },
  });
  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  return res.json({
    ...order,
    menuOrders: undefined,
    price: order.menuOrders.reduce((x, y) => x + y.menu.price, 0),
  });
};

const checkoutOrder: RequestHandler = async (req, res) => {
  const user = res.locals.user as User;
  const { ids } = req.body;

  if (!(Array.isArray(ids) && ids.every((id) => typeof id === "string"))) {
    return res
      .status(400)
      .json({ message: "Ids must be an array of string id" });
  }

  const menuOrders = await prisma.menuOrder.findMany({
    where: { id: { in: ids }, orderId: null },
  });

  const order = await prisma.order.create({
    data: {
      customerId: user.id,
      menuOrders: { connect: menuOrders.map((m) => ({ id: m.id })) },
    },
  });

  return res.status(201).json(order);
};

const payOrder: RequestHandler = async (req, res) => {
  const user = res.locals.user as User;
  const { id } = req.body;
  if (typeof id !== "string")
    return res.status(400).json({ message: "id is required." });
  if (
    (await prisma.order.findFirst({ where: { id, customerId: user.id } })) ===
    null
  )
    return res.status(404).json({ message: "Order not found." });
  const order = await prisma.order.update({
    where: { id },
    data: { paid: true, paidAt: new Date() },
  });

  return res.json(order);
};

export default { checkoutOrder, payOrder, getOrders, getOrder };
