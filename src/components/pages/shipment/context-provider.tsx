import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import { useGameData } from '@/lib/store'
import { getBestAcquisitions } from '@/lib/trade'
import { ShipmentContext } from './context'
import { useColumns } from './result-table/columns'

export const ShipmentContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data } = useGameData()

  const [fromCX, setFromCX] = useState<string>('NC1')
  const [toCX, setToCX] = useState<string>('CI1')
  const [weightCapacity, setWeightCapacity] = useState<number>(3000)
  const [volumeCapacity, setVolumeCapacity] = useState<number>(1000)

  const result = useMemo(() => {
    if (!data) return
    return getBestAcquisitions(
      data,
      fromCX,
      toCX,
      weightCapacity,
      volumeCapacity,
    )
  }, [data, fromCX, toCX, weightCapacity, volumeCapacity])

  const columns = useColumns({ fromCX, toCX })

  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data: result?.acquisitions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    columnResizeMode: 'onChange',
    state: {
      rowSelection,
    },
  })

  const value = useMemo(() => {
    return {
      fromCX,
      setFromCX,
      toCX,
      setToCX,
      weightCapacity,
      setWeightCapacity,
      volumeCapacity,
      setVolumeCapacity,
      result,
      table,
      columns,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- table internally tracks rowSelection
  }, [
    fromCX,
    toCX,
    weightCapacity,
    volumeCapacity,
    rowSelection,
    result,
    table,
    columns,
  ])

  return (
    <ShipmentContext.Provider value={value}>
      {children}
    </ShipmentContext.Provider>
  )
}
