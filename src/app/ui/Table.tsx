import { motion } from 'framer-motion'

interface TableProps {
  headers: string[]
  children: React.ReactNode
}

export default function Table({ headers, children }: TableProps) {
  return (
    <motion.div 
      className="bg-blue-900/20 rounded-xl border border-blue-800/30 shadow-lg backdrop-blur-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-800/30">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-800/30">
            {children}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

interface TableRowProps {
  children: React.ReactNode
}

export function TableRow({ children }: TableRowProps) {
  return (
    <tr className="hover:bg-blue-800/20 transition-colors duration-150">
      {children}
    </tr>
  )
}

interface TableCellProps {
  children: React.ReactNode
}

export function TableCell({ children }: TableCellProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
      {children}
    </td>
  )
} 