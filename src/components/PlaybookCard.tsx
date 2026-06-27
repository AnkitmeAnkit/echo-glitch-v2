import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Star, Download, ShoppingCart } from 'lucide-react';
import type { Playbook } from '@/data/playbooks';

interface PlaybookCardProps {
  playbook: Playbook;
  index?: number;
}

export default function PlaybookCard({ playbook, index = 0 }: PlaybookCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-150, 150], [3, -3]);
  const rotateY = useTransform(mouseX, [-150, 150], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isFree = playbook.price === 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/playbook/${playbook.id}`)}
      className="group cursor-pointer"
      style={{
        perspective: 800,
      }}
    >
      <motion.div
        className="glass-panel overflow-hidden h-full flex flex-col transition-shadow duration-300 group-hover:shadow-glass-lg"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Cover Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <motion.img
            src={playbook.coverImage}
            alt={playbook.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          />
          {/* Price Badge */}
          <div
            className={
              'absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ' +
              (isFree ? 'bg-accent-teal' : 'bg-accent-violet')
            }
          >
            {isFree ? 'FREE' : `$${playbook.price}`}
          </div>
          {/* New Badge */}
          {playbook.isNew && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white bg-accent-amber">
              NEW
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-clash font-semibold text-lg text-[#1A1A1A] leading-tight mb-2 line-clamp-1">
            {playbook.title}
          </h3>
          <p className="text-[#4A5568] text-sm leading-relaxed mb-3 line-clamp-2 flex-1">
            {playbook.description}
          </p>

          {/* Category Tag */}
          <span className="inline-flex self-start px-3 py-1 rounded-full text-xs font-medium bg-accent-violet/10 text-accent-violet mb-4">
            {playbook.category}
          </span>

          {/* Bottom Row */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={
                      'w-3.5 h-3.5 ' +
                      (i < Math.floor(playbook.rating)
                        ? 'text-accent-amber fill-accent-amber'
                        : 'text-gray-300 fill-gray-300')
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-[#4A5568]">({playbook.reviewCount})</span>
            </div>

            <button
              className={
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ' +
                (isFree
                  ? 'bg-accent-teal text-white hover:brightness-110 hover:scale-105'
                  : 'bg-accent-violet text-white hover:brightness-110 hover:scale-105')
              }
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/playbook/${playbook.id}`);
              }}
            >
              {isFree ? (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Download
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Buy Now
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
