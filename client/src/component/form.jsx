import React, { useState } from "react";

const AddPolicyForm = ({onClose}) => {
  const [formData, setFormData] = useState({
    policyType: "",
    coverageAmount: "",
    premiumAmount: "",
    startDate: "",
    endDate: "",
    status: "Active",
    policyHolder: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/v1/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add policy");
      }

      alert("Policy added successfully!");
      setFormData({
        policyHolder: "",
        policyType: "",
        coverageAmount: "",
        premiumAmount: "",
        startDate: "",
        endDate: "",
        status: "Active",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding policy.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
        <button
          className=" text-gray-500 hover:text-gray-700 text-xl rounded"
          onClick={onClose} // ✅ Close form when clicked
        >
          X
        </button>
      <h2 className="text-xl font-bold mb-4 text-center">Add Policy</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Policy Type */}
        <div>
          <label className="block font-semibold">Policy Type</label>
          <select
            name="policyType"
            value={formData.policyType}
            onChange={handleChange}
            required
            className="w-full border-gray-300 p-2 rounded"
          >
            <option value="">Select Type</option>
            <option value="Life">Life</option>
            <option value="Auto">Auto</option>
            <option value="Health">Health</option>
            <option value="Home">Home</option>
          </select>
        </div>

         {/* Coverage Amount */}
         <div>
          <label className="block font-semibold">Coverage Amount (Ksh)</label>
          <input
            type="number"
            name="coverageAmount"
            value={formData.coverageAmount}
            onChange={handleChange}
            required
            className="w-full border-gray-300 p-2 rounded"
            placeholder="Enter amount"
          />
        </div>

        {/* Premium Amount */}
        <div>
          <label className="block font-semibold">Premium Amount (Ksh)</label>
          <input
            type="number"
            name="premiumAmount"
            value={formData.premiumAmount}
            onChange={handleChange}
            required
            className="w-full border-gray-300 p-2 rounded"
            placeholder="Enter amount"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block font-semibold">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full border-gray-300 p-2 rounded"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block font-semibold">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full border-gray-300 p-2 rounded"
          />
        </div>

        {/* Policy Status */}
        <div>
          <label className="block font-semibold">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full border-gray-300 p-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {/* Policy Holder Name */}
        <div>
          <label className="block font-semibold">Policy Holder Name</label>
          <input
            type="text"
            name="policyHolder"
            value={formData.policyHolder}
            onChange={handleChange}
            required
            className="w-full border-gray-300 p-2 rounded"
            placeholder="Enter name"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Add Policy
        </button>
      </form>
    </div>
  );
};

export default AddPolicyForm;
