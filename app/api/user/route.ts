import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const client = new PrismaClient();

// 유저 생성
export const POST = async (request: NextRequest) => {
  try {
    const { account, password } = await request.json();

    if (!account || !password) {
      return NextResponse.json(
        {
          message: "Not exist data.",
        },
        {
          status: 400,
        }
      );
    }

    const existUser = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (existUser) {
      return NextResponse.json(
        {
          message: "Already exist user.",
        },
        {
          status: 400,
        }
      );
    }

    const hasedPassword = bcrypt.hashSync(password, 10);

    const newUser = await client.user.create({
      data: {
        account,
        password: hasedPassword,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        account: true,
      },
    });

    return NextResponse.json(newUser);

    // 패스워드 암호화 (마지막에 구현)
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error.",
      },
      {
        status: 500,
      }
    );
  }
};
