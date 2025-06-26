import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);

  const failedRenders = [
    {
      id: "render_001",
      userId: "user_123",
      timestamp: "2024-01-15 14:30:22",
      tier: "Better",
      error: "Image processing timeout",
      status: "pending",
    },
    {
      id: "render_002",
      userId: "user_456",
      timestamp: "2024-01-15 13:45:10",
      tier: "Best",
      error: "Invalid image format",
      status: "resolved",
    },
    {
      id: "render_003",
      userId: "user_789",
      timestamp: "2024-01-15 12:15:33",
      tier: "Basic",
      error: "AI service unavailable",
      status: "pending",
    },
  ];

  const systemStats = [
    { label: "Active Users", value: "1,247", change: "+12%", icon: Users },
    {
      label: "Success Rate",
      value: "99.1%",
      change: "+0.3%",
      icon: CheckCircle,
    },
    { label: "Avg Render Time", value: "2.1s", change: "-0.4s", icon: Clock },
    { label: "Failed Renders", value: "23", change: "-8", icon: AlertTriangle },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleOverride = (renderId: string) => {
    console.log(`Overriding render ${renderId}`);
    // Implement override logic
  };

  return (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {systemStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="bg-white/5 border-white/10 backdrop-blur-md"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-green-400 text-sm">{stat.change}</p>
                  </div>
                  <IconComponent className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="failed-renders" className="space-y-4">
        <TabsList className="bg-white/10 border-white/20">
          <TabsTrigger value="failed-renders" className="text-white">
            Failed Renders
          </TabsTrigger>
          <TabsTrigger value="user-management" className="text-white">
            User Management
          </TabsTrigger>
          <TabsTrigger value="system-settings" className="text-white">
            System Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="failed-renders">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Failed Renders</CardTitle>
                  <CardDescription className="text-gray-300">
                    Monitor and override failed AI renders
                  </CardDescription>
                </div>
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  variant="outline"
                  className="border-gray-600 text-white"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {failedRenders.map((render) => (
                  <div
                    key={render.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <code className="text-blue-400 text-sm">
                          {render.id}
                        </code>
                        <Badge
                          variant={
                            render.status === "pending"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {render.status}
                        </Badge>
                        <Badge variant="outline" className="text-gray-300">
                          {render.tier}
                        </Badge>
                      </div>
                      <p className="text-white text-sm">
                        User: {render.userId}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {render.timestamp}
                      </p>
                      <p className="text-red-400 text-sm">{render.error}</p>
                    </div>

                    {render.status === "pending" && (
                      <Button
                        onClick={() => handleOverride(render.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Override & Retry
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-management">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription className="text-gray-300">
                Manage user accounts and subscription statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  User management interface coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-settings">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">System Settings</CardTitle>
              <CardDescription className="text-gray-300">
                Configure AI processing parameters and system defaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  System settings interface coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
