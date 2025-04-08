import StockList from "./components/StockList"
import Sidebar from "../common/Sidebar"
import Navbar from "../common/Navbar"

export default function StockPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
         

            {/* Composant principal de liste des stocks */}
            <StockList />
          </div>
        </div>
      </div>
    </div>
  )
}
