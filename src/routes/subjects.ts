import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";
import { db } from "../db";
import { departments, subjects } from "../db/schema";

export const subjectsRouter = express.Router();

subjectsRouter.get("/", async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
    const limitPerPage = Math.max(1, parseInt(String(limit), 10) || 10);

    const offset = (currentPage - 1) * limitPerPage;
    const filterConditions = [];
    const escapeLike = (str: string) => str.replace(/[%_]/g, "\\$&");

    if (search) {
      const escapedSearch = escapeLike(String(search));
      filterConditions.push(
        or(
          ilike(subjects.name, `%${escapedSearch}%`),
          ilike(subjects.code, `%${escapedSearch}%`),
        ),
      );
    }

    if (department) {
      const escapedDept = escapeLike(String(department));
      filterConditions.push(ilike(departments.name, `%${escapedDept}%`));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);

    const totalCount = Number(countResult[0]?.count) || 0;

    const subjectsList = await db
      .select({
        ...getTableColumns(subjects),
        department: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: subjectsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (e) {
    console.error(`GET /subjects error: ${e}`);
    res.status(500).json({ error: "Internal server error" });
  }
});
