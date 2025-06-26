import { useState, useEffect } from "react";
import {
  Upload,
  Zap,
  Settings,
  BarChart3,
  Sparkles,
  Filter,
  Blocks,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import UploadWidget from "../components/UploadWidget";
// import TierSelection from "../components/TierSelection";
import { applyCssFilter } from "../utils/applyCss";
import EmbedGenerator from "../components/EmbedGenerator";
import { useWidgetConfig } from "../config/useWdget";
import { toast } from "sonner";
// import AdminDashboard from "@/components/AdminDashboard";
// import EmbedGenerator from "@/components/EmbedGenerator";

interface FilteredImage {
  name: string;
  url: string;
}
interface Variation {
  level: string;
  image: string[]; // or string, depending on API
}
const Index = () => {
  const [activeTab, setActiveTab] = useState("generator");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("🚀 ~ Index ~ selectedFile:", variations, error);

  const [filterImages, setFilterImages] = useState<FilteredImage[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilteredImage | null>(
    null
  );
  const { brand, theme, logoUrl, primaryColor } = useWidgetConfig();

  const handleFilterApply = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("http://localhost:5000/api/ai/generate-images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unknown error");
      }

      // flatten single image from array if necessary
      const normalized = data.variations.map((v: Variation) => ({
        ...v,
        image: Array.isArray(v.image) ? v.image[0] : v.image,
      }));

      setVariations(normalized);
      toast.info("Success Creating Images!");
    } catch (err: any) {
      // setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
    // if (!uploadedImage) return;
    // const img = new Image();
    // img.crossOrigin = "anonymous";
    // img.src = uploadedImage;
    // img.onload = async () => {
    //   const basic = await applyCssFilter(img, "contrast(90%) saturate(120%)");
    //   const better = await applyCssFilter(
    //     img,
    //     "brightness(1.1) contrast(110%)"
    //   );
    //   const best = await applyCssFilter(
    //     img,
    //     "brightness(1.2) contrast(120%) saturate(130%)"
    //   );
    //   setFilterImages([
    //     { name: "Basic", url: basic },
    //     { name: "Better", url: better },
    //     { name: "Best", url: best },
    //   ]);
    // };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {logoUrl ? (
                <img src={logoUrl} alt="Brand Logo" className="h-8 mb-2" />
              ) : (
                <Sparkles className="h-8 w-8 text-blue-400" />
              )}
              <span className="text-xl font-bold text-white">
                {brand ? brand : "Prisma"} AI Image Widget
              </span>
            </div>
            <div className="flex space-x-4">
              <Button
                variant={activeTab === "generator" ? "default" : "ghost"}
                onClick={() => setActiveTab("generator")}
                className="text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generator
              </Button>
              <Button
                variant={activeTab === "embed" ? "default" : "ghost"}
                onClick={() => setActiveTab("embed")}
                className="text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Embed
              </Button>
              {/* <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                onClick={() => setActiveTab("analytics")}
                className="text-white"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button> */}
              {/* <Button
                variant={activeTab === "admin" ? "default" : "ghost"}
                onClick={() => setActiveTab("admin")}
                className="text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "generator" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                AI-Powered
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                  Lighting Visualization
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transform your property images with professional lighting
                renders in under 5 seconds. Choose from Basic, Better, or Best
                quality tiers.
              </p>
            </div>

            {/* Upload Widget */}
            {filterImages?.length === 0 && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Your Image
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Drag and drop your property image or click to browse.
                    Supports JPG, PNG up to 10MB.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UploadWidget
                    onImageUpload={setUploadedImage}
                    onSetFile={setSelectedFile}
                    uploadedImage={uploadedImage}
                    handleApplyCssFilter={handleFilterApply}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            )}
            {error && <p className="text-red-500">{error}</p>}

            {variations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {variations.map((variation) => (
                  <div key={variation.level} className="border rounded p-2">
                    <img
                      src={variation.image}
                      alt={variation.level}
                      className="w-full h-48 object-cover rounded"
                    />
                    <p className="text-center mt-2 capitalize font-semibold">
                      {variation.level}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {filterImages?.length > 0 && !selectedFilter && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Choose your favourite filter.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {filterImages.map((img) => (
                      <div
                        key={img.name}
                        className={`border-2 p-2 rounded cursor-pointer ${
                          selectedFilter?.name === img.name
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedFilter(img)}
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full object-cover h-48"
                        />
                        <p className="text-center text-white mt-1">
                          {img.name}
                        </p>
                      </div>
                    ))}
                  </div>
                  {selectedFilter && <Button className="mt-4">Continue</Button>}
                </CardContent>
              </Card>
            )}

            {selectedFilter && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Blocks className="w-5 h-5 mr-2" />
                    Your Final Widget
                  </CardTitle>
                </CardHeader>
                <div className="border p-4 mt-4">
                  <img
                    src={selectedFilter.url}
                    alt="Final Filtered"
                    className="w-full h-auto rounded"
                  />
                  <p className="text-center mt-2 text-sm text-gray-600">
                    Filter: {selectedFilter.name}
                  </p>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold">Embed Code:</h4>
                    <pre className="bg-gray-100 p-2 text-sm rounded border mt-1 overflow-auto">
                      {`<iframe src="${selectedFilter.url}" width="100%" height="400" frameborder="0"></iframe>`}
                    </pre>
                  </div>
                  <Button className="mt-4">Save Your Widget</Button>
                </div>
              </Card>
            )}
            {/* <EmbedGenerator /> */}
            {/* Tier Selection */}
            {/* {uploadedImage && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white">
                    Choose Your Render Quality
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Select the quality tier that best fits your needs and
                    budget.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TierSelection
                    onTierSelect={setSelectedTier}
                    selectedTier={selectedTier}
                  />
                </CardContent>
              </Card>
            )} */}

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    &lt; 5s
                  </div>
                  <div className="text-white font-medium">
                    Average Render Time
                  </div>
                  <div className="text-gray-400 text-sm">
                    Lightning fast AI processing
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-2">
                    99.5%
                  </div>
                  <div className="text-white font-medium">Success Rate</div>
                  <div className="text-gray-400 text-sm">
                    Reliable AI rendering
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    10K+
                  </div>
                  <div className="text-white font-medium">Images Processed</div>
                  <div className="text-gray-400 text-sm">
                    Trusted by professionals
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "embed" && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Widget Embedding
              </h2>
              <p className="text-gray-300">
                Generate secure embed codes for your websites and GHL funnels.
              </p>
            </div>
            <EmbedGenerator />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Analytics Dashboard
              </h2>
              <p className="text-gray-300">
                Track usage, performance, and billing across all your widgets.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Renders</p>
                      <p className="text-2xl font-bold text-white">1,247</p>
                    </div>
                    <Zap className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">This Month</p>
                      <p className="text-2xl font-bold text-white">342</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-teal-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Success Rate</p>
                      <p className="text-2xl font-bold text-white">99.1%</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      Excellent
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Revenue</p>
                      <p className="text-2xl font-bold text-white">$2,847</p>
                    </div>
                    <div className="text-green-400 text-sm">+12%</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        {/* 
        {activeTab === "admin" && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
              <p className="text-gray-300">
                Manage system settings, failed renders, and user accounts.
              </p>
            </div>
            <AdminDashboard />
          </div>
        )} */}
      </main>
    </div>
  );
};

export default Index;
