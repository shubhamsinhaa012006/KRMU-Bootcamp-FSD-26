
import { Spotlight } from '../components/shared/Spotlight';
import { PlaylistOverviewCards } from '../components/dashboard/PlaylistOverviewCards';
import { MoodDistribution } from '../components/dashboard/MoodDistribution';
import { motion } from 'framer-motion';

export const DashboardPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full flex flex-col gap-8 relative"
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-2">
          Your Dashboard
        </h1>
        <p className="text-neutral-400 text-lg mb-8">
          Analyze your listening habits and mood distribution.
        </p>

        <PlaylistOverviewCards />
        <MoodDistribution />
      </div>
    </motion.div>
  );
};
