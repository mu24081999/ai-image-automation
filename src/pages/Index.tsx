import React, { useState, useEffect } from "react";
import {
  Upload,
  Zap,
  Settings,
  BarChart3,
  Sparkles,
  Filter,
  Blocks,
  Download,
  ArrowLeft,
  Cross,
  X,
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
import TierSelection from "../components/TierSelection";
import { applyCssFilter } from "../utils/applyCss";
import EmbedGenerator from "../components/EmbedGenerator";
import { useWidgetConfig } from "../config/useWdget";
import _ from "lodash";
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
  console.log("🚀 ~ Index ~ uploadedImage:", uploadedImage);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>("");
  console.log("🚀 ~ Index ~ generatedImage:", generatedImage);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterImages, setFilterImages] = useState<FilteredImage[]>([]);
  const [showSelectTier, setShowSelectTier] = useState<boolean | false>(false);
  const [selectedFilter, setSelectedFilter] = useState<FilteredImage | null>(
    null
  );
  const { brand, theme, logoUrl, primaryColor } = useWidgetConfig();

  const handleFilterApply = async (level) => {
    if (!uploadedImage) return;

    setLoading(true);
    setError(null);
    // const formData = new FormData();
    // formData.append("imageUrl", uploadedImage);

    try {
      const payload = {
        imageUrl: uploadedImage,
        level: "best",
      };
      const res = await fetch("http://localhost:5000/api/ai/generate-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("🚀 ~ handleFilterApply ~ data:", data.data.output);
      setGeneratedImage(data.data.output.image);
      setLoading(false);
      toast.info("Success Creating Images!");
    } catch (err: any) {
      console.log(err, err?.response?.data || err?.message);
      toast.error(err.message);
      setLoading(false);
    }

    // if (!uploadedImage) return;
    // const img = new Image();
    // img.crossOrigin = "anonymous";
    // img.src = uploadedImage;
    // img.onload = async () => {
    //   const filters = {
    //     basic: await applyCssFilter(img, "contrast(90%) saturate(120%)"),
    //     better: await applyCssFilter(img, "brightness(1.1) contrast(110%)"),
    //     best: await applyCssFilter(
    //       img,
    //       "brightness(1.2) contrast(120%) saturate(130%)"
    //     ),
    //   };
    //   const generated = filters[level];
    //   setSelectedFilter({
    //     name: level,
    //     url: generated,
    //   });
    // const basic = await applyCssFilter(img, "contrast(90%) saturate(120%)");
    // const better = await applyCssFilter(
    //   img,
    //   "brightness(1.1) contrast(110%)"
    // );
    // const best = await applyCssFilter(
    //   img,
    //   "brightness(1.2) contrast(120%) saturate(130%)"
    // );
    // setFilterImages([
    //   { name: level, url: generated },
    //   // { name: "Better", url: better },
    //   // { name: "Best", url: best },
    // ]);
    // };
  };
  const handleStepBack = () => {
    console.log("click");
    setUploadedImage(null);
    setSelectedFile(null);
    setSelectedFilter(null);
    setShowSelectTier(false);
    setGeneratedImage(null);
    setFilterImages([]);
  };
  function triggerBlobDownload(
    objectUrl: string,
    filename: string | "image.png"
  ) {
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;

    // Don't open new tab, just simulate click for download
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

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
                {brand ? brand : "Prism"}
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
              {/* <Button
                variant={activeTab === "embed" ? "default" : "ghost"}
                onClick={() => setActiveTab("embed")}
                className="text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Embed
              </Button> */}
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
            {/* {generatedImage && (
              <div>
                <img
                  src={"data:image/png;base64," + generatedImage}
                  alt={"img"}
                  className="rounded-lg shadow w-full"
                />
              </div>
            )} */}
            {/* Upload Widget */}
            {filterImages?.length === 0 &&
              !selectedFilter &&
              !showSelectTier && (
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
                      setShowSelectTier={setShowSelectTier}
                    />
                  </CardContent>
                </Card>
              )}
            {/* 
            {variations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {variations.map((variation) => (
                  <div key={variation.level} className="border rounded p-2">
                    <img
                      src={
                        variation.image ||
                        "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"
                      }
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
            )} */}

            {generatedImage && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="relative">
                    <span className="text-white flex">
                      <Blocks className="w-5 h-5 mr-2" />
                      Your Final Image
                    </span>
                    <span className="absolute right-0 top-0 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        // onClick={() =>
                        //   triggerBlobDownload(
                        //     selectedFilter?.url,
                        //     selectedFilter?.name
                        //   )
                        // }
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleStepBack}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </span>
                  </CardTitle>
                </CardHeader>
                <div className="border p-4 mt-4">
                  <img
                    src={"data:image/png;base64," + generatedImage}
                    alt={"img"}
                    className="rounded-lg shadow w-full"
                  />
                  <p className="text-center mt-2 bg-white p-2 font-extrabold text-sm text-gray-600">
                    Filter: {_.capitalize(selectedTier)}
                  </p>
                </div>
              </Card>
            )}
            {/* Tier Selection */}
            {uploadedImage &&
              !selectedFilter &&
              showSelectTier &&
              !generatedImage && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Transform Your Home for the Holidays
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Bring the magic of Christmas to life with AI-powered
                      festive filters. Choose your style — from a subtle
                      seasonal touch to a full Winter Wonderland makeover.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TierSelection
                      onTierSelect={setSelectedTier}
                      selectedTier={selectedTier}
                      handleApplyCssFilter={handleFilterApply}
                    />
                  </CardContent>
                </Card>
              )}

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

        {/* {activeTab === "embed" && (
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
        )} */}
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
