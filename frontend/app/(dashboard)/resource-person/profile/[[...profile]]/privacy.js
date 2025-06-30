"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock, Eye, Shield, Users } from "lucide-react";

const PrivacyContent = () => {
  return (
    <div className="space-y-8">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">
            Privacy settings are currently managed by the system administrator.
            Contact your administrator for any privacy-related concerns.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyContent; 
