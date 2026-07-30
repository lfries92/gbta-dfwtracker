export const metadata = {
  title: 'GBTA-DFW Membership Drive Tracker',
  description: 'Track referrals and compete for prizes in the GBTA-DFW membership drive challenge.',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body style={{margin: 0, padding: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}>
        {children}
      </body>
    </html>
  )
}
