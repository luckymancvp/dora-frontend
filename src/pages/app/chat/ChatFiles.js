import React, { useEffect, useRef, useCallback } from 'react';
import { Icon } from "../../../components/Component";
import { isImageFile } from '../../../utils/MediaFile';

const RoomFiles = ({
  name, attachments, uploadImgRef, files, setFiles,
  renderCloseIcon, onFileChangeForm
}) => {
  const filesBoxRef = useRef(null);

  const onChangeFile = useCallback(async selectedFiles => {
    const newFiles = await Promise.all(
      Array.from(selectedFiles).map(async (file) => {
        const fileURL = URL.createObjectURL(file);
        const typeIndex = file.name.lastIndexOf('.');

        const newFile = {
          loading: true,
          name: file.name.substring(0, typeIndex),
          size: file.size,
          type: file.type,
          extension: file.name.substring(typeIndex + 1),
          localUrl: fileURL,
        };

        const blobFile = await fetch(fileURL).then((res) => res.blob());

        newFile.blob = blobFile;
        newFile.loading = false;

        return newFile;
      })
    );

    const filesArray = Array.from(selectedFiles);
    onFileChangeForm(attachments.concat(filesArray));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, [attachments, onFileChangeForm, setFiles]);

  const onRemoveFile = useCallback((index) => {
    onFileChangeForm(attachments.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, [attachments, onFileChangeForm, setFiles]);

  const removeAllFile = useCallback((index) => {
    onFileChangeForm([]);
    setFiles([]);
  }, [onFileChangeForm, setFiles]);

  const renderImageFile = (file, index) => {
    if (!isImageFile(file)) {
      return null;
    }

    return (
      <div className="chat-file-container" key={index}>
        <div
          className={`chat-file-image ${file.loading ? 'vac-blur-loading' : ''}`}
          style={{ backgroundImage: `url('${file.localUrl || file.url}')` }}
        />
        <div
          className="chat-file-icon-remove"
          onClick={() => onRemoveFile(index)}
        >
          <Icon name="cross-sm" />
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (filesBoxRef.current) {
        filesBoxRef.current.scrollTo({
          left: filesBoxRef.current.scrollLeft + e.deltaY,
          behavior: "smooth"
        });
      }
    };

    const filesBox = filesBoxRef.current;
    if (filesBox) {
      filesBox.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (filesBox) {
        filesBox.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <>
      <input name={name} ref={uploadImgRef} onChange={(e) => onChangeFile(e.target.files)} type="file" id="uploadImageInput" className="d-none" accept="image/*" multiple />
      {files.length > 0 && (
        <div className="chat-files-container">
          <div ref={filesBoxRef} className="chat-files-box">
            {files.map((file, index) => renderImageFile(file, index))}
          </div>
          <div className="ml-auto">
            <div className="chat-files-icon-close" onClick={removeAllFile}>
              {renderCloseIcon ? renderCloseIcon() : <Icon name="cross-sm" />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomFiles;
