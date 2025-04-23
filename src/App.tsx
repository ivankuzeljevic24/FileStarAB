import { useState, useEffect } from 'react'
import './App.css'
import { DataTable } from './components/DataTable'
import employeeData from './lib/data.json'
import { generateEmployees } from './lib/data-generator'
import type { Employee } from './types'

function App() {
  const [data, setData] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Start with the initial seed data
    const initialData = employeeData as Employee[]

    // Add some generated data
    const generatedData = generateEmployees(50, initialData.length + 1)

    setData([...initialData, ...generatedData])
    setLoading(false)
  }, [])

  const loadMoreData = () => {
    // Simulate loading delay
    setLoading(true)

    setTimeout(() => {
      const newData = generateEmployees(30, data.length + 1)
      setData(prev => [...prev, ...newData])
      setLoading(false)
    }, 800)
  }

  if (data.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="max-w-[1000px] mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Employee Directory</h1>
      <DataTable data={data} onLoadMore={loadMoreData} loading={loading} />
    </div>
  )
}

export default App
