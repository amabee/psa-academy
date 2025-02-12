import { Button } from "@/components/ui/button";

const SecurityContent = ({ InputField }) => (
  <div className="space-y-6">
    <InputField label="Current Password" type="password" />
    <InputField label="New Password" type="password" />
    <InputField label="Confirm New Password" type="password" />
    <div className="flex flex-col space-y-4">
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1">
        Update Password
      </Button>
      {/* <Button className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-1">
        Enable Two-Factor Authentication
      </Button> */}
    </div>
  </div>
);

export default SecurityContent;
