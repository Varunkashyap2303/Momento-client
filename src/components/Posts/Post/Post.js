import React, { useState } from "react";
import { Card, CardActions, CardContent, CardMedia, Button, Typography, CardActionArea } from "@mui/material";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from "moment";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import useStyles from './styles';
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../actions/posts";
import { useNavigate } from 'react-router-dom';

const Post = ({ post, setCurrentId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes, setLikes] = useState(post?.likes);
    const userId = user?.result?.sub || user?.result?._id;
    const hasLikedPost = likes.find((like) => like === userId)

    const handleLike = async() => {
        dispatch((likePost(post._id)));

        if(hasLikedPost){
            setLikes(likes.filter((id) => id !==(userId)))
        }
        else{
            setLikes([...likes, userId]);
        }
    }

    const Likes = () =>{
        if(likes.length > 0){
            return likes.find((like) => like === userId)
            ?(
                <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}</>
            )
            :(
                <><ThumbUpOffAltIcon fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
            )
        }
        return <><ThumbUpOffAltIcon fontSize="small" />&nbsp;Like</>
    }

    const openPost = () => navigate(`/posts/${post._id}`);

    return(
        <Card className={classes.card} raised elevation={10}>
            <CardActionArea className={classes.cardActions} onClick={openPost}>
                <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                </div>
                <div className={classes.details}>
                    <Typography variant="body2" color="textSecondary">{post.tags.map((tag) => `#${tag} `)}</Typography>
                </div>
                <Typography className={classes.title} variant="h5" gutterBottom>{post.title}</Typography>
                
            </CardActionArea>
            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
                    <Likes />
                </Button>
                {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && (
                    <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
                        <DeleteIcon color="secondary" fontSize="small" />
                        Delete
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}

export default Post; 