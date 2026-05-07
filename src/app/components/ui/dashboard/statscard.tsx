type Stats = {
    totalGroups: number;
    totalParticipants: number;
    avgGroupSize: number;
  };
  
  export default function StatsCard({
    currentYear,
    currentYearStats,
    previousYearsStats,
  }: {
    currentYear: number;
    currentYearStats: Stats;
    previousYearsStats: Stats;
  }) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Statistics
        </h3>
  
        <div className="grid grid-cols-2 gap-4">
          <StatsSection
            title={String(currentYear)}
            stats={currentYearStats}
          />
  
          <StatsSection
            title="Previous Years"
            stats={previousYearsStats}
          />
        </div>
      </div>
    );
  }
  
  function StatsSection({
    title,
    stats,
  }: {
    title: string;
    stats: {
      totalGroups: number;
      totalParticipants: number;
      avgGroupSize: number;
    };
  }) {
    return (
      <div>
        <div className="text-xs text-gray-600 mb-2 font-semibold">
          {title}
        </div>
  
        <div className="space-y-1">
          <StatRow label="Groups" value={stats.totalGroups} />
  
          <StatRow
            label="Participants"
            value={stats.totalParticipants}
          />
  
          <StatRow
            label="Avg. Size"
            value={stats.avgGroupSize}
          />
        </div>
      </div>
    );
  }
  
  function StatRow({
    label,
    value,
  }: {
    label: string;
    value: number;
  }) {
    return (
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">
          {label}:
        </span>
  
        <span className="text-lg font-bold text-gray-900">
          {value}
        </span>
      </div>
    );
  }