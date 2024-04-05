import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import { Container, Typography } from '@mui/material';
import FileService from '../services/FileService';

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';



const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [files, setFiles] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(null);
  const [uploaderName, setUploaderName] = useState('');
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
      FileService.getAllImages().then((response) => {
          setImageList(response.data);
      });
  }, []);

  const handleImageClick = (fileUri) => {
    window.open(fileUri, '_blank');
};

  const onFileChange = (event) => {
    setFiles(event.target.files);
  };

  const onUploaderNameChange = (event) => {
    setUploaderName(event.target.value);
  };

  const onUpload = (event) => {
    event.preventDefault();
    const formData = new FormData();
  
    for (const key of Object.keys(files)) {
      formData.append('files', files[key]);
    }
    formData.append('name', uploaderName);
  
    FileService.uploadImage(formData)
      .then((response) => {
        console.log(response.data);
        setFileUploaded(true);
        FileService.getAllImages().then((response) => {
          setImageList(response.data);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (

    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              
              <MDBBreadcrumbItem active>User Profile</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid />
                <p className="text-muted mb-1">Pet Sitter Extraordinaire</p>
                <p className="text-muted mb-4">St. Louis, MO</p>
                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn>Follow</MDBBtn>
                  <MDBBtn outline className="ms-1">Message</MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
            <div>
            <h2 className='mt-3 text-center mb-5'>My Pets</h2>
            <div className='row justify-content-center'>
                {
                    imageList.map(
                        image => <div key={image.id} className='px-0 m-2 border bg-light col-3'>
                            <div className='hovereffect' onClick={() => handleImageClick(image.fileUri)}>
                                <img src={image.fileUri} width="150" height="150" alt="no"></img>
                                <div className='overlay'>
                                    <span className='info text-danger bg-light border border-dark'>{image.uploaderName}</span>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">John Smith</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">example@example.com</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">(097) 234-5678</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Address</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">St. Louis, MO</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Pet Type</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">Spider Monkey</MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
            <MDBCol md="6">
      <MDBCard className="mb-4 mb-md-0">
        <MDBCardBody>
          <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Upload Image</span></MDBCardText>
          <form onSubmit={onUpload}>
            <div>
              <label>Select a file:</label>
              <input className='mx-2' type='file' name='file' onChange={onFileChange} multiple></input>
            </div>

            <div className="mt-3">
              <label>Pet Name:</label>
              <input className='mx-2' type='text' name='uploaderName' value={uploaderName} onChange={onUploaderNameChange}></input>
            </div>
            <button className='btn btn-success btn-sm mt-3' type='submit' disabled={!files || !uploaderName}>Upload</button>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">Customer Reviews</MDBCardText>
                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Promptness</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={80} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Communication</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={72} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Reliabilty</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={89} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Pet Handling Skills</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={55} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Flexibility</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={66} valuemin={0} valuemax={100} />
                    </MDBProgress>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}


export default Profile;
