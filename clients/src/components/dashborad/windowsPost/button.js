import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ButtonWindow = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const token = localStorage.getItem('token');

    const handlePublish = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('imageUrl', imageFile);

        try {
            const response = await axios.post(
                'http://localhost:3000/api/auth/post',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('Post created:', response);

          
            setShowAlert(false);
            setAlertMessage('');

            Swal.fire({
                title: "Post Added",
                text: "Your post has been successfully added.",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "http://localhost:3001/Posts";
                }
            });

         
        } catch (error) {
            console.error('Error creating post:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred while creating the post';
            setShowAlert(true);
            setAlertMessage(errorMessage);
            setTimeout(() => setShowAlert(false), 5000);
        }
    };

    const handleInputChange = (event, setter) => {
        setter(event.target.value);
    };

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    return (
        <div>
            <button className='newPost' type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap">New Post</button>
            {/* Modal for creating a new post */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">New Post</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Conditionally render the alert if there's an error */}
                            {showAlert && alertMessage && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    {alertMessage}
                                </div>
                            )}
                            <form>
                                <div className="mb-3 textLine">
                                    <label htmlFor="file-input" className="col-form-label">Upload images:</label>
                                    <input type="file" accept="image/*" className="form-control" id="file-input" onChange={handleFileChange} />
                                    {/* Display the uploaded image */}
                                    {imageFile && (
                                        <img src={URL.createObjectURL(imageFile)} alt="Preview" className="img-thumbnail mt-2 sizingImg"  />
                                    )}
                                </div>
                                <div className="mb-3 textLine">
                                    <label htmlFor="title-input" className="col-form-label">Title:</label>
                                    <input type="text" className="form-control" id="title-input" onChange={(e) => handleInputChange(e, setTitle)} />
                                </div>
                                <div className="mb-3 textLine">
                                    <label htmlFor="description-input" className="col-form-label">Description:</label>
                                    <textarea className="form-control" id="description-input" onChange={(e) => handleInputChange(e, setDescription)}></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handlePublish}>Publish</button>
                        </div>
                    </div>
                </div>
            </div>
          
        </div>
    );
};

export default ButtonWindow;
