import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'

const FileUploader = ({ fieldChange, mediaUrl }) => {
  const [file, setFile] = useState([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles);
    fieldChange(acceptedFiles);  // Pass the files to parent via fieldChange
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));  // Preview the first uploaded file
  }, [fieldChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.svg', '.jpeg'],  // Accept image files
    }
  });

  return (
    <div {...getRootProps()} className='flex flex-col rounded-xl cursor-pointer bg-dark-3'>
      <input {...getInputProps()} className='cursor-pointer' />
      {fileUrl ? (
        <>
          <div className='flex justify-center w-full py-3 sm:p-5'>
            <img 
              src={fileUrl} 
              alt="Uploaded preview" 
              className='h-20 lg:h-[200px] w-full rounded-[24px] object-cover object-center sm:object-cover sm:object-top' 
            />
          </div>
          <p className='text-light-4 text-center small-regular w-full sm:p-4 border-t border-t-dark-4'>
            Click Or Drag photo here to replace
          </p>
        </>
      ) : (
        <div className='flex-center flex-col justify-center w-full h-full items-center'>
          <img src="/assets/file-upload.svg" alt="fileupload" width={96} height={77} className='ml-4' />
          <h3 className='sm:block hidden base-medium text-light-2 mb-2 mt-6'>Drag Photo Here</h3>
          <p className='sm:block hidden text-light-4 small-regular mb-6'>SVG, PNG, JPG</p>
          <Button className='shad-button_dark_4 mt-4'>Select From Device</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
