import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditPostModal = ({ postId , handleEditPost , modalId }) => {
  const [post, setPost] = useState({ title: '', description: '', imageUrl: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (!postId) {
  
      return;
    }
    
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`http://localhost:3000/api/auth/post/${postId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPost(response.data);
      } catch (err) {
        setAlertMessage('Failed to fetch post');
        setShowAlert(true);
      }
    };

    fetchPost();
  }, [postId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPost({ ...post, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token'); 
      await axios.put(`http://localhost:3000/api/auth/post/${postId}`, post, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     
      window.location.reload(); 
    } catch (err) {
      setAlertMessage('Failed to update post');
      setShowAlert(true);
    }
  };

  return (
    <div>
      <button className='editPost inPending' type="button" data-bs-toggle="modal" data-bs-target={`#${modalId}`} data-bs-whatever="@getbootstrap" onClick={() => handleEditPost(postId)}>Edit Post</button>
      {/* Modal for editing a post */}
      <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}Label`} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editPostModalLabel">Edit Post</h1>
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
                  <label htmlFor="edit-file-input" className="col-form-label">Upload image:</label>
                  <input type="file" accept="image/*" className="form-control" id="edit-file-input" onChange={handleFileChange} />
                  {post.imageUrl && <img src={`http://localhost:3000/${post.imageUrl}`} alt="Preview" className="img-thumbnail mt-2" />}
                </div>
                <div className="mb-3 textLine">
                  <label htmlFor="edit-title-input" className="col-form-label">Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="edit-title-input"
                    name="title"
                    value={post.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3 textLine">
                  <label htmlFor="edit-description-input" className="col-form-label">Description:</label>
                  <textarea
                    className="form-control"
                    id="edit-description-input"
                    name="description"
                    value={post.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
   
    </div>
  );
};

export default EditPostModal;
