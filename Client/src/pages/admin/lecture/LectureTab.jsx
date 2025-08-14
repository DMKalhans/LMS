import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useEditLectureMutation,
  useGetCourseLectureQuery,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Upload, CheckCircle2, Loader2, Trash2, Video, ShieldCheck, Info } from "lucide-react";

const MEDIA_API = "http://localhost:8080/api/v1/media";

// tiny classnames helper (avoid TS + keeps dependencies minimal)
const cx = (...args) => args.filter(Boolean).join(" ");

function LectureTab() {
  const navigate = useNavigate();
  const params = useParams();
  const { id, lectureId } = params;

  const [isFree, setIsFree] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVidInfo, setUploadVidInfo] = useState(null);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const {data:lectureData} = useGetLectureByIdQuery({lectureId, id});

  const lecture = lectureData?.lecture;

   useEffect(()=>{
    if(lecture){
      setLectureTitle(lecture.lecture_title);
    }
  },[lecture])

  const { refetch } = useGetCourseLectureQuery(id, { skip: !id });

  const [editLecture, { data, isLoading, isSuccess, error }] =
    useEditLectureMutation();

  const [
    removeLecture,
    { data: removeData, isLoading: removeIsLoading, isSuccess: removeIsSuccess, error: removeError },
  ] = useRemoveLectureMutation();

  const inputRef = useRef(null);

  const canSubmit = useMemo(() => {
    return Boolean(lectureTitle && lectureTitle.trim()) && Boolean(uploadVidInfo) && !isLoading;
  }, [lectureTitle, uploadVidInfo, isLoading]);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setMediaProgress(true);

    try {
      const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
        onUploadProgress: ({ loaded, total }) => {
          if (!total) return;
          setUploadProgress(Math.round((loaded * 100) / total));
        },
      });

      if (res.data?.success) {
        setUploadVidInfo({
          videoUrl: res.data.data.url,
          publicId: res.data.data.public_id,
        });
        setBtnDisable(false);
        toast.success(res.data.message || "Video uploaded");
      }
    } catch (err) {
      console.log(err);
      toast.error("Video upload failed");
    } finally {
      setMediaProgress(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  const editLectureHandler = () => {
    // keep payload shape as-is
    editLecture({ lectureTitle, isFree, uploadVidInfo, lectureId, id });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture updated");
      navigate(`/admin/course/${id}/lectures/${lectureId}`);
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to update");
    }
  }, [isSuccess, error]);

  const removeLectureHandler = () => {
    removeLecture({ lectureId, id });
  };

  useEffect(() => {
    if (removeIsSuccess) {
      toast.success(removeData?.message || "Lecture removed");
      refetch();
      navigate(`/admin/course/${id}/lectures`);
    }
    if (removeError) {
      toast.error(removeError?.data?.message || "Failed to remove lecture");
    }
  }, [removeIsSuccess, removeError]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-lg dark:shadow-black/30 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-gradient-to-b from-muted/40 to-background p-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Edit Lecture</CardTitle>
            <CardDescription>Make changes and click save when done</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className={cx(
                      "px-3 py-1 text-xs",
                      isFree ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : ""
                    )}
                  >
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    {isFree ? "Free" : "Paid"}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Toggle below to mark this lecture free for preview
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={removeIsLoading}>
                  {removeIsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="ml-2">Remove</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Remove lecture?</DialogTitle>
                  <DialogDescription>
                    This action is irreversible. The lecture and its associations will be deleted.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive" onClick={removeLectureHandler}>
                    Confirm Remove
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="lecture-title">Title</Label>
            <Input
              id="lecture-title"
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Ex. Intro to Java"
              className="h-11 rounded-xl"
            />
          </div>

          <Separator className="my-6" />

          {/* Upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="video">
                Video <span className="text-red-500">*</span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent>MP4, MOV, or WEBM recommended</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className={cx(
                "group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition",
                "bg-muted/40 hover:bg-muted/60",
                mediaProgress ? "opacity-70" : ""
              )}
            >
              <Video className="h-10 w-10 mb-2 opacity-70" />
              <p className="text-sm text-muted-foreground mb-2 text-center">
                Drag & drop your video here, or
              </p>
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  id="video"
                  className="w-fit hidden"
                  type="file"
                  onChange={fileChangeHandler}
                  accept="video/*"
                />
                <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> Choose file
                </Button>
              </div>

              {uploadVidInfo && !mediaProgress && (
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="truncate max-w-[260px]">Video uploaded</span>
                </div>
              )}

              {mediaProgress && (
                <div className="w-full mt-4">
                  <Progress value={uploadProgress} />
                  <p className="text-xs mt-1 text-muted-foreground text-right">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Free toggle */}
          <div className="flex items-center gap-3">
            <Switch
              checked={isFree}
              onCheckedChange={() => setIsFree((prev) => !prev)}
              id="is-free"
            />
            <Label htmlFor="is-free">Is this video FREE</Label>
          </div>

          {/* Footer actions */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <Button
              onClick={editLectureHandler}
              className="rounded-xl min-w-[150px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Update Lecture"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LectureTab;
