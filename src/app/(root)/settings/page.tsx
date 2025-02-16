'use client';

import  Button  from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import  Switch  from "@/components/ui/switch";
import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Notifications</span>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Sound Effects</span>
              <Switch 
                checked={soundEnabled} 
                onCheckedChange={setSoundEnabled} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
