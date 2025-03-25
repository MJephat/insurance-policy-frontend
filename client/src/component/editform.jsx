import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ✅ Fixed updatePolicy function
const updatePolicy = async (updatedPolicy) => {
  const response = await fetch(
    `http://localhost:5000/api/v1/policy/${id}`, // ✅ Correct id reference
    {
      method: "PUT", // Or PATCH if only updating certain fields
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPolicy),
    }
  );
  if (!response.ok) throw new Error("Failed to update policy");
  return response.json();
};

const EditPolicyForm = ({ policy, onClose }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(updatePolicy, {
    onSuccess: () => {
      queryClient.invalidateQueries(["policies"]); // ✅ Refresh list
      onClose(); // ✅ Close modal
    },
  });

  // ✅ Ensure _id is included in formData
  const [formData, setFormData] = useState({ ...policy });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData); // ✅ Pass correct data
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Edit Policy</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Policy Holder</label>
            <input
              type="text"
              name="policyHolder"
              value={formData.policyHolder}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Policy Type</label>
            <select
              name="policyType"
              value={formData.policyType}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option>Life</option>
              <option>Auto</option>
              <option>Health</option>
              <option>Home</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Premium Amount</label>
            <input
              type="number"
              name="premiumAmount"
              value={formData.premiumAmount}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option>Active</option>
              <option>Cancelled</option>
              <option>Expired</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded font-semibold w-full hover:bg-green-700 transition"
          >
            {mutation.isLoading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPolicyForm;
