import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});
const notoKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-kr",
});

export const metadata: Metadata = {
  title: "pro's guest-book",
  description: "포트폴리오 방문자가 10초 안에 한마디를 남기는 방명록",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${jakarta.variable} ${notoKR.variable} font-sans bg-[#f9fafb] text-[#111827]`}>
        {children}
      </body>
    </html>
  );
}
