"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminService } from "@/lib/api-services"
import { useToast } from "@/hooks/use-toast-custom"
import { Loader2, Upload, FileText, CheckCircle } from "lucide-react"

interface UploadPdfDialogProps {
  onSuccess: () => void
}

export function UploadPdfDialog({ onSuccess }: UploadPdfDialogProps) {
  const [loading, setLoading] = useState(false)
  const [publicFile, setPublicFile] = useState<File | null>(null)
  const [privateFile, setPrivateFile] = useState<File | null>(null)
  const { showSuccess, showError } = useToast()
  
  const publicInputRef = useRef<HTMLInputElement>(null)
  const privateInputRef = useRef<HTMLInputElement>(null)

  const handlePublicFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPublicFile(file)
    } else {
      showError("Please select a valid PDF file")
    }
  }

  const handlePrivateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPrivateFile(file)
    } else {
      showError("Please select a valid PDF file")
    }
  }

  const handlePublicUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicFile) {
      showError("Please select a file to upload")
      return
    }

    try {
      setLoading(true)
      const response = await adminService.uploadPublicPDF(publicFile)
      if (response.success) {
        showSuccess("PDF uploaded successfully to public storage")
        setPublicFile(null)
        if (publicInputRef.current) {
          publicInputRef.current.value = ""
        }
        onSuccess()
      }
    } catch (error: any) {
      showError(error.message || "Failed to upload PDF")
    } finally {
      setLoading(false)
    }
  }

  const handlePrivateUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!privateFile) {
      showError("Please select a file to upload")
      return
    }

    try {
      setLoading(true)
      const response = await adminService.uploadPrivatePDF(privateFile)
      if (response.success) {
        showSuccess("PDF uploaded successfully to private storage")
        setPrivateFile(null)
        if (privateInputRef.current) {
          privateInputRef.current.value = ""
        }
        onSuccess()
      }
    } catch (error: any) {
      showError(error.message || "Failed to upload PDF")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload PDF Documents</CardTitle>
        <CardDescription>Upload PDF files to public or private storage</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="public">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="public">Public Storage</TabsTrigger>
            <TabsTrigger value="private">Private Storage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="public">
            <form onSubmit={handlePublicUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="public-pdf">Select PDF File</Label>
                <div className="flex gap-2">
                  <Input
                    id="public-pdf"
                    type="file"
                    accept=".pdf"
                    ref={publicInputRef}
                    onChange={handlePublicFileChange}
                    className="flex-1"
                  />
                </div>
                {publicFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{publicFile.name}</span>
                    <span className="text-xs">({(publicFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                )}
              </div>
              
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Public Storage:</p>
                <p className="text-muted-foreground">
                  Files uploaded here will be accessible to all users (students, teachers, and guests).
                </p>
              </div>
              
              <Button type="submit" disabled={loading || !publicFile} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload to Public Storage
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="private">
            <form onSubmit={handlePrivateUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="private-pdf">Select PDF File</Label>
                <div className="flex gap-2">
                  <Input
                    id="private-pdf"
                    type="file"
                    accept=".pdf"
                    ref={privateInputRef}
                    onChange={handlePrivateFileChange}
                    className="flex-1"
                  />
                </div>
                {privateFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{privateFile.name}</span>
                    <span className="text-xs">({(privateFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                )}
              </div>
              
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Private Storage:</p>
                <p className="text-muted-foreground">
                  Files uploaded here will only be accessible to authenticated users (students and teachers).
                </p>
              </div>
              
              <Button type="submit" disabled={loading || !privateFile} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload to Private Storage
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
