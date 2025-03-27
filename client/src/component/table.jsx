import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddPolicyForm from "./form";

const fetchPolicy = async () => {
  const response = await axios.get("http://localhost:5000/api/v1/policy");
  return response.data;
};

const deletePolicy = async (id) => {
  await axios.delete(`http://localhost:5000/api/v1/policy/${id}`);
};

const updatePolicy = async ({ id, updatedData }) => {
  const response = await axios.put(`http://localhost:5000/api/v1/policy/${id}`, updatedData);
  return response.data;
};

const PolicyTable = () => {
  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});

  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["policies"],
    queryFn: fetchPolicy,
  });

  const policies = Array.isArray(data) ? data : data?.policies || [];

  const deleteMutation = useMutation({
    mutationFn: deletePolicy,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["policies"] }),
  });

  const updateMutation = useMutation({
    mutationFn: updatePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      setEditRow(null);
    },
  });

  const handleEdit = (policy) => {
    setEditRow(policy._id);
    setEditData({ ...policy }); // Store full policy data for editing
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateMutation.mutate({ id: editRow, updatedData: editData });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Policies Table</h2>
        <button className="bg-blue-500 text-white text-xs px-4 rounded-full"
          onClick={() => setShowForm(true)}>
          Add Policy
        </button>
      </div>
      {showForm && <AddPolicyForm onClose={() => setShowForm(false)} />}

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
              <tr key={policy._id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-600 font-medium">{policy.policyNo}</td>
                <td className="p-4 font-semibold">
                  {editRow === policy._id ? (
                    <input
                      type="text"
                      name="policyHolder"
                      value={editData.policyHolder}
                      onChange={handleChange}
                      className="border px-2 w-full"
                    />
                  ) : (
                    <span>{policy.policyHolder}</span>
                  )}
                </td>
                <td className="p-4 text-gray-500">
                  {editRow === policy._id ? (
                    <select name="policyType" value={editData.policyType} onChange={handleChange} className="border px-2 w-full">
                      <option>Life</option>
                      <option>Auto</option>
                      <option>Health</option>
                      <option>Home</option>
                    </select>
                  ) : (
                    policy.policyType
                  )}
                </td>
                <td className="p-4 text-gray-500 font-bold">
                  {editRow === policy._id ? (
                    <input type="number" name="coverageAmount" value={editData.coverageAmount} onChange={handleChange} className="border px-2 w-full" />
                  ) : (
                    `Ksh. ${policy.coverageAmount.toFixed(2)}`
                  )}
                </td>
                <td className="p-4 text-gray-500">
                  {editRow === policy._id ? (
                    <input type="number" name="premiumAmount" value={editData.premiumAmount} onChange={handleChange} className="border px-2 w-full" />
                  ) : (
                    `Ksh. ${policy.premiumAmount.toFixed(2)}`
                  )}
                </td>
                <td className="p-4 text-gray-500">{new Date(policy.startDate).toLocaleDateString("en-GB")}</td>
                <td className="p-4 text-gray-500">{new Date(policy.endDate).toLocaleDateString("en-GB")}</td>
                <td className="p-4">
                  {editRow === policy._id ? (
                    <select name="status" value={editData.status} onChange={handleChange} className="border px-2 w-full">
                      <option>Active</option>
                      <option>Cancelled</option>
                      <option>Expired</option>
                    </select>
                  ) : (
                    <span className={`text-white text-xs px-3 py-1 rounded-full 
                      ${policy.status === "Active" ? "bg-green-500" : 
                      policy.status === "Cancelled" ? "bg-orange-300" : 
                      policy.status === "Expired" ? "bg-red-300" : 
                      "bg-gray-500"}`}>
                      {policy.status}
                    </span>
                  )}
                </td>
                <td className="p-4 flex gap-2">
                  {editRow === policy._id ? (
                    <>
                      <button onClick={handleSave} className="bg-green-500 text-white text-xs px-3 rounded-full">
                        Save
                      </button>
                      <button onClick={() => setEditRow(null)} className="bg-gray-500 text-white text-xs px-3 rounded-full">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(policy)}
                        className="bg-orange-500 text-white text-xs px-3 rounded-full">
                        Edit
                      </button>
                      <button onClick={() => deleteMutation.mutate(policy._id)}
                        className="bg-red-500 text-white text-xs px-3 rounded-full">
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PolicyTable;
