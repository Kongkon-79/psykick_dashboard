"use client";
import TmcInactiveTargets from "./_components/TmcInactiveTargets";
import ArvInactiveTargets from "./_components/ArvInactiveTargets";
import TmcActiveTarget from "./_components/TmcActiveTarget";
import ArvActiveTarget from "./_components/ArvActiveTarget";

export default function ManageTargetsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* TMC Targets Section */}
        <div>
          <div className="bg-[#8F37FF] text-white p-3 rounded-t-md font-medium text-[28px]">
            TMC Targets
          </div>

          {/* Active Targets */}
          <div className="rounded-b-md mb-6">
            {/* TMC Active Targets  */}
            <TmcActiveTarget />

            {/* TMC Targets  */}
            <TmcInactiveTargets />
          </div>
        </div>

        {/* ARV Targets Section */}
        <div>
          <div className="bg-[#8F37FF] text-white p-3 rounded-t-md font-medium text-[28px]">
            ARV Targets
          </div>

          {/* Active Targets */}
          <div className="rounded-b-md mb-6">
            {/* ARV Active Target  */}
            <ArvActiveTarget />
          </div>

          {/* arv inactive targets  */}
          <ArvInactiveTargets />
        </div>
      </main>
    </div>
  );
}
