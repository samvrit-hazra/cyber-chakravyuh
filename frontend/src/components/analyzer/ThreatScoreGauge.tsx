interface ThreatScoreGaugeProps {
  score: number;
  confidenceScore: number;
  evidenceCoverage: number;
  classification: string;
}

export function ThreatScoreGauge({
  score,
  confidenceScore,
  evidenceCoverage,
  classification,
}: ThreatScoreGaugeProps) {
  const getScoreColor = () => {
    if (score >= 75)
      return {
        text: 'text-[#B64B46] dark:text-[#E17B70]',
        bar: 'bg-[#B64B46] dark:bg-[#E17B70]',
      };
    if (score >= 50)
      return {
        text: 'text-[#A87532] dark:text-[#D7AA61]',
        bar: 'bg-[#A87532] dark:bg-[#D7AA61]',
      };
    if (score >= 25)
      return {
        text: 'text-[#A87532] dark:text-[#D7AA61]',
        bar: 'bg-[#A87532] dark:bg-[#D7AA61]',
      };
    return {
      text: 'text-[#36745F] dark:text-[#79B69A]',
      bar: 'bg-[#36745F] dark:bg-[#79B69A]',
    };
  };

  const { text, bar } = getScoreColor();

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-4 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] transition-colors">
      <div className="text-center sm:text-left space-y-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#647477] dark:text-[#A6B3AE] block">
          Threat Risk Index
        </span>
        <div className="flex items-baseline justify-center sm:justify-start gap-1.5">
          <span className={`text-4xl font-extrabold font-mono ${text}`}>
            {score}
          </span>
          <span className="text-xs text-[#647477] dark:text-[#A6B3AE] font-mono">/ 100</span>
        </div>
        <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">
          Verdict: <strong className="text-[#182629] dark:text-[#E8E6DC]">{classification}</strong>
        </p>
      </div>

      <div className="w-full sm:w-44 space-y-2.5">
        <div>
          <div className="flex justify-between text-[11px] text-[#647477] dark:text-[#A6B3AE] font-mono mb-1">
            <span>Risk Velocity</span>
            <span className={text}>{score}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#D9DED7] dark:bg-[#223336] rounded-xs overflow-hidden">
            <div
              className={`h-full ${bar} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(4, score))}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#647477] dark:text-[#A6B3AE] pt-1 border-t border-[#D9DED7] dark:border-[#304144]">
          <div>
            <span>Confidence: </span>
            <span className="text-[#182629] dark:text-[#E8E6DC] font-semibold">{confidenceScore}%</span>
          </div>
          <div className="text-right">
            <span>Coverage: </span>
            <span className="text-[#182629] dark:text-[#E8E6DC] font-semibold">{evidenceCoverage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
