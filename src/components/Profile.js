import React, { useEffect, useState } from "react";
import { Button, TextField, Typography, Grid, Card, CardMedia } from '@mui/material';
import FileService from '../services/FileService';
import AuthService from "../services/auth.service";


import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBProgress,
  MDBProgressBar,
  MDBRow
} from 'mdb-react-ui-kit';
import BadgeCard from "./BadgeCard";
import { useNavigate } from "react-router-dom";



const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [files, setFiles] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(null);
  const [uploaderName, setUploaderName] = useState('');
  const [description, setDescription] = useState('');
  const [imageList, setImageList] = useState([]);

  //implementing useNavigate
  const navigate = useNavigate();
  const handleMessageClick = () =>{
    console.log('message clicked')
    navigate('/chatroom');
  }

  useEffect(() => {
      FileService.getAllImages().then((response) => {
          setImageList(response.data);
      });
  }, []);

  const onFileChange = (event) => {
    setFiles(event.target.files);
  };

  const onUploaderNameChange = (event) => {
    setUploaderName(event.target.value);
  };

  const onDescriptionChange = (event) => { 
    setDescription(event.target.value);
  };

  const onUpload = (event) => {
    event.preventDefault();
    const formData = new FormData();

    for (const key of Object.keys(files)) {
      formData.append('files', files[key]);
    }
    formData.append('name', uploaderName);
    formData.append('description', description); 

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
    
    <section style={{backgroundColor: '#eee'}}>
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
                  style={{width: '150px'}}
                  fluid/>
                <p className="text-muted mb-1">Pet Sitter Extraordinaire</p>
                <p className="text-muted mb-4">St. Louis, MO</p>
                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn>Follow</MDBBtn>
                  <MDBBtn onClick={() => handleMessageClick()} outline className="ms-1">Message</MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
            <MDBCard>
              <Typography variant="h3" gutterBottom>
                My Pets
              </Typography>
              <Grid container spacing={2}>
                {imageList.map((image) => (
                  <Grid item key={image.id} xs={12}>
                    <Card sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <CardMedia
                        component="img"
                        sx={{width: '100%', height: 200, objectFit: 'cover'}}
                        image={image.fileUri}
                        alt={image.uploaderName}
                      />
                      <div sx={{padding: 2, textAlign: 'center'}}>
                        <Typography variant="h5" gutterBottom>
                          {image.uploaderName}
                        </Typography>
                        <Typography variant="body1">
                          {image.description}
                        </Typography>
                      </div>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            
            
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
                <hr/>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">example@example.com</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr/>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">(097) 234-5678</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr/>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Address</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">St. Louis, MO</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr/>
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
                    <MDBCardText className="mb-4"><span
                      className="text-primary font-italic me-1">Upload Image</span></MDBCardText>
                    <form onSubmit={onUpload}>
                      <div>
                        <label>Select a file:</label>
                        <input type='file' name='file' onChange={onFileChange} multiple/>
                      </div>
                      
                      <div className="mt-3">
                        <label>Pet Name:</label>
                        <input type='text' name='uploaderName' value={uploaderName} onChange={onUploaderNameChange}/>
                      </div>
                      
                      <div className="mt-3">
                        <label>About your pet:</label>
                        <TextField
                          multiline
                          rows={4}
                          
                          fullWidth
                          value={description}
                          onChange={onDescriptionChange}
                          InputProps={{
                            sx: {
                              '& fieldset': {
                                borderColor: 'rgba(0, 0, 0, .8)',
                              },
                            },
                          }}
                        />
                      </div>
                      <br/>
                      <Button type='submit' variant="contained" color="primary" disabled={!files || !uploaderName}>
                        Upload
                      </Button>
                    </form>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">Customer Reviews</MDBCardText>
                    <MDBCardText className="mb-1" style={{fontSize: '.77rem'}}>Promptness</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={80} valuemin={0} valuemax={100}/>
                    </MDBProgress>
                    
                    <MDBCardText className="mt-4 mb-1" style={{fontSize: '.77rem'}}>Communication</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={72} valuemin={0} valuemax={100}/>
                    </MDBProgress>
                    
                    <MDBCardText className="mt-4 mb-1" style={{fontSize: '.77rem'}}>Reliabilty</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={89} valuemin={0} valuemax={100}/>
                    </MDBProgress>
                    
                    <MDBCardText className="mt-4 mb-1" style={{fontSize: '.77rem'}}>Pet Handling Skills</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={55} valuemin={0} valuemax={100}/>
                    </MDBProgress>
                    
                    <MDBCardText className="mt-4 mb-1" style={{fontSize: '.77rem'}}>Flexibility</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={66} valuemin={0} valuemax={100}/>
                    </MDBProgress>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol mb="4">
                <BadgeCard></BadgeCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}


export default Profile;



