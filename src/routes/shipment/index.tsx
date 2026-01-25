import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { loadData } from '@/lib/fio/store'
import { formatAcquisitionSummary, getBestAcquisitions } from '@/lib/trade'

export const Route = createFileRoute('/shipment/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery({
    queryKey: ['initData'],
    queryFn: loadData,
    staleTime: Infinity,
  })

  const [fromCX, setFromCX] = useState('')
  const [toCX, setToCX] = useState('')

  const result = useMemo(() => {
    if (!data) return
    return getBestAcquisitions(data, fromCX, toCX, 3000, 1000)
  }, [data, fromCX, toCX])

  return (
    <div>
      <h1>Shipment Page</h1>

      <div className="flex gap-4">
        <div>
          <label htmlFor="fromCX">From CX</label>
          <input
            id="fromCX"
            type="text"
            value={fromCX}
            onChange={e => setFromCX(e.target.value)}
          />
        </div>

        {/* reverse */}
        <div>
          <button
            type="button"
            onClick={() => {
              setFromCX(toCX)
              setToCX(fromCX)
            }}
          >
            Reverse
          </button>
        </div>

        <div>
          <label htmlFor="toCX">To CX</label>
          <input
            id="toCX"
            type="text"
            value={toCX}
            onChange={e => setToCX(e.target.value)}
          />
        </div>
      </div>

      <pre>{result ? formatAcquisitionSummary(result) : 'Loading...'}</pre>
    </div>
  )
}
