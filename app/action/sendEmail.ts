"use server";

import transporter from "@/mailer";
import { Employee } from "@prisma/client";
import fs from "fs";
import path from "path";
import puppeteer, { Browser } from "puppeteer";

import { SALARY_CONSTANTS } from "./salaryConstants";
import getEmployeeByEmail from "./getEmployeeByEmail";
import { SALARY_SLIP_DATA_TYPE } from "@/types";

/* ---------------------------------------------------
   MAIN FUNCTION — SAFE, CLEAN, CORRECT
--------------------------------------------------- */
export async function sendSalaryEmail({
  employeeEmails,
  monthAndYear,
  subject,
}: {
  employeeEmails: string[];
  monthAndYear: { month: string; year: string };
  subject: string;
}) {
  // Launch Puppeteer ONCE
  const browser = await puppeteer.launch({
    headless: "shell",
    args: ["--no-sandbox"],
  });

  try {
    for (const email of employeeEmails) {
      const employee = await getEmployeeByEmail(email);
      if (!employee) continue;

      const slipData = getSalarySlipData(employee as Employee, monthAndYear);

      const pdfBuffer = await generateSalarySlipPDF(slipData, browser);

      const info = await sendEmailWithAttachment({
        employee,
        monthAndYear,
        subject,
        pdfBuffer,
      });
      return info;
    }
  } finally {
    await browser.close();
  }
}

/* ---------------------------------------------------
   BUILD SALARY SLIP DATA OBJECT
--------------------------------------------------- */
function getSalarySlipData(
  employee: Employee,
  monthAndYear: { month: string; year: string }
): SALARY_SLIP_DATA_TYPE {
  return {
    employee_name: employee.name,
    employee_id: employee.id,
    designation: employee.designation,

    month: monthAndYear.month,
    year: monthAndYear.year,
    pay_date: new Date().toLocaleString(),

    pan: employee.pan_num,
    bank: employee.bank,
    account_no: employee.bank_acc_num,
    ifsc: employee.bank_ifsc,

    ...SALARY_CONSTANTS,
  };
}

/* ---------------------------------------------------
   GENERATE PDF USING REUSED BROWSER INSTANCE
--------------------------------------------------- */
async function generateSalarySlipPDF(
  data: SALARY_SLIP_DATA_TYPE,
  browser: Browser
): Promise<Buffer> {
  const html = loadHTMLTemplate("salaryslip.html", data);

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });

  await page.close();
  return Buffer.from(pdfBuffer);
}

/* ---------------------------------------------------
   LOAD AND INJECT DATA INTO TEMPLATE
--------------------------------------------------- */
function loadHTMLTemplate(
  templateName: string,
  data: SALARY_SLIP_DATA_TYPE
): string {
  const filePath = path.join(process.cwd(), "template", templateName);
  let html = fs.readFileSync(filePath, "utf8");

  for (const key in data) {
    html = html.replace(
      new RegExp(`{{${key}}}`, "g"),
      String((data as unknown as Record<string, string>)[key])
    );
  }

  return html;
}

/* ---------------------------------------------------
   SEND EMAIL WITH BUFFER ATTACHMENT
--------------------------------------------------- */

async function sendEmailWithAttachment({
  employee,
  monthAndYear,
  subject,
  pdfBuffer,
}: {
  employee: Employee;
  monthAndYear: { month: string; year: string };
  subject: string;
  pdfBuffer: Buffer;
}) {
  const emailText = `
Dear ${employee.name},

Please find attached your salary slip for ${monthAndYear.month} ${monthAndYear.year}. Kindly review the details, and if you notice any discrepancies or have any queries, feel free to reach out to the HR department.

Thank you for your continued contribution to Goa Oceanarium Private Limited.

Warm regards,
<b>HR Department</b>
Goa Oceanarium Private Limited
`;

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: employee.email,
    subject,
    text: emailText,
    html: emailText.replace(/\n/g, "<br>"),
    attachments: [
      {
        filename: `Payslip_${monthAndYear.month}${monthAndYear.year}.pdf`,
        contentType: "application/pdf",
        content: pdfBuffer,
      },
    ],
  });
  console.log(info);
  console.log("Email sent:", info.messageId);
  return info;
}
