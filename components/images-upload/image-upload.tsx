"use client";
import { addDelay, checkIfUrlAccessible } from "@/lib/utils";
import { AnimatePresence, Reorder } from "framer-motion";
import { Loader2, Plus, Trash, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimateHeight } from "../animations/animate-size";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { type Ressources, deleteObject, getSignature, listFiles } from "./server";
import useServerAction from "@/hooks/use-server-action";

export const getFileKey = (url: string): string => {
  const parts = url.split("/");
  return `farm/${parts[parts.length - 1]}`;
};

export const makeURL = (key: string) => {
  return `https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/${key}`;
};

const MAX_FILE_SIZE = 2000000;
const FILES_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

type UploadImageProps = {
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  multipleImages?: boolean;
};

const UploadImage = ({ selectedFiles, setSelectedFiles, multipleImages = false }: UploadImageProps) => {
  const [allFiles, setAllFiles] = useState<string[]>([]);
  const { serverAction: listFilesAction } = useServerAction(listFiles);

  useEffect(() => {
    const fetchFiles = async () => {
      function onSuccess(data?: Ressources[]) {
        if (!data) {
          toast.error("Impossible de charger le fichier. Veuillez reessayer plus tard.");
          return;
        }
        setAllFiles(data.map((item) => makeURL(item.public_id)));
      }
      await listFilesAction({ data: {}, onSuccess });
    };
    fetchFiles();
  }, []);

  return (
    <div className="justify-left flex flex-col gap-4 p-4">
      <InputImage
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        multipleImages={multipleImages}
        setAllFiles={setAllFiles}
      />
      <DisplaySelectedImages
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        multipleImages={multipleImages}
      />

      <DisplayImages
        allFiles={allFiles}
        setFiles={setAllFiles}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        multipleImages={multipleImages}
      />
    </div>
  );
};

export default UploadImage;

type InputImageProps = {
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  multipleImages: boolean;
  setAllFiles: React.Dispatch<React.SetStateAction<string[]>>;
};

function InputImage({ selectedFiles, setSelectedFiles, multipleImages, setAllFiles }: InputImageProps) {
  const { serverAction: getSignatureAction } = useServerAction(getSignature);
  const { serverAction: listFilesAction } = useServerAction(listFiles);
  const [loading, setLoading] = useState(false);

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setLoading(true);
    const files = checkFile(event.dataTransfer.files);
    if (files.length === 0) {
      setLoading(false);
      return;
    }

    await uploadFiles(files);
  };

  const handleInputFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    if (!event.target.files || event.target.files.length === 0) {
      setLoading(false);
      return;
    }

    const files = checkFile(event.target.files);
    if (files.length === 0) {
      setLoading(false);
      return;
    }

    await uploadFiles(files);
  };

  async function uploadFiles(files: File[]) {
    const uploadPromises = await generateUploadPromises(files);

    const results = await Promise.all(uploadPromises);
    const validUrls = results.filter((url) => url !== undefined) as { secureUrl: string; publicId: string }[];

    if (validUrls.length === 0) {
      setLoading(false);
      return;
    }

    await checkUrls(validUrls);

    const allFiles = await listFilesAction({ data: {} });
    if (!allFiles) {
      setLoading(false);
      return;
    }
    setAllFiles(allFiles.map((item) => makeURL(item.public_id)));
    if (multipleImages) {
      setSelectedFiles([...selectedFiles, ...validUrls.map((item) => makeURL(item.publicId))]);
    } else {
      setSelectedFiles([makeURL(validUrls[0].publicId)]);
    }
    setLoading(false);
  }

  async function generateUploadPromises(files: File[]) {
    return files.map(async (file) => {
      const result = await getSignatureAction({ data: {} });
      if (!result) {
        setLoading(false);
        return;
      }

      const { signature, timestamp } = result;

      // const originalFileName = file.name;
      // const fileNameWithoutExtension =
      //   originalFileName.substring(0, originalFileName.lastIndexOf(".")) ||
      //   originalFileName;
      // const randomString = nanoid(10); // Generate a random string of 5 characters

      // // Combine the file name with the random string and the extension to form a new unique file name
      // const uniqueFileName = `${randomString}-${fileNameWithoutExtension}`;

      const formdata = new FormData();
      formdata.append("timestamp", timestamp.toString());
      formdata.append("signature", signature);
      formdata.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      formdata.append("file", file);
      formdata.append("folder", "farm");

      const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
      const response = await fetch(url, {
        method: "POST",
        body: formdata,
        cache: "no-store",
      });
      const data = (await response.json()) as { public_id: string; secure_url: string };
      return { publicId: data.public_id, secureUrl: data.secure_url };
    });
  }

  return (
    <div
      className="justify-left flex items-center gap-4"
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      <label className="relative flex w-fit cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div
          data-state={loading}
          className="absolute right-1/2 top-1/2 hidden -translate-y-1/2 translate-x-1/2 data-[state=true]:block"
        >
          <Loader2 className="animate-spin" />
        </div>

        <div data-state={loading} className="text-center data-[state=true]:blur-md">
          <div className="mx-auto max-w-min rounded-md border bg-foreground p-2">
            <UploadCloud size={20} className="text-primary-foreground" />
          </div>

          <p className="mt-2 text-sm text-primary">
            <span className="font-semibold">{multipleImages ? "Ajouter des images" : "Ajouter une image"}</span>
          </p>
        </div>
        <Input
          accept={FILES_TYPES.join(", ")}
          type="file"
          className="hidden"
          onChange={handleInputFile}
          disabled={loading}
          multiple={multipleImages}
        />
      </label>
      {/* <LoadingButton
      className=" w-fit "
      disabled={loading}
      onClick={async (e) => {
        e.preventDefault();
        setLoading(true);
        const files = await listFiles(bucketName);
        console.log(bucketName);
        if (!files) {
          return;
        }

        setFiles(files);
        setLoading(false);
      }}
    >
      Rechercher les images
    </LoadingButton> */}
    </div>
  );
}

