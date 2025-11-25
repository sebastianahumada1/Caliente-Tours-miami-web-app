export default function TermsAndPoliciesPage() {
  return (
    <main 
      data-lenis-prevent
      className="min-h-screen bg-black text-white pt-20 md:pt-24 overflow-y-auto"
    >
      <div className="w-full sm:max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-center" style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}>
          TERMS AND POLICIES
        </h1>
        
        <div className="space-y-6 md:space-y-8 text-sm md:text-base text-gray-300">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white" style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}>
              RESERVATIONS & RESCHEDULING
            </h2>
            <p className="leading-relaxed">
              All payments are final and non-refundable but transferable with approval from management. Charter funds can be transferred with no penalties to future charter date(s) if our office is informed of cancellation and rescheduling at least 30 days prior to originally scheduled departure date. Rescheduling date needs to take place within 12 months of the originally scheduled departure date.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white" style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}>
              CANCELLATIONS & WEATHER PROVISION
            </h2>
            <p className="leading-relaxed">
              In the event of extreme weather such as a hurricane, lightning storm or tornado where it is a danger to be on the water, the owner reserves the right to reschedule the charter at no additional fee. All payments are final and non-refundable. The Captain has the final decision in determining if a charter must be rescheduled due to extreme weather. Rain does not constitute grounds for cancellation or rescheduling.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

