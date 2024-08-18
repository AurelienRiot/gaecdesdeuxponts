"use client";
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { FormLabel } from "../ui/form";
import { Modal } from "../ui/modal";
import UploadImage from "./image-upload";
import Image from "next/image";

type InputImageModalProps = {
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  multipleImages?: boolean;
};

function InputImageModal({ selectedFiles, setSelectedFiles, multipleImages }: InputImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ImageModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        multipleImages={multipleImages}
      />
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-10 py-6 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 size-24"
      >
        {selectedFiles.length === 0 ? (
          <div className="text-center">
            <div className="mx-auto max-w-min rounded-md border bg-foreground p-2">
              <UploadCloud size={20} className="text-primary-foreground" />
            </div>

            <FormLabel className="mt-2 text-sm font-semibold text-primary">Images</FormLabel>
          </div>
        ) : (
          <Image
            src={selectedFiles[0]}
            alt="image"
            fill
            className="h-full w-full object-contain rounded-lg"
            sizes="100px"
          />
        )}
      </button>
    </>
  );
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  multipleImages?: boolean;
}

const ImageModal = ({ isOpen, onClose, selectedFiles, setSelectedFiles, multipleImages }: ImageModalProps) => {
  return (
    <Modal
      title="Ajouter des images"
      description=""
      isOpen={isOpen}
      onClose={onClose}
      className="left-[50%] top-[50%] max-h-[90%] w-[90%] max-w-[90%] overflow-y-scroll hide-scrollbar"
    >
      <UploadImage selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} multipleImages={multipleImages} />
    </Modal>
  );
};

export default InputImageModal;
