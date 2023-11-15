import React, {useState} from "react";
import { BlobServiceClient, } from "@azure/storage-blob";

async function uploadImage(containerName, file){
    const blob_Service_Client = new BlobServiceClient(
      "https://seniorprojetblob.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-12-16T02:27:03Z&st=2023-10-18T17:27:03Z&spr=https&sig=omQSXh3VhDiu%2BQsjjkJ%2F%2FVSz0A9ZvyKQ%2BzMF6%2FBGWhQ%3D"
    );
    const containerClient = blob_Service_Client.getContainerClient(containerName)
    const blobClient = containerClient.getBlobClient(file.name)
    const blockBlobClient = blobClient.getBlockBlobClient()
    const result = await blockBlobClient.uploadBrowserData(file, {
      blockSize: 4 * 1024 * 1024,
      concurrency: 20,
      onProgress: ev => console.log(ev)
    });
    alert('Upload of file completed');
  }
  
  
  function Upload(props){
    const [file, setfile] = useState(null);
  
    const handleFileChange = event => {
      setfile(event.target.files[0]);
    };
  
    const handleSubmit = event => {
      event.preventDefault();
      uploadImage("dobfiletest", file);
    };
  
    return(props.trigger) ? (
        <div className="upload">
            <div className="upload-inner">
            <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange}></input>
            <button type = "submit">
             Upload Image
            </button>
        </form>
            </div>
            <button className="close-btn" onClick={() => props.setTrigger(false)}>
                close
            </button>
            {props.children}
        </div>
    ):"";
}

export default Upload