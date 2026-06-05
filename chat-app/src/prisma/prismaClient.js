import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const adapter = new PrismaPg(
    new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        max: 5,
        idleTimeoutMillis: 3000,
        connectionTimeoutMillis: 5000,
    }),
);

const prisma = new PrismaClient({ adapter });
export default prisma;ы