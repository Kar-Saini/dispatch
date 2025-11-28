"use server";
import transporter from "@/mailer";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

export async function testMailer() {
  const pdfBuffer = await generateSalarySlipPDF({
    employee_name: "Amin Adam Mamangcao",
    employee_id: "GOA/2025/PER/001",
    designation: "Mermaid Performer",
    month: "October",
    year: "2025",
    pay_date: "01 Nov 2025",
    pan: "...",
    bank: "...",
    account_no: "...",
    ifsc: "...",
    basic: "29,782.00",
    hra: "14,899.00",
    special_allowance: "29,797.00",
    gross_earnings: "74,478.00",
    income_tax: "5,758",
    pf: "0.00",
    cess: "230.00",
    total_deductions: "5,988.00",
    net_pay: "68,489.00",
    net_pay_words: "Rupees Sixty-Eight Thousand Four Hundred Eighty-Nine Only",
    paid_days: 17,
    lop_days: 14,
  });
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: "utkarsh181299@gmail.com",
    subject: "SMTP Test",
    text: "SMTP works!",
    html: `<p>Hi Kartik ,<br>Your salary slip is attached.</p>`,
    attachments: [
      {
        filename: "salary-slip.pdf",
        contentType: "application/pdf",
        content: Buffer.from(pdfBuffer),
      },
    ],
  });

  console.log("Sent:", info);
  return info;
}

export async function generateSalarySlipPDF(data: any) {
  const filePath = path.join(process.cwd(), "template", "salaryslip.html");
  console.log(filePath);
  let html = fs.readFileSync(filePath, "utf8");

  // Replace {{placeholders}}
  Object.keys(data).forEach((key) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  });

  const browser = await puppeteer.launch({
    headless: "shell",
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  return pdfBuffer;
}
