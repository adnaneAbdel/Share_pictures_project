// ImageModal.js
import React from 'react';
import './imageModal.css';

const ImageModal = ({ imageUrl, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>
                <img src={`http://localhost:3000/${imageUrl}`} alt="Enlarged" className="modal-image" />
            </div>
        </div>
    );
};

export default ImageModal;
