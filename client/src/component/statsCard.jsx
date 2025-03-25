import { useQuery } from '@tanstack/react-query';
import React from 'react';

const fetchPolicies = async () =>{
  const response = await fetch("http://localhost:5000/api/v1/policy");
  if(!response.ok) throw new Error ("Failed to fetch policies");
  return response.json()
};

const StatsCards = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["policies"],
    queryFn: fetchPolicies,
  });

  const policies = Array.isArray(data) ? data : data?.policies || [];

  if (isLoading) return <p>Loading ...</p>
  if (error) return <p>Error: {error.message}</p>
  

  //availble policy types
  const validPolicyTypes = ["Life", "Auto", "Health", "Home"]

    // Count how many policies are "Active"
    const paidCounts = policies.reduce(
      (totals, policy) => {
        if (policy.status === "Active" && validPolicyTypes.includes(policy.policyType)) {
          totals[policy.policyType] = (totals[policy.policyType] || 0) + 1;
        }
        return totals;
      },
      { Life: 0, Auto: 0, Health: 0, Home: 0 } // Initial state
    );
    return (
      <div className="grid grid-cols-4 gap-4">
        {validPolicyTypes.map((policyType) => (
          <div key={policyType} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{policyType}</h3>
            <p>{paidCounts[policyType]}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default StatsCards;
  