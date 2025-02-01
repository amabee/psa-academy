const PrivacyContent = ({ SelectField, CustomSwitch }) => (
  <div className="space-y-4">
    <SelectField
      label="Profile Visibility"
      description="Control who can see your profile"
      options={["Public", "Private", "Connections Only"]}
      defaultValue="Public"
      className="bg-inherit"
      optionBGcolor="bg-[rgb(37,38,47)] text-white"
    />
    <CustomSwitch
      label="Activity Status"
      description="Show when you're online"
      defaultChecked={true}
    />
    <CustomSwitch
      label="Search Visibility"
      description="Allow others to find your profile"
      defaultChecked={true}
    />
  </div>
);

export default PrivacyContent;