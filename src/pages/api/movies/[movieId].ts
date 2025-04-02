import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import serverAuth from "@/lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await serverAuth(req);

    if (req.method !== "GET") {
      return res.status(405).end();
    }

    const { movieId } = req.query;

    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId as string,
      },
    });

    return res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    return res.status(400).end();
  }
}
