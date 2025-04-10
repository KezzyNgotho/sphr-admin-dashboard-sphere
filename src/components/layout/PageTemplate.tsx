import { motion } from 'framer-motion'

interface PageTemplateProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}

export default function PageTemplate({ title, subtitle, children }: PageTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111827] to-[#0A0A0A] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03]"></div>
      
      {/* Animated lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-blue-600/20 to-transparent animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-transparent via-indigo-600/20 to-transparent animate-[spin_15s_linear_infinite]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-blue-200">
                {subtitle}
              </p>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
} 