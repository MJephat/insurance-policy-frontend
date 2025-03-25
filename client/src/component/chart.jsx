import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const fetchPolicies = async () => {
  const response = await fetch("http://localhost:5000/api/v1/policy");
  if (!response.ok) throw new Error("Failed to fetch policies");
  return response.json();
};

const Chart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["policies"],
    queryFn: fetchPolicies, // ✅ Fixed function call
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const policies = Array.isArray(data) ? data : data?.policies || [];
  const validPolicyTypes = ["Life", "Auto", "Health", "Home"];

  // ✅ Calculate premiums per policy type
  const premiums = policies.reduce((totals, policy) => {
    if (policy.status === "Active" && validPolicyTypes.includes(policy.policyType)) {
      totals[policy.policyType] = (totals[policy.policyType] || 0) + policy.premiumAmount;
    }
    return totals;
  }, { Life: 0, Auto: 0, Health: 0, Home: 0 });

  // ✅ Convert object to array for the chart
  const chartData = validPolicyTypes.map((policyType) => ({
    name: policyType,
    premium: premiums[policyType],
  }));

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Premiums by Policy Type</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="premium" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
