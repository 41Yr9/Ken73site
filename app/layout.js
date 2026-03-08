import { M_PLUS_1p } from "next/font/google";
import "./globals.css";

const mplus = M_PLUS_1p({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Ken73 | Portfolio",
  description: "Ken73 (Kenjiro Kawai) - Student Engineer / App Developer. モバイルアプリ開発を軸に、企画から収益化までを一貫して行う学生エンジニア。",
  openGraph: {
    title: "Ken73 | Portfolio",
    description: "Student Engineer / App Developer",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={mplus.className}>
        {children}
      </body>
    </html>
  );
}
