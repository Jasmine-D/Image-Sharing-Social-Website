import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { message, Modal } from "antd";
import Gallery from 'react-grid-gallery';
import { BASE_URL, TOKEN_KEY } from "../constants";
import axios from "axios";

const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%",
    textAlign: "center",
};

const wrapperStyle = {
    display: "block",
    minHeight: "1px",
    width: "100%",
    border: "1px solid #ddd",
    overflow: "auto"
};


function PhotoGallery(props) {
    const [images, setImages] = useState(props.images);
    const [curImgIdx, setCurImgIdx] = useState(0);

    const imageArr = images.map( image => {
        return {
            ...image,
            customOverlay: (
                <div style={captionStyle}>
                    <div>{`${image.user}: ${image.caption}`}</div>
                </div>
            )
        };
    });

    const onCurrentImageChange = index => {
        console.log('curIdx ', index);
        setCurImgIdx(index)
    }

    const onDeleteImage = () => {
        if(window.confirm("Are youo gonna delete this image?")) {
            console.log('Deleting...')
            // step1: find the current selected image from the imageArr
            // step2: remove the selected image from the imageArr
            // step3: inform the server to delete the current selected image
            // step4: analyze the response from the server
            //  case1: successfully -> update ui
            //  case2: failed -> inform users
            const curImg = imageArr[curImgIdx];
            const newImageArr = images.filter((img, index) => index !== curImgIdx);
            const opt = {
                method: "DELETE",
                url: `${BASE_URL}/post/${curImg.postId}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                }
            };
            axios(opt)
                .then( res => {
                    console.log('delete result -> ', res);
                    // case1: success
                    if(res.status === 200) {
                        // step1: set state
                        setImages(newImageArr);
                    }
                })
                .catch( err => {
                    // case2: fail
                    message.error('Fetch posts failed!');
                    console.log('fetch posts failed: ', err.message);
                })
        }
    }

    useEffect(() => {
        setImages(props.images)
    }, [props.images])

    return (
        <div style={wrapperStyle}>
            <Gallery images={imageArr}
                     enableImageSelection={false}
                     backdropClosesModal={true}
                     currentImageWillChange={onCurrentImageChange}
                     customControls={[
                         <button
                             onClick={onDeleteImage}>Delete Image</button>
                     ]}


            />
        </div>
    );

}

PhotoGallery.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            user: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            thumbnailWidth: PropTypes.number.isRequired,
            thumbnailHeight: PropTypes.number.isRequired,
        })
    ).isRequired
};

export default PhotoGallery;