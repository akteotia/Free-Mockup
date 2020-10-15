import React, { useState, useEffect } from 'react';
import clientConfig from "../client-config";
import axios from "axios";
import Loader from "./layouts/Loader";
import { Post } from "./layouts/Post";
import { Pagination } from "./layouts/Pagination";
import PostLoader from "./layouts/PostLoader";

export const Posts = ( props ) => {

	const pageId = parseInt( props.pageId );

	const [currentPage, setCurrentPage] = useState( pageId );

	const [totalPages, setTotalPages] = useState( 1 );
	const [loading, setLoading]       = useState( false );
	const [errMessage, setError]      = useState( '' );
	const [posts, setPosts]           = useState( null );

	useEffect( () => {

		const wordPressSiteURL = clientConfig.siteUrl;

		setLoading( true );

		axios.get( `${ wordPressSiteURL }/wp-json/wp/v2/posts/?page_no=${ currentPage }` )
			.then( res => {
             console.log(res);
				setLoading( true );

				if ( 200 === res.status ) {
					setPosts( res.data.posts_data );
					setTotalPages( res.headers["x-wp-totalpages"] );
					console.log(posts);
				} else {
					setError( 'No posts found' );
				}
			} )
			.catch( err => {
				setError( err.response.message );
			} );

	}, [currentPage] );

	const getPosts = ( posts ) => {
		return posts.map( post => <Post key={ post.id } post={ post }/> );
	};

	return (
		<React.Fragment>
			{ loading ? <PostLoader/> : '' }
			<div className="container blog" style={ { overflow: 'hidden' } }>
				{ ( !loading && null !== posts && posts.length ) ? (
					<React.Fragment>
						{ getPosts( posts ) }
						<Pagination
							currentPage={ currentPage }
							setCurrentPage={ setCurrentPage }
						    totalPages={ totalPages }
						/>
					</React.Fragment>
				) : <div>{ errMessage }</div> }
			</div>
		</React.Fragment>
	)

};

export default Posts;
