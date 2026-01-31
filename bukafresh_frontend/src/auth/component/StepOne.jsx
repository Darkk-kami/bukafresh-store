import React from "react";
import PropTypes from "prop-types";
import { User, Mail, Phone, Lock } from "lucide-react";

const StepOne = ({ form, errors, handleChange, InputField, SelectField }) => (
  <div className="space-y-2">
    {[
      {
        id: "Fullname",
        label: "Full Name",
        icon: <User className="h-4 w-4 text-gray-500" />,
        type: "text",
        placeholder: "Your full name",
      },
      {
        id: "Email",
        label: "Email Address",
        icon: <Mail className="h-4 w-4 text-gray-500" />,
        type: "email",
        placeholder: "you@example.com",
      },
      {
        id: "Phone",
        label: "Phone Number",
        icon: <Phone className="h-4 w-4 text-gray-500" />,
        type: "tel",
        placeholder: "+234 801 234 5678",
      },
      {
        id: "Password",
        label: "Password",
        icon: <Lock className="h-4 w-4 text-gray-500" />,
        type: "password",
        placeholder: "At least 8 characters",
      },
    ].map(({ id, label, icon, type, placeholder }) => (
      <InputField
        key={id}
        id={id}
        label={label}
        icon={icon}
        type={type}
        placeholder={placeholder}
        value={form[id]}
        onChange={handleChange}
        error={errors[id]}
      />
    ))}

    <SelectField
      id="country"
      label="Country"
      value={form.country}
      options={[{ label: "Nigeria", value: "NG" }]}
      onChange={handleChange}
    />
  </div>
);

StepOne.propTypes = {
  form: PropTypes.shape({
    Fullname: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Phone: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  InputField: PropTypes.elementType.isRequired,
  SelectField: PropTypes.elementType.isRequired,
};

export default StepOne;