import React, { Component } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";
import { PostForm } from "./PostForm";
import { BASE_URL, TOKEN_KEY } from "../constants";

/**
 * reference -> get virtual element in react
 * define: React.createRef() || () => {}
 * read: myRef.current
 */
class CreatePostButton extends Component {
    state = {
        visible: false,
        confirmLoading: false
    };

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleOk = () => {
        this.setState({
            confirmLoading: true
        });

        // get form data
        this.postForm
            .validateFields()
            .then((form) => {
                // step1: create post file obj
                // step2: send file obj to the server
                // step3: analyze the response from the server
                //  case1: successful
                //  case2: failure
                const { description, uploadPost } = form;
                const { type, originFileObj } = uploadPost[0];
                const postType = type.match(/^(image|video)/g)[0];
                if (postType) {
                    let formData = new FormData();
                    formData.append("message", description);
                    formData.append("media_file", originFileObj);

                    const opt = {
                        method: "POST",
                        url: `${BASE_URL}/upload`,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                        },
                        data: formData
                    };

                    axios(opt)
                        .then((res) => {
                            if (res.status === 200) {
                                console.log("res -> ", res)
                                message.success("The image/video is uploaded!");
                                // reset form fields
                                // inform users
                                // refresh posts list section
                                this.postForm.resetFields();
                                this.handleCancel();
                                this.props.onShowPost(postType);
                                this.setState({ confirmLoading: false });
                            }
                        })
                        .catch((err) => {
                            console.log("Upload image/video failed: ", err.message);
                            message.error("Failed to upload image/video!");
                            this.setState({ confirmLoading: false });
                        });
                }
            })
            .catch((err) => {
                console.log("err ir validate form -> ", err);
                this.handleCancel();
            });
    };

    handleCancel = () => {
        console.log("Clicked cancel button");
        this.setState({
            visible: false
        });
    };

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    onOk={this.handleOk}
                    okText="Create"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <PostForm
                        ref={ postFormInstance => {
                        this.postForm = postFormInstance
                    }}/>
                </Modal>
            </div>
        );
    }
}
export default CreatePostButton;