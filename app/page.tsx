import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Form Portal</h1>
          <p className="text-gray-600 mb-8">Welcome to the dynamic form builder application</p>

          <div className="flex flex-col space-y-4">
            <Link href="/register" className="w-full">
              <Button className="w-full bg-gray-800 hover:bg-gray-700">Register</Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
