import { useState } from "react";
import { Copy, Code, Eye, Settings } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const EmbedGenerator = () => {
  const [widgetConfig, setWidgetConfig] = useState({
    name: "My Lighting Widget",
    domain: "example.com",
    enableDuskFilter: true,
    maxFileSize: "10MB",
    allowedTiers: ["basic", "better", "best"],
    theme: "dark",
  });

  const [embedCode, setEmbedCode] = useState("");

  const generateEmbedCode = () => {
    const code = `<!-- LightViz AI Widget -->
<div id="lightviz-widget" data-config='${JSON.stringify(widgetConfig)}'></div>
<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://embed.lightviz.ai/widget.js';
  script.setAttribute('data-widget-id', 'widget_${Date.now()}');
  document.head.appendChild(script);
})();
</script>`;

    setEmbedCode(code);
    toast.success("Embed code generated!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard!");
  };

  const previewWidget = () => {
    toast.info("Opening widget preview...");
    // Implement preview functionality
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Configuration Panel */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Widget Configuration
          </CardTitle>
          <CardDescription className="text-gray-300">
            Customize your AI widget settings and appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white">Widget Name</Label>
            <Input
              value={widgetConfig.name}
              onChange={(e) =>
                setWidgetConfig({ ...widgetConfig, name: e.target.value })
              }
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter widget name"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Allowed Domain</Label>
            <Input
              value={widgetConfig.domain}
              onChange={(e) =>
                setWidgetConfig({ ...widgetConfig, domain: e.target.value })
              }
              className="bg-white/10 border-white/20 text-white"
              placeholder="example.com"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-white">Enable Dusk Filter</Label>
            <Switch
              checked={widgetConfig.enableDuskFilter}
              onCheckedChange={(checked) =>
                setWidgetConfig({ ...widgetConfig, enableDuskFilter: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Available Tiers</Label>
            <div className="flex space-x-2">
              {["basic", "better", "best"].map((tier) => (
                <Badge
                  key={tier}
                  variant={
                    widgetConfig.allowedTiers.includes(tier)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => {
                    const newTiers = widgetConfig.allowedTiers.includes(tier)
                      ? widgetConfig.allowedTiers.filter((t) => t !== tier)
                      : [...widgetConfig.allowedTiers, tier];
                    setWidgetConfig({
                      ...widgetConfig,
                      allowedTiers: newTiers,
                    });
                  }}
                >
                  {tier}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={generateEmbedCode}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
          >
            <Code className="w-4 h-4 mr-2" />
            Generate Embed Code
          </Button>
        </CardContent>
      </Card>

      {/* Embed Code Panel */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Embed Code
          </CardTitle>
          <CardDescription className="text-gray-300">
            Copy and paste this code into your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {embedCode ? (
            <>
              <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                  {embedCode}
                </pre>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1 border-gray-600 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
                <Button
                  onClick={previewWidget}
                  variant="outline"
                  className="border-gray-600 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">
                  Integration Notes:
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>
                    • Place the embed code where you want the widget to appear
                  </li>
                  <li>• Widget will automatically match your site's styling</li>
                  <li>• Secure JWT tokens ensure domain-specific access</li>
                  <li>• Usage tracking and billing handled automatically</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Code className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                Configure your widget settings and generate embed code
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmbedGenerator;
