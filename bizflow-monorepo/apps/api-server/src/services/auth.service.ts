import bcrypt from "bcrypt";
import { prisma } from "@/config/database";
import { signToken } from "@/utils/jwt";

export const authService = {
  login: async (username: string, password: string) => {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new Error("Invalid credentials");

    const token = signToken({
      id: admin.id,
      username: admin.username,
      role: admin.role,
    });

    return {
      token,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    };
  },

  me: async (id: number) => {
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: { id: true, username: true, name: true, role: true },
    });
    if (!admin) throw new Error("User not found");
    return admin;
  },
};
