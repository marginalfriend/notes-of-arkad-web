// This file is used to seed the database with preview data

import { PrismaClient, RecurringPeriod } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  // Create a new account
  const hashedPassword = await bcrypt.hash("password123", 10);

  const account = await prisma.account.create({
    data: {
      username: "user",
      password: hashedPassword,
    },
  });

  console.log("Account created:", account);

  // Create a profile for the account
  const profile = await prisma.profile.create({
    data: {
      name: "John Doe",
      accountId: account.id,
    },
  });

  console.log("Profile created:", profile);

  // Create a one-time budget
  const oneTimeBudget = await prisma.oneTimeBudget.create({
    data: {
      name: "Vacation Budget",
      profileId: profile.id,
      OneTimeBudgetItem: {
        create: [
          {
            name: "Flights",
            amount: 500,
            OneTimeBudgetExpense: {
              create: {
                name: "Airline Tickets",
                amount: 450,
              },
            },
          },
          {
            name: "Accommodation",
            amount: 1000,
            OneTimeBudgetExpense: {
              create: {
                name: "Hotel Booking",
                amount: 900,
              },
            },
          },
        ],
      },
    },
  });

  console.log("One-time budget created:", oneTimeBudget);

  // Create a recurring budget
  const recurringBudget = await prisma.recurringBudget.create({
    data: {
      name: "Monthly Expenses",
      profileId: profile.id,
      recurringPeriod: RecurringPeriod.MONTHLY,
      recurringAmount: 2000,
      RecurringBudgetExpense: {
        create: [
          {
            name: "Rent",
            amount: 1000,
          },
          {
            name: "Groceries",
            amount: 400,
          },
        ],
      },
    },
  });

  console.log("Recurring budget created:", recurringBudget);

  // Create some general expenses
  const expenses = await prisma.expense.createMany({
    data: [
      {
        name: "Coffee",
        amount: 5,
        profileId: profile.id,
      },
      {
        name: "Movie Tickets",
        amount: 30,
        profileId: profile.id,
      },
    ],
  });

  console.log("Expenses created:", expenses);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
