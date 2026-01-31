import React from "react";
import PropTypes from "prop-types";
import { Banknote, Mail, Phone } from "lucide-react";

const StepTwo = ({ form, errors, handleChange, InputField, SelectField }) => (
  <div className="space-y-2">
    <InputField
      id="Org.name"
      label="Organization Name"
      icon={<Banknote className="h-4 w-4 text-gray-500" />}
      value={form.Org.name}
      placeholder="Organization name"
      onChange={handleChange}
      error={errors["Org.name"]}
    />

    <InputField
      id="Org.email"
      label="Organization Email (optional)"
      icon={<Mail className="h-4 w-4 text-gray-500" />}
      value={form.Org.email}
      placeholder="Org email (or use personal)"
      onChange={handleChange}
    />

    <InputField
      id="Org.phone"
      label="Organization Phone (optional)"
      icon={<Phone className="h-4 w-4 text-gray-500" />}
      value={form.Org.phone}
      placeholder="Org phone (or use personal)"
      onChange={handleChange}
    />

    <SelectField
      id="Org.category"
      label="Category"
      value={form.Org.category}
      options={[
        { label: "Bank", value: "Bank" },
        { label: "FinTech", value: "FinTech" },
        { label: "Other", value: "Other" },
      ]}
      onChange={handleChange}
    />

    <SelectField
      id="Org.currency"
      label="Currency"
      value={form.Org.currency}
      options={[
        { label: "NGN", value: "NGN" },
        { label: "USD", value: "USD" },
        { label: "EUR", value: "EUR" },
      ]}
      onChange={handleChange}
    />
  </div>
);

StepTwo.propTypes = {
  form: PropTypes.shape({
    Org: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  InputField: PropTypes.elementType.isRequired,
  SelectField: PropTypes.elementType.isRequired,
};

export default StepTwo;