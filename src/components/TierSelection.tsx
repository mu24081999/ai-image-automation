import { useState } from "react";
import { Zap, Star, Crown, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface TierSelectionProps {
  onTierSelect: (tier: string) => void;
  selectedTier: string | null;
  handleApplyCssFilter: (level: string) => void;
}

const TierSelection = ({
  onTierSelect,
  selectedTier,
  handleApplyCssFilter,
}: TierSelectionProps) => {
  const [isRendering, setIsRendering] = useState(false);

  const tiers = [
    {
      id: "basic",
      name: "Holiday Glow",
      description:
        "A soft touch of Christmas lights and warmth — subtle and serene.",
      icon: Zap,
      color: "from-gray-500 to-gray-600",
      recommended: false,
    },
    {
      id: "better",
      name: "Festive Charm",
      description:
        "Cozy lighting, elegant garlands, and a dash of seasonal spirit.",
      icon: Star,
      color: "from-blue-500 to-blue-600",
      recommended: false,
    },
    {
      id: "best",
      name: "Winter Wonderland",
      description:
        "A full holiday makeover — twinkling lights, lush decor, and magic in every corner.",
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      recommended: false,
    },
  ];

  const handleRender = async (tierId: string) => {
    onTierSelect(tierId);
    setIsRendering(true);

    // Simulate rendering process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsRendering(false);
    handleApplyCssFilter(tierId);
  };

  if (isRendering) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                AI Rendering in Progress
              </h3>
              <p className="text-gray-300">
                Processing your image with {selectedTier} quality...
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-400">
                Estimated time: 2-3 seconds
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {tiers?.map((tier) => {
        const IconComponent = tier.icon;
        const isSelected = selectedTier === tier.id;

        return (
          <Card
            key={tier.id}
            className={`relative bg-white/5 border transition-all cursor-pointer hover:scale-105 ${
              isSelected
                ? "border-blue-400 ring-2 ring-blue-400/50"
                : "border-white/10 hover:border-white/20"
            } ${tier.recommended ? "ring-2 ring-yellow-400/50" : ""}`}
            onClick={() => !isRendering && handleRender(tier.id)}
          >
            {tier.recommended && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black">
                Most Popular
              </Badge>
            )}

            <CardHeader className="text-center">
              <div
                className={`mx-auto w-12 h-12 bg-gradient-to-br ${tier.color} rounded-full flex items-center justify-center mb-4`}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">{tier.name}</CardTitle>
              <CardDescription className="text-2xl font-bold text-white">
                <span className="text-sm text-gray-400 font-normal">
                  {tier.description}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-gray-300"
                  >
                    <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul> */}

              {/* <Button
                className={`w-full bg-gradient-to-r ${tier.color} hover:opacity-90 text-white`}
                disabled={isRendering}
              >
                {isSelected ? "Selected" : `Render with ${tier.name}`}
              </Button> */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TierSelection;
