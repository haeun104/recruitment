import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import PostFormModal from '../components/modals/PostFormModal';
import PostResponseModal from '../components/modals/PostResponseModal';
import { closeModal } from '../redux/editModalSlice';
import { RootState } from '../redux/store';
import { Post } from '../types';

const UpdatePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post>();
  const [responseModal, setResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string>();

  const editModal = useSelector((state: RootState) => state.editModal.isOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        const dataWithId = data.map((post) => ({ ...post.data, id: post.id }));
        const selectedPost = dataWithId.find((post) => post.id === parseInt(postId));
        setPost(selectedPost);
      }
    };
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleSubmit = async (updatedPost) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: updatedPost }),
      });
      if (!response.ok) {
        dispatch(closeModal());
        setResponseMessage('Failed to update a post!');
        setResponseModal(true);
      }

      const data = await response.json();
      console.log(data);

      dispatch(closeModal());
      setResponseMessage('Successfully updated a post!');
      setResponseModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
    navigate('/posts');
  };

  if (post) {
    return (
      <>
        <PostFormModal
          initialData={post}
          isOpen={editModal}
          onClose={handleClose}
          type="edit"
          onSubmit={handleSubmit}
        />
        <PostResponseModal
          open={responseModal}
          onClose={() => {
            setResponseModal(false);
            navigate('/posts');
          }}
          content={responseMessage}
        />
      </>
    );
  }
};

export default UpdatePost;
