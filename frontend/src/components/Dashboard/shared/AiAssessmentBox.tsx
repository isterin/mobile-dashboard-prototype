interface AiAssessmentBoxProps {
  children: React.ReactNode
}

export function AiAssessmentBox({ children }: AiAssessmentBoxProps) {
  return (
    <div className="rounded-xl border border-blue-600/18 bg-gradient-to-br from-blue-600/5 to-purple-600/4 p-4">
      <div className="mb-2.5 flex items-center gap-1.5">
        <span className="text-[13px] leading-none text-blue-600">&#10022;</span>
        <span className="font-mono text-[10px] font-bold tracking-widest text-blue-600">
          AI ASSESSMENT
        </span>
      </div>
      <div className="text-[13px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  )
}
