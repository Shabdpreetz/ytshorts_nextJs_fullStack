"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useAuth } from "@clerk/nextjs";


type UploadProps = {
    setVideoUrl?: (url: string) => void; // Optional prop to set the video URL after upload
}


// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const Upload = ({ setVideoUrl }: UploadProps) => {

    const { isSignedIn } = useAuth();

    // State to keep track of the current upload progress (percentage)
    const [progress, setProgress] = useState(0);

    // State to indicate if an upload is currently in progress
    const [uploading, setUploading] = useState(false);

    // Create a ref for the file input element to access its files easily
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create an AbortController instance to provide an option to cancel the upload if needed.
    const abortController = new AbortController();

    //added by me

    const [error, setError] = useState<string | null>(null);

    /**
     * Authenticates and retrieves the necessary upload credentials from the server.
     *
     * This function calls the authentication API endpoint to receive upload parameters like signature,
     * expire time, token, and publicKey.
     *
     * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
     * @throws {Error} Throws an error if the authentication request fails.
     */
    const authenticator = async () => {
        try {
            // Perform the request to the upload authentication endpoint.
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                // If the server response is not successful, extract the error text for debugging.
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            // Parse and destructure the response JSON for upload credentials.
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            // Log the original error for debugging before rethrowing a new error.
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    /**
     * Handles the file upload process.
     *
     * This function:
     * - Validates file selection.
     * - Retrieves upload authentication credentials.
     * - Initiates the file upload via the ImageKit SDK.
     * - Updates the upload progress.
     * - Catches and processes errors accordingly.
     */
    const handleUpload = async () => {
        setError(null); // Clear previous errors

        // Check if the user is signed in
        if (!isSignedIn) {
            setError("You must be logged in to upload videos.");
            return;
        }


        // Access the file input element using the ref
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            setError("Please select a file to upload."); return;
        }




        // Extract the first file from the file input
        const file = fileInput.files[0];


        // this line added by me

        const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

        // Check file size before uploading
        if (file.size > maxFileSize) {
            setError("File size exceeds 20 MB limit. Please select a smaller file.");
            return;
        }


        // Retrieve authentication parameters for the upload.
        let authParams;
        try {
            setUploading(true);
            authParams = await authenticator();

        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            setError("Failed to authenticate for upload.");
            setUploading(false);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.


      

        try {
            const uploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                folder: "/YtShorts", // Optionally specify a folder in ImageKi
                fileName: file.name, // Optionally set a custom file name
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortController.signal,
            });
            console.log("Upload response:", uploadResponse);

            if (setVideoUrl&& uploadResponse.url) {
                setVideoUrl(uploadResponse.url);
            }

        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK.
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {/* File input element using React ref */}
            <div className="flex justify-between items-center">
                <Input type="file" ref={fileInputRef} className="w-1/2" />
                {/* Button to trigger the upload process */}
                <Button type="button" onClick={handleUpload} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload file"}
                </Button>
            </div>
            <br />


            {/* Show progress only when uploading */}
            {uploading && (
                <>
                    {/* Upload progress: <progress value={progress} max={100}></progress> */}
                    Upload progress: <Progress value={progress} max={100} className="w-full mt-2" />
                </>
            )}

            {/* Show error message below upload button */}
            {error && (
                <p style={{ color: "red", marginTop: "8px" }}>
                    {error}
                </p>
            )}

        </>
    );
};

export default Upload;