import React, { useState, useEffect } from "react";
import { Tabs, message, Row, Col, Button } from "antd";
import axios from "axios";

import SearchBar from "./SearchBar";
import PhotoGallery from "./PhotoGallery";
import CreatePostButton from "./CreatePostButton";

import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from "../constants";

const { TabPane } = Tabs;

function Home(props) {
    const [posts, setPost] = useState([]);
    const [activeTab, setActiveTab] = useState("image");
    const [searchOption, setSearchOption] = useState({
        type: SEARCH_KEY.all,
        keyword: ""
    });

    const handleSearch = (option) => {
        const { type, keyword } = option;
        setSearchOption({ type: type, keyword: keyword });
    };

    useEffect(() => {
        // fetch post from the server
        // do search the first time
        //   -> didMount -> search option: {type: all, value: ""}
        // after the first search
        //   -> didUpdate -> search option: {type: key/user, value: searchContent}
        const { type, keyword } = searchOption;
        fetchPost(searchOption);
    }, [searchOption]);

    const fetchPost = (option) => {
        // get searchType and content
        // send fetching request to the server
        // get response
        //      case1: fetch succuess => update post
        //      case2: fetch fail => inform user
        const { type, keyword } = option;
        let url = "";

        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type === SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keyword}`;
        } else {
            url = `${BASE_URL}/search?keywords=${keyword}`;
        }

        const opt = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    setPost(res.data);
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!");
                console.log("fetch posts failed: ", err.message);
            });
    };

    const renderPosts = (type) => {
        // case1: !post || post is empty => no data
        // case2: option: image => filter images and display
        // case3: option: video => filter videos and display
        if (!posts || posts.length === 0) {
            return <div>No data!</div>;
        }
        if (type === "image") {
            // remove all non-image posts
            // add attribute to each image post
            // pass image to PhotoGallery
            const imageArr = posts
                .filter((item) => item.type === "image")
                .map((image) => {
                    return {
                        postId: image.id,
                        src: image.url,
                        user: image.user,
                        caption: image.message,
                        thumbnail: image.url,
                        thumbnailWidth: 300,
                        thumbnailHeight: 200
                    };
                });
            console.log(imageArr);
            return <PhotoGallery images={imageArr} />;
        } else if (type === "video") {
            console.log("video -> ", posts);
            return (
                <Row gutter={32}>
                    {
                        posts.filter( post => post.type === "video")
                            .map( post => (
                                <Col span={8} key={post.url}>
                                    <video
                                        src={post.url}
                                        controls={true}
                                        className="video-block"
                                    />
                                    <p>
                                        {post.user} : {post.message}
                                    </p>
                                </Col>
                            ))
                    }
                </Row>
            );
        }
    };

    const showPost = (postType) => {
        // post type
        console.log('post type -> ', postType)
        setActiveTab(postType)
        setTimeout(() => {
            // refresh post list
            setSearchOption({ type: SEARCH_KEY.all, keyword: ""});
        }, 3000);
    }

    // new CreatePostButton() => this -> {} -> { form: postFormInstance } => return this
    const operations = <CreatePostButton onShowPost={showPost}/>;
    return (
        <div className="home">
            <SearchBar handleSearch={handleSearch}/>
            <div className="display">
                <Tabs
                    onChange={(key) => setActiveTab(key)}
                    defaultActiveKey="image"
                    activeKey={activeTab}
                    tabBarExtraContent={operations}
                >
                    <TabPane tab="Images" key="image">
                        {renderPosts("image")}
                    </TabPane>
                    <TabPane tab="Videos" key="video">
                        {renderPosts("video")}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}

export default Home;