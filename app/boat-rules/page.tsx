export default function BoatRulesPage() {
  return (
    <main 
      data-lenis-prevent
      className="min-h-screen bg-black text-white pt-20 md:pt-24 overflow-y-auto"
    >
      <div className="w-full sm:max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-center" style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}>
          BOAT RULES AND WARNINGS NOTIFICATION RULES
        </h1>
        
        <div className="space-y-4 md:space-y-6 text-sm md:text-base text-gray-300">
          <ul className="space-y-4 list-disc list-inside">
            <li>Adults must accompany children at all times (Kids of 13 year or less must wear a lifejacket all the time).</li>
            <li>NOT Diving.</li>
            <li>Must Know how to swim to get in the water.</li>
            <li>Smoking in the boat is NOT permitted.</li>
            <li>Hookah use is NOT permitted.</li>
            <li>Weapons are NOT allowed in the boat.</li>
            <li>Drugs are NOT allowed in the boat if drugs were found we reserve the right to cancel the charter at such time.</li>
            <li>Do NOT stand on the boat platform when the boat is in movement, platform access doors must be stay closed at all time.</li>
            <li>Do NOT wear shoes inside the boat.</li>
            <li>Do NOT throw paper or any other hygiene item in the toilet.</li>
            <li>Red Wine is NOT allowed.</li>
            <li>Glass Drinkware are NOT allowed.</li>
            <li>Burners are NOT allowed.</li>
            <li>Do NOT throw by any reason trash or any product to the water, BOAT/YACHT is compromised with maintain our waters clean. If you throw any trash to the water, we will stop the trip until we clean up any trash and the time will be discontinued from your trip.</li>
            <li>You must follow the Captain instruction all time, is for your safety</li>
          </ul>

          <div className="mt-6 md:mt-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white" style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}>
              Warnings:
            </h2>
            <ul className="space-y-4 list-disc list-inside">
              <li>Not recommended for travelers with back problems.</li>
              <li>Not recommended for travelers with heart problems or other serious medical conditions.</li>
              <li>Not recommended for pregnant travelers.</li>
              <li>If you have any other health conditions and aren&apos;t sure if you should ride, contact your doctor before doing the activity.</li>
              <li>Not wheelchair accessible.</li>
              <li>Minimum drinking age is 21 years.</li>
            </ul>
          </div>

          <p className="mt-8 text-sm italic text-gray-400">
            CALIENTETOURSMIAMI is not responsible for cell phones, sunglasses, cameras, personals valuables or other lost items or damage for the water
          </p>
        </div>
      </div>
    </main>
  );
}

