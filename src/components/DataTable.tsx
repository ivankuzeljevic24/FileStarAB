import React, { useState, useRef, useEffect } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnDef,
    flexRender,
    SortingState,
    ColumnFiltersState,
    Row,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import type { Employee } from '../types'

interface DataTableProps {
    data: Employee[]
    onLoadMore?: () => void
    loading?: boolean
}

export function DataTable({ data, onLoadMore, loading = false }: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})
    const [editingRow, setEditingRow] = useState<string | null>(null)
    const [editedData, setEditedData] = useState<Record<string, Employee>>({})
    const tableContainerRef = useRef<HTMLDivElement>(null)

    // Define columns
    const columns: ColumnDef<Employee>[] = [
        {
            id: 'nameAndJob',
            header: ({ column }) => {
                return (
                    <div className="flex items-center">
                        <span className="flex-1 font-bold">Name (job title)</span>
                        <div
                            className="ml-2 cursor-pointer"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUpIcon className="h-4 w-4" />
                            ) : column.getIsSorted() === 'desc' ? (
                                <ArrowDownIcon className="h-4 w-4" />
                            ) : (
                                <div className="flex flex-col">
                                    <ArrowUpIcon className="h-2 w-2" />
                                    <ArrowDownIcon className="h-2 w-2" />
                                </div>
                            )}
                        </div>
                    </div>
                )
            },
            accessorFn: row => `${row.name} ${row.jobTitle}`,
            cell: ({ row }) => {
                const id = row.original.id
                const isEditing = editingRow === id
                const name = isEditing ? editedData[id]?.name ?? row.original.name : row.original.name
                const jobTitle = isEditing ? editedData[id]?.jobTitle ?? row.original.jobTitle : row.original.jobTitle

                return (
                    <div className="py-2">
                        {isEditing ? (
                            <>
                                <Input
                                    value={name}
                                    onChange={(e) => {
                                        setEditedData((prev) => ({
                                            ...prev,
                                            [id]: {
                                                ...prev[id] || row.original,
                                                name: e.target.value
                                            }
                                        }))
                                    }}
                                    className="mb-1"
                                />
                                <Input
                                    value={jobTitle}
                                    onChange={(e) => {
                                        setEditedData((prev) => ({
                                            ...prev,
                                            [id]: {
                                                ...prev[id] || row.original,
                                                jobTitle: e.target.value
                                            }
                                        }))
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <div className="font-medium">{name}</div>
                                <div className="text-slate-500 text-sm">{jobTitle}</div>
                            </>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: 'age',
            header: ({ column }) => {
                return (
                    <div className="flex items-center justify-center">
                        <span className="font-bold">Age</span>
                        <div
                            className="ml-2 cursor-pointer"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUpIcon className="h-4 w-4" />
                            ) : column.getIsSorted() === 'desc' ? (
                                <ArrowDownIcon className="h-4 w-4" />
                            ) : (
                                <div className="flex flex-col">
                                    <ArrowUpIcon className="h-2 w-2" />
                                    <ArrowDownIcon className="h-2 w-2" />
                                </div>
                            )}
                        </div>
                    </div>
                )
            },
            cell: ({ row }) => {
                const id = row.original.id
                const isEditing = editingRow === id
                const age = isEditing ? editedData[id]?.age ?? row.original.age : row.original.age

                return isEditing ? (
                    <Input
                        type="number"
                        value={age}
                        onChange={(e) => {
                            setEditedData((prev) => ({
                                ...prev,
                                [id]: {
                                    ...prev[id] || row.original,
                                    age: parseInt(e.target.value)
                                }
                            }))
                        }}
                    />
                ) : (
                    <div className="text-center font-medium">{age}</div>
                )
            },
        },
        {
            accessorKey: 'nickname',
            header: ({ column }) => (
                <div className="font-bold">Nickname</div>
            ),
            cell: ({ row }) => {
                const id = row.original.id
                const isEditing = editingRow === id
                const nickname = isEditing ? editedData[id]?.nickname ?? row.original.nickname : row.original.nickname

                return isEditing ? (
                    <Input
                        value={nickname}
                        onChange={(e) => {
                            setEditedData((prev) => ({
                                ...prev,
                                [id]: {
                                    ...prev[id] || row.original,
                                    nickname: e.target.value
                                }
                            }))
                        }}
                    />
                ) : (
                    <div className="font-medium">{nickname}</div>
                )
            },
        },
        {
            accessorKey: 'isEmployee',
            header: ({ column }) => (
                <div className="font-bold text-center flex items-center justify-center">
                    <span>Employee</span>
                    <div
                        className="ml-2 cursor-pointer"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        <div className="flex flex-col">
                            <ArrowUpIcon className="h-2 w-2" />
                            <ArrowDownIcon className="h-2 w-2" />
                        </div>
                    </div>
                </div>
            ),
            cell: ({ row }) => {
                const id = row.original.id
                const isEditing = editingRow === id
                const isEmployee = isEditing
                    ? (editedData[id]?.isEmployee !== undefined ? editedData[id]?.isEmployee : row.original.isEmployee)
                    : row.original.isEmployee

                return (
                    <div className="flex justify-center">
                        <Checkbox
                            checked={isEmployee}
                            onCheckedChange={(checked) => {
                                if (isEditing) {
                                    setEditedData((prev) => ({
                                        ...prev,
                                        [id]: {
                                            ...prev[id] || row.original,
                                            isEmployee: Boolean(checked)
                                        }
                                    }))
                                }
                            }}
                            disabled={!isEditing}
                            className="border-gray-400"
                        />
                    </div>
                )
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const id = row.original.id
                const isEditing = editingRow === id

                return (
                    <div className="flex justify-end">
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        // Save the edited data
                                        // In a real app, you would call an API to save the changes
                                        console.log('Save changes:', editedData[id])
                                        setEditingRow(null)
                                    }}
                                    className="text-green-600 hover:text-green-900"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        // Cancel editing
                                        const newEditedData = { ...editedData }
                                        delete newEditedData[id]
                                        setEditedData(newEditedData)
                                        setEditingRow(null)
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditingRow(id)}
                                className="text-blue-600 hover:text-blue-900"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: true,
    })

    const { rows } = table.getRowModel()

    // Setup virtualization
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 60, // approximate row height
        overscan: 10,
    })

    // Infinite scrolling handler
    useEffect(() => {
        if (!tableContainerRef.current || !onLoadMore) return

        const handleScroll = () => {
            if (!tableContainerRef.current) return

            const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current

            // When scrolled to the bottom (with a small buffer), load more data
            if (!loading && scrollHeight - scrollTop - clientHeight < 200) {
                onLoadMore()
            }
        }

        const scrollElement = tableContainerRef.current
        scrollElement.addEventListener('scroll', handleScroll)

        return () => {
            scrollElement?.removeEventListener('scroll', handleScroll)
        }
    }, [onLoadMore, loading])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <Input
                    placeholder="Search..."
                    value={(table.getColumn('nameAndJob')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('nameAndJob')?.setFilterValue(event.target.value)
                    }
                    className="w-56 border-2 border-black"
                />

                <div className="flex items-center space-x-2">
                    <span className="font-medium">Select Columns</span>
                    <select
                        className="h-9 px-3 py-1 text-sm border-2 border-black bg-white"
                        onChange={(e) => {
                            const column = table.getColumn(e.target.value)
                            if (column) {
                                column.toggleVisibility(!column.getIsVisible())
                            }
                        }}
                    >
                        <option value="">Select column</option>
                        {table.getAllColumns()
                            .filter((column) => column.id !== 'actions')
                            .map((column) => (
                                <option key={column.id} value={column.id}>
                                    {column.id === 'nameAndJob' ? 'Name' :
                                        column.id === 'isEmployee' ? 'Employee' :
                                            column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <div
                ref={tableContainerRef}
                className="relative border-2 border-black overflow-auto bg-white"
                style={{ height: '600px' }}
            >
                {/* Table Header */}
                <div className="sticky top-0 z-10 bg-gray-200 border-b-2 border-black">
                    <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] w-full">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <React.Fragment key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <div
                                        key={header.id}
                                        className="py-3 px-4 font-bold text-left border-r border-black last:border-r-0"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Table Body */}
                <div className="relative w-full">
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const row = rows[virtualRow.index] as Row<Employee>
                        return (
                            <div
                                key={row.id}
                                data-state={row.getIsSelected() ? 'selected' : undefined}
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                }}
                                className={`grid grid-cols-[3fr_1fr_1fr_1fr_1fr] w-full ${virtualRow.index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                                    }`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <div key={cell.id} className="py-2 px-4 border-r border-b border-gray-300 last:border-r-0">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>

                {loading && (
                    <div className="flex justify-center items-center p-4 absolute bottom-0 left-0 right-0 bg-white bg-opacity-75">
                        Loading more records...
                    </div>
                )}
            </div>

            <div className="text-sm text-gray-500">
                {table.getFilteredRowModel().rows.length} of {data.length} row(s) displayed.
            </div>
        </div>
    )
} 