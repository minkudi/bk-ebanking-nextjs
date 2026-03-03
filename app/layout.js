import "react-international-phone/style.css";
import "./globals.css";

export const metadata = {
  title: "BK E-Banking",
  description: "Banque en ligne",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
