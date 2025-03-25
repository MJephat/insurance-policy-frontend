import React, { useState } from "react";
import axios from "axios";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import AddPolicyForm from "./form";
import EditPolicyForm from "./editform";

  

const fetchPolicy = async () => {
    const response = await axios.get("http://localhost:5000/api/v1/policy");
    console.log("API Response:", response.data); // Debugging step
    return response.data; // Ensure this is an array or contains an array
  };


  const deletePolicy = async (id) => {
    const response = await fetch(`http://localhost:5000/api/v1/policy/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete policy");
    return response.json();
  };
  

  
  const PolicyTable = () => {
    const [showForm, setShowForm] = useState(false)
    

    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
      queryKey: ["policies"],
      queryFn: fetchPolicy,
    });
  
    console.log("Policies:", data); // Debugging step
  
    // Ensure data is an array, default to empty array if not
    const policies = Array.isArray(data) ? data : data?.policies || [];


    const mutation = useMutation({
        mutationFn: deletePolicy,
        onSuccess: () => {
          queryClient.invalidateQueries(["policies"]); // ✅ Refresh list after deletion
        },
      });
      const [editPolicy, setEditPolicy] = useState(null);
  
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    
  return (
    <div className="bg-white p-6 rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Policies Table</h2>
        <button className="bg-blue-500 text-white text-xs px-4 rounded-full"
        onClick={() => setShowForm(true)}>
          Add Policy
        </button>
      </div>
      {showForm && <AddPolicyForm onClose={() => setShowForm(false)} />}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
                <tr>
                    <th>Policy_No</th>
                    <th>PolicyHolder</th>
                    <th>PolicyType</th>
                    <th>Coverage Amt</th>
                    <th>Premium Amt</th>
                    <th>Startdate</th>
                    <th>endDate</th>
                    <th>status</th>
                    <th>Action</th>
                </tr>
            </thead>
          <tbody>
            {policies.map((policy) => (
              <tr
                key={policy._id}
                className="border-b last:border-none hover:bg-gray-50"
              >
                {/* Date */}
                <td className="p-4 text-gray-600 font-medium">{policy.policyNo}</td>

                {/* Name */}
                <td className="p-4 font-semibold">{policy.policyHolder}</td>

               
                <td className="p-4 text-gray-500">
                  <span className="font-bold">{policy.policyType}</span> 
                </td>


                {/* Amount Spent */}
                <td className="p-4 text-gray-500 font-bold">Ksh. {policy.coverageAmount.toFixed(2)} </td>

               <td className="p-4 text-gray-500">
                  <span className="font-bold">ksh. {policy.premiumAmount.toFixed(2)}</span> 
                </td>
                <td className="p-4 text-gray-500">
                  <span className="font-bold">{new Date(policy.startDate).toLocaleDateString("en-GB")} </span> 
                </td>
                <td className="p-4 text-gray-500">
                  <span className="font-bold">{new Date(policy.endDate).toLocaleDateString("en-GB")} </span> 
                </td>
                {/* Status */}
                <td className="p-4">
                <span
                    className={`text-white text-xs px-3 py-1 rounded-full ${
                    policy.status === "Active" ? "bg-green-500" :
                    policy.status === "Cancelled" ? "bg-orange-300" :
                    policy.status === "Expired" ? "bg-red-300" :
                    "bg-gray-500" // Default color for unknown status
                    }`}
                >
                    {policy.status}
                  </span>
                </td>
                <td>
              <button onClick={() => setEditPolicy(policy._id)}
                className="bg-orange-500 text-white text-xs px-3 rounded-full">
                    Edit
                </button>

                <button onClick={() =>mutation.mutate(_id)}
                className="bg-red-500 text-white text-xs px-3 rounded-full">
                    Delete
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* {editPolicy && (
        <EditPolicyForm
          policy={editPolicy}
          onClose={() => setEditPolicy()}
        />
      )} */}
      </div>
    </div>
  );
};

export default PolicyTable;
