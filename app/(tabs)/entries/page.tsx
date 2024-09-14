import { DataTable } from '@/components/ui/data-table'
import React from 'react'
import { columns } from './_components/columns'
import { entries } from './dummy-data'

const EntriesPage = () => {
	return (
		<main className='w-full min-h-full mb-20 p-4'>
			<h1 className='text-2xl font-bold text-center'>Income & Expense Entries</h1>
			<hr className='my-4'/>
			<DataTable columns={columns} data={entries}/>
		</main>
	)
}

export default EntriesPage