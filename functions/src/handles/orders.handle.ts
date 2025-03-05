import { Request, Response } from "express";
import { prisma } from "../../prisma/prismaClient.js";
import { Order } from "../entities/orders.js";

export const createOrderHandle = async (req: Request, res: Response) => {
  const order: Order = req.body;

  const createdheaderForm = await prisma.headerForm.create({
    data: {
      numerocliente: order.headerForm.numerocliente,
      cliente: order.headerForm.cliente,
      condicion: order.headerForm.condicion,
      obs: order.headerForm.obs,
    },
  });

  const createdOrder = await prisma.order.create({
    data: {
      userId: order.userId,
      iat: Date.now(),
      headerFormId: createdheaderForm.id,
      subtotal: order.subtotal,
    },
    include: {
      HeaderForm: true,
    },
  });

  const createdCarrito = await prisma.carrito.createManyAndReturn({
    data: order.carrito.map(item => ({
      cantidad: item.cant,
      productoId: item.id,
      orderId: createdOrder.id,
    })),
    include: {
      Producto: true,
    },
  });

  // https://stackoverflow.com/questions/75947475/prisma-typeerror-do-not-know-how-to-serialize-a-bigint
  //@ts-ignore
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  res.status(200).json({
    msg: "success",
    data: {
      order: createdOrder,
      carrito: createdCarrito,
    },
  });
};
