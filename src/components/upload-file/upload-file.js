import React, { useEffect, useState } from "react";
import "./upload-file.css";
import axios from "axios";
import fileImg from "../../assets/file.png";
import uploadImg from "../../assets/upload.png";
import Dropzone from "react-dropzone";
import Modal from "@material-ui/core/Modal";
import {Button} from "@material-ui/core";

const UploadFile = () => {
  const [file, setFile] = useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isModalOpened, setIsModelOpened] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const uploadProgressText = uploadProgress && (
      (uploadProgress === 100 ? 'File uploaded successfully' : `${uploadProgress}%`)
  );
  
  const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("video", file, file.name);
    for (var p of formData) {
      console.log(p);
    }

    // Details of the uploaded file
    console.log(file);

    axios.post("http://193.106.55.106:8080/upload", formData, {
        onUploadProgress: progressEvent => {
            setUploadProgress(((progressEvent.loaded / progressEvent.total) * 100).toFixed(2))
        }
    }).then(
      (res) => {
        setIsModelOpened(true)
        setFile(undefined);
        setUploadProgress(null);
        setUploadError(null);
      },
      (err) => {
          setIsModelOpened(true);
          setUploadProgress(null);
          setUploadError(err);
      }
    );
  };
  
  const onClose = () => {
      setUploadError(null);
      setIsModelOpened(false);
  }

  return (
    <>
        <Modal open={isModalOpened} onClose={onClose}>
            <div className={'modal'}>
                <div className={'modal-content'}>
                    <div className={'modal-text'}>
                        {uploadError ? <span>File could not be uploaded {uploadError && uploadError.message}</span> :
                            <span>File uploaded successfully</span>
                        }
                    </div>
                    <div className={'modal-footer'}>
                        <Button variant={'outlined'} color={'primary'} className={'modal-ok-button'} 
                                onClick={onClose}>
                            <span>OK</span>
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
      <h1>Upload Video</h1>
      <div className="upload">
        {!file ? (
          <Dropzone onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}>
            {({ getRootProps, getInputProps }) => (
              <section className="upload-section">
                <div {...getRootProps()} className="drop-zone">
                  <input {...getInputProps()} />
                  <div>
                    <img className="upload-img" src={uploadImg} />
                    <p className="drop-zone-text">Upload Video Here</p>
                  </div>
                </div>
              </section>
            )}
          </Dropzone>
        ) : (
          <div className="uploaded-file">
            <img src={fileImg} className="file-img" height="100" />
            <h2 className="file-name">{file?.name}</h2>
          </div>
        )}
      </div>
        <div>
            <b style={{color: 'white'}}>{uploadProgressText}</b>
        </div>
      <div className="buttons">
        {console.log("file",file)}
        <button disabled={file === undefined} onClick={() => onFileUpload()} className="uploadBtn button">
          Upload
        </button>
        <button onClick={() => setFile(undefined)} className="clearBtn button">
          Clear
        </button>
      </div>
    </>
  );
};

export { UploadFile };