type DisplaySelectedImagesProps = {
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  multipleImages: boolean;
};

const DisplaySelectedImages = ({ selectedFiles, setSelectedFiles, multipleImages }: DisplaySelectedImagesProps) => {
  return (
    <div>
      <h1 className="text-primary">
        {" "}
        {multipleImages && selectedFiles.length > 1 ? "Images selectionnées" : "Image selectionnée"}
      </h1>
      {selectedFiles.length !== 0 ? (
        <Reorder.Group
          as="ul"
          values={selectedFiles}
          onReorder={setSelectedFiles}
          layoutScroll
          className="flex max-w-[1000px] flex-row gap-4 overflow-x-scroll p-2 hide-scrollbar"
          axis="x"
        >
          <AnimatePresence>
            {selectedFiles.map((url) => (
              <Reorder.Item
                key={url}
                value={url}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100px" }}
                exit={{ opacity: 0, width: 0 }}
                as="li"
                className="group relative aspect-square h-[100px] cursor-pointer rounded-xl bg-transparent hover:ring-2"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100px, (max-width: 1200px) 100px, 100px"
                  className="pointer-events-none rounded-xl object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    setSelectedFiles(selectedFiles.filter((item) => item !== url));
                  }}
                  className="absolute right-0 z-10 hidden items-center justify-center rounded-tr-md bg-destructive px-2 text-destructive-foreground transition-all hover:bg-destructive/90 group-hover:flex"
                >
                  <X size={20} />
                </button>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      ) : (
        "Aucune image selectionnée"
      )}
    </div>
  );
};

type DisplayImagesProps = {
  allFiles: string[];
  setFiles: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  multipleImages: boolean;
};

const DisplayImages = ({ allFiles, setFiles, selectedFiles, setSelectedFiles, multipleImages }: DisplayImagesProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 10;
  const [displayFiles, setDisplayFiles] = useState(false);
  const { serverAction } = useServerAction(deleteObject);

  const onDelete = async (url: string | undefined) => {
    if (!url) {
      toast.error("Erreur.");
      return;
    }
    function onSuccess() {
      setFiles(allFiles.filter((fileUrl) => fileUrl !== url));
    }
    await serverAction({
      data: { publicID: getFileKey(url) },
      onSuccess,
    });
  };

  return (
    <div className="space-y-4">
      <p className="my-2 mt-6 text-sm font-medium text-primary">Images disponibles</p>
      <Switch
        onCheckedChange={() => {
          setDisplayFiles(!displayFiles);
        }}
        checked={displayFiles}
      />
      <AnimateHeight display={displayFiles} className="space-y-4 p-1">
        <div className="flex max-w-[1000px] flex-row flex-wrap gap-4 whitespace-nowrap p-2">
          {allFiles.length > 0 ? (
            allFiles
              .filter((fileUrl) => !selectedFiles.includes(fileUrl))
              .slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage)
              .map((fileUrl) => (
                <div
                  key={fileUrl}
                  className="justify-left group relative flex gap-2 overflow-hidden rounded-lg border border-slate-100 pr-2 transition-all hover:border-slate-300"
                >
                  <div className="flex w-fit flex-1 items-center p-2">
                    <div className="relative aspect-square h-10 rounded-xl text-white">
                      <Image
                        src={fileUrl}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 40px, (max-width: 1200px) 40px, 40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-2 w-fit space-y-1">
                      <div className="flex justify-between text-sm">
                        <p className="text-muted-foreground">{getFileKey(fileUrl)}</p>
                      </div>
                    </div>
                  </div>
                  {/* <button
                    type="button"
                    onClick={async (e) => {
                      await onDelete(fileUrl);
                    }}
                    className="absolute right-0 hidden items-center justify-center rounded-tr-md bg-destructive px-2 py-1 text-destructive-foreground transition-all hover:bg-destructive/90 group-hover:flex"
                  >
                    <Trash size={15} />
                  </button> */}
                  <button
                    type="button"
                    onClick={(e) => {
                      if (multipleImages) {
                        setSelectedFiles([...selectedFiles, fileUrl]);
                      } else {
                        setSelectedFiles([fileUrl]);
                      }
                    }}
                    className="absolute left-0 hidden items-center justify-center rounded-tl-md bg-green-800 px-2 py-1 text-green-50 transition-all hover:bg-green-800/90 group-hover:flex"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              ))
          ) : (
            <Loader2 className="m-4 h-8 w-8 animate-spin" />
          )}
        </div>
        <div className="flex items-center justify-start space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              setCurrentPage((prev) => prev - 1);
            }}
            disabled={currentPage === 1}
          >
            Précedent
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              setCurrentPage((prev) => prev + 1);
            }}
            disabled={currentPage * imagesPerPage >= allFiles.length - selectedFiles.length}
          >
            Suivant
          </Button>
        </div>
      </AnimateHeight>
    </div>
  );
};

const checkUrls = async (urls: { secureUrl: string | null; publicId: string }[]): Promise<void> => {
  const invalidUrls = await Promise.all(
    urls.map(async (url) => {
      if (!url.secureUrl) {
        return { secureUrl: null, publicId: url.publicId };
      }
      const isAccessible = await checkIfUrlAccessible(url.secureUrl);
      return isAccessible ? { secureUrl: null, publicId: url.publicId } : url;
    }),
  );

  if (invalidUrls.some((url) => url?.secureUrl !== null)) {
    // If there are still invalid URLs, wait for 250ms and check again
    await addDelay(250);
    return checkUrls(invalidUrls.filter((url) => url.secureUrl !== null));
  }
  return;
};

function checkFile(filesList: FileList) {
  const files: File[] = [];

  for (const file of filesList) {
    if (!FILES_TYPES.includes(file.type)) {
      toast.error(`Le format du fichier n'est pas supporté : ${file.name}\nFormats supportés : png, jpeg, jpg, webp`, {
        duration: 5000,
      });
    } else if (file.size > MAX_FILE_SIZE) {
      toast.error(`Le fichier ${file.name} fait plus de 2MB.`);
    } else {
      files.push(file);
    }
  }
  return files;
}
