import { useQuery } from '@tanstack/react-query';
import React from 'react';
// const KPICards =async () => {
    // const kpis = [
    //   { label: "Revenue", value: "$4,800.00" },
    //   { label: "Net", value: "$4,900.24" },
    //   { label: "Pending Orders", value: "$1,600.50" },
    //   { label: "Due", value: "$6,900.10" },
    // ];
    const fetchPolicies = async () => {
      const response = await fetch("http://localhost:5000/api/v1/policy");
      if (!response.ok) throw new Error("Failed to fetch policies");
      return response.json();
    };


    const KPICards = () => {
      const { data, isLoading, error } = useQuery({
        queryKey: ["policies"],
        queryFn: fetchPolicies,
      });

      const policies = Array.isArray(data) ? data : data?.policies || [];


      if (isLoading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;

      // Policy categories we need to calculate
      const validPolicyTypes = ["Life", "Auto", "Health", "Home"];

   // Calculate premiums per policy type
    const premiums = policies.reduce(
      (totals, policy) => {
        if (policy.status === "Active" && validPolicyTypes.includes(policy.policyType)) {
          totals[policy.policyType] = (totals[policy.policyType] || 0) + policy.premiumAmount;
        }
        return totals;
      },
      { Life: 0, Auto: 0, Health: 0, Home: 0 } // Initial state
    );

    return (
      <div>
        <h2 className="text-xl font-bold mt-6">Key Performance Indicators</h2>
        <div className="grid grid-cols-4 gap-4 mt-2">
          {validPolicyTypes.map((policyType) => (
            <div key={policyType} className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold">{policyType} Policies</h3>
              <p>Ksh. {premiums[policyType].toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default KPICards;
  