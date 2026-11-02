import './globals.css';

export const metadata = {
  title: 'Lazza Ice Cream Distributor - Stock Management & Mini CRM',
  description: 'Stock management, shop ledger, credit tracking, sales distribution, and payment collection system for Lazza Ice Cream distributors.',
  icons: {
    icon: '/lazza-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#fbfafd] text-slate-800 antialiased font-montserrat font-light selection:bg-yellow-200 selection:text-violet-950">
        {children}
      </body>
    </html>
  );
}
