import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconColor?: string;
  trend?: string;
  delay?: number;
}

export default function StatCard({ title, value, icon, iconColor = '#6C63FF', trend, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{title}</p>
          <h3 className="text-3xl font-clash font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--accent-teal)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--accent-teal)' }}>{trend}</span>
            </div>
          )}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}18` }}
        >
          <div style={{ color: iconColor }}>{icon}</div>
        </div>
      </div>
    </motion.div>
  );
}
