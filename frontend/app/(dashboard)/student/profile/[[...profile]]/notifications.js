const NotificationsContent = ({ CustomSwitch }) => (
  <div className="space-y-4">
    <CustomSwitch
      label="Email Notifications"
      description="Receive important updates and announcements via email"
      defaultChecked={true}
    />
    <CustomSwitch
      label="Push Notifications"
      description="Get instant notifications for messages and mentions"
      defaultChecked={true}
    />
    <CustomSwitch
      label="Event Reminders"
      description="Receive reminders about upcoming events and sessions"
      defaultChecked={true}
    />
    <CustomSwitch
      label="Marketing Communications"
      description="Stay updated with our latest features and offerings"
      defaultChecked={false}
    />
  </div>
);

export default NotificationsContent;
