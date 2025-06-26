import { useState, useCallback } from "react";
import { Upload, Image, X, Crop, Sparkle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropper";
import { applyDuskFilter } from "../utils/applyCss";
interface UploadWidgetProps {
  onImageUpload: (imageUrl: string) => void;
  uploadedImage: string | null;
  handleApplyCssFilter: () => void;
  onSetFile: (file: File) => void;
  loading: boolean | false;
}

const UploadWidget = ({
  onImageUpload,
  uploadedImage,
  handleApplyCssFilter,
  onSetFile,
  loading,
}: UploadWidgetProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCrop, setShowCrop] = useState<boolean | true>(true);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);
  const onCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
    },
    []
  );

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setIsProcessing(true);

    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file);

    // Simulate processing time
    setTimeout(() => {
      onImageUpload(imageUrl);
      onSetFile(file);
      setIsProcessing(false);
    }, 1000);
  };

  const clearImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    onImageUpload("");
  };
  const handleCropConfirm = async () => {
    if (!uploadedImage || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(uploadedImage, croppedAreaPixels);
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setCroppedImage(croppedUrl);
    onImageUpload(croppedUrl);
    setShowCrop(false);
  };
  const handleApplyDuskFilter = async () => {
    if (!uploadedImage) return;

    try {
      const response = await fetch(uploadedImage);
      if (!response.ok) throw new Error("Failed to fetch uploaded image");

      const imageBlob = await response.blob();
      const duskUrl = await applyDuskFilter(imageBlob);
      onImageUpload(duskUrl);
    } catch (err) {
      console.error("Dusk filter failed:", err);
    }
  };

  if (uploadedImage) {
    return (
      <div className="space-y-4">
        <div className="relative group">
          {/* <img
            src={uploadedImage}
            alt="Uploaded preview"
            className="w-full h-64 object-cover rounded-lg"
          /> */}
          <div className="w-full h-64 object-cover rounded-lg">
            <Cropper
              image={uploadedImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        </div>
        <div className="   transition-opacity rounded-lg flex items-center justify-center space-x-2">
          <Button size="sm" variant="destructive" onClick={clearImage}>
            <X className=" h-4" />
            Remove
          </Button>
          {/* {showCrop ? ( */}

          <Button size="sm" variant="secondary" onClick={handleCropConfirm}>
            <Crop className=" h-4" />
            Crop
          </Button>
          {/* ) : ( */}
          <Button
            disabled={loading}
            size="sm"
            variant="default"
            onClick={handleApplyCssFilter}
          >
            <Sparkle className=" h-4" />
            {loading ? "Loading..." : "Generate"}
          </Button>
          {/* )} */}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            <Image className="w-3 h-3 mr-1" />
            Ready for Processing
          </Badge>
          <Badge
            onClick={handleApplyDuskFilter}
            variant="outline"
            className="text-gray-300 cursor-pointer"
          >
            Dusk Filter Available
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={`border-2 border-dashed transition-all cursor-pointer ${
        isDragging
          ? "border-blue-400 bg-blue-400/10"
          : "border-gray-600 hover:border-gray-500"
      } ${isProcessing ? "pointer-events-none opacity-50" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>

          {isProcessing ? (
            <div className="space-y-2">
              <div className="animate-spin mx-auto w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              <p className="text-white font-medium">Processing image...</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-white font-medium">
                  Drag and drop your image here
                </p>
                <p className="text-gray-400 text-sm">
                  or click to browse files
                </p>
              </div>

              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-white/10"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                Choose File
              </Button>

              <div className="text-xs text-gray-500 space-y-1">
                <p>Supported formats: JPG, PNG, WebP</p>
                <p>Maximum size: 10MB</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadWidget;
