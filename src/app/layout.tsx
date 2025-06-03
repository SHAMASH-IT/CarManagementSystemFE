// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import ProtectRoute from '@/protectRoute/protect'
// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'


export const metadata = {
  title: 'AutoService Pro',
  description: 'Système de gestion de voitures et de pièces détachées'
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' dir={direction} lang="fr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
       
         
          <ProtectRoute>
            {children}
          </ProtectRoute>
      
      </body>
    </html>
  )
}

export default RootLayout
