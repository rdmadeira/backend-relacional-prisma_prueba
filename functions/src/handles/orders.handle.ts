import { Request, Response } from "express";
import { prisma } from "../../prisma/prismaClient.js";
import { Order } from "../entities/orders.js";

export const createOrderHandle = async (req: Request, res: Response) => {
  const order: Order = req.body;
  console.log("order", order);

  const createdheaderForm = await prisma.headerForm.create({
    data: {
      numerocliente: order.headerForm.numerocliente,
      cliente: order.headerForm.cliente,
      condicion: order.headerForm.condicion,
      obs: order.headerForm.obs,
    },
  });
  console.log("headerForm", createdheaderForm);

  const createdCarrito = await prisma.carrito.createManyAndReturn({
    data: order.carrito.map(item => ({
      headerFormId: createdheaderForm.id,
      cantidad: item.cantidad,
      productoId: item.productoId,
    })),
  });
  const createdOrder = await prisma.order.create({
    data: {
      userId: order.userId,
      iat: Date.now() / 1000,
      headerFormId: createdheaderForm.id,
    },
    include: {
      HeaderForm: true,
    },
  });

  console.log("createdCarrito", createdCarrito);

  console.log("createdOrder", createdOrder);

  res.status(200).json({
    msg: "success",
    data: {
      createdOrder: createdOrder,
      carrito: createdCarrito,
    },
  });
};
