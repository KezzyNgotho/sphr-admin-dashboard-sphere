import { motion } from 'framer-motion'

interface CardProps {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  color?: 'blue' | 'indigo' | 'emerald' | 'purple'
}

const colors = {
  blue: {
    bg: 'bg-blue-900/20',
    border: 'border-blue-800/30',
    hover: 'hover:border-blue-500/50',
    icon: 'text-blue-400',
    iconBg: 'from-blue-500/30 to-blue-600/30',
    iconHover: 'from-blue-500/40 to-blue-600/40',
    text: 'text-blue-200'
  },
  indigo: {
    bg: 'bg-indigo-900/20',
    border: 'border-indigo-800/30',
    hover: 'hover:border-indigo-500/50',
    icon: 'text-indigo-400',
    iconBg: 'from-indigo-500/30 to-indigo-600/30',
    iconHover: 'from-indigo-500/40 to-indigo-600/40',
    text: 'text-indigo-200'
  },
  emerald: {
    bg: 'bg-emerald-900/20',
    border: 'border-emerald-800/30',
    hover: 'hover:border-emerald-500/50',
    icon: 'text-emerald-400',
    iconBg: 'from-emerald-500/30 to-emerald-600/30',
    iconHover: 'from-emerald-500/40 to-emerald-600/40',
    text: 'text-emerald-200'
  },
  purple: {
    bg: 'bg-purple-900/20',
    border: 'border-purple-800/30',
    hover: 'hover:border-purple-500/50',
    icon: 'text-purple-400',
    iconBg: 'from-purple-500/30 to-purple-600/30',
    iconHover: 'from-purple-500/40 to-purple-600/40',
    text: 'text-purple-200'
  }
}

export default function Card({ title, icon: Icon, children, color = 'blue' }: CardProps) {
  const colorStyles = colors[color]

  return (
    <motion.div 
      className={`${colorStyles.bg} rounded-xl border ${colorStyles.border} shadow-lg hover:shadow-xl transition-all duration-200 p-6 group ${colorStyles.hover} backdrop-blur-xl`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 bg-gradient-to-br ${colorStyles.iconBg} rounded-xl group-hover:${colorStyles.iconHover} transition-colors duration-200`}>
          <Icon className={`h-6 w-6 ${colorStyles.icon}`} />
        </div>
        <div>
          <p className={`text-sm font-medium ${colorStyles.text}`}>{title}</p>
          <div className="mt-1">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  )
} 